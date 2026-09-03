import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { checkRateLimit } from "@/lib/rateLimit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const rateLimit = checkRateLimit(`register:${ip}`, 5, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please retry in ${rateLimit.reset}s.` },
        { status: 429, headers: { "Retry-After": String(rateLimit.reset) } }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Malformed payload" }, { status: 400 });

    const { email, password, name } = body;

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email) || email.length > 255) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    if (!password || typeof password !== "string" || password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: "Password must be 8-128 characters" }, { status: 400 });
    }

    const sanitizedName = typeof name === "string" ? name.trim().slice(0, 100) : null;
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: sanitizedName,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Register Error]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
