import { NextResponse } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { cookies } from "next/headers";

async function getSessionUserId() {
  const cookieStore = await cookies();
  return cookieStore.get("userId")?.value;
}

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const keys = await AuthService.listUserKeys(userId);
    return NextResponse.json({ keys });
  } catch (error) {
    console.error("[API Keys GET Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const name = body.name || "Default Key";

    const result = await AuthService.generateApiKey(userId, name);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API Keys POST Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
