//app/api/badges/route.ts
import { NextResponse, NextRequest } from "next/server";
import pool from "@/app/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Fetch highest streak
    const [streakData] = await pool.execute(
      `SELECT highest_streak FROM user_rewards WHERE user_id = ?`,
      [userId]
    );

    const highestStreak = (streakData as any[])[0]?.highest_streak || 0;

    let earnedBadges: string[] = [];

    if (highestStreak >= 7) earnedBadges.push("7-Day Streak");
    if (highestStreak >= 30) earnedBadges.push("30-Day Streak");
    if (highestStreak >= 100) earnedBadges.push("100-Day Streak");

    return NextResponse.json({ badges: earnedBadges });
  } catch (error) {
    console.error("❌ Error fetching badges:", error);
    return NextResponse.json({ error: "Failed to fetch badges" }, { status: 500 });
  }
}
