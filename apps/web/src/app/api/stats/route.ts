import { NextResponse } from "next/server";
import { StatsService } from "@/server/services/stats.service";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const range = url.searchParams.get("range") || "today";

    const stats = await StatsService.getAggregatedStats(userId, range);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[API Stats Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
