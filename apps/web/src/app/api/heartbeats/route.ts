import { NextResponse } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { HeartbeatRepository } from "@/server/repositories/heartbeat.repository";
import { heartbeatsPayloadSchema } from "@devtime/shared";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, limit: number = 60): boolean {
  const now = Date.now();
  let record = rateLimitMap.get(key);

  if (!record || record.resetAt < now) {
    record = { count: 0, resetAt: now + 60000 };
  }

  record.count++;
  rateLimitMap.set(key, record);
  return record.count <= limit;
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    const key = authHeader?.replace(/^Bearer\s+/i, "").trim();

    if (!key || !checkRateLimit(key)) {
      return NextResponse.json({ error: "Too many requests or missing key" }, { status: 429 });
    }

    const user = await AuthService.authenticateApiKey(authHeader);
    if (!user) {
      return NextResponse.json({ error: "Invalid or revoked API key" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = heartbeatsPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", details: parsed.error.format() }, { status: 400 });
    }

    const heartbeats = parsed.data.heartbeats.map((hb) => ({
      userId: user.id,
      entity: hb.entity,
      project: hb.project,
      language: hb.language,
      framework: hb.framework,
      editor: hb.editor,
      branch: hb.branch,
      operatingSystem: hb.operatingSystem,
      machine: hb.machine,
      isWrite: hb.isWrite,
      activityAt: new Date(hb.timestamp * 1000),
    }));

    const count = await HeartbeatRepository.createMany(heartbeats);
    return NextResponse.json({ success: true, accepted: count });
  } catch (error) {
    console.error("[API Heartbeats Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
