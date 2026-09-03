import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const rateLimit = checkRateLimit(`login:${ip}`, 10, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many login attempts. Retry in ${rateLimit.reset}s.` },
        { status: 429, headers: { "Retry-After": String(rateLimit.reset) } }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Malformed payload" }, { status: 400 });

    const { email, password } = body;
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Login Error]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
