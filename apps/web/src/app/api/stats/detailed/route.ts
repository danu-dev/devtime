import { NextResponse } from "next/server";
import { DetailedStatsService } from "@/server/services/detailedStats.service";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    if (type === "timeline") {
      const data = await DetailedStatsService.getActivityTimeline(userId);
      return NextResponse.json(data);
    }
    if (type === "projects") {
      const data = await DetailedStatsService.getProjectsBreakdown(userId);
      return NextResponse.json(data);
    }
    if (type === "languages") {
      const data = await DetailedStatsService.getLanguagesBreakdown(userId);
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid type param" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
