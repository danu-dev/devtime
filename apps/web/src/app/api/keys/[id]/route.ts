import { NextResponse } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { cookies } from "next/headers";

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const keyId = url.pathname.split("/").pop();

    if (!keyId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await AuthService.deleteApiKey(keyId, userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
