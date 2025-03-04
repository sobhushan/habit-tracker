// app/api/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/auth"; // Ensure your MySQL connection is set up properly

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    console.log("📢 Fetching habit completion stats for user:", userId);

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split("T")[0];

    // Get the most completed habit
    const [topHabit]: any = await pool.query(
      `SELECT h.title, COUNT(*) as count 
       FROM habitlog hl
       JOIN habits h ON hl.habit_id = h.habit_id
       WHERE hl.user_id = ? AND hl.status = 'Completed'
       GROUP BY hl.habit_id
       ORDER BY count DESC
       LIMIT 1`,
      [userId]
    );

    // Calculate completion rate for the current month
    const [completionStats]: any = await pool.query(
      `SELECT 
          COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed,
          COUNT(*) as total
       FROM habitlog 
       WHERE user_id = ? AND DATE(date) >= ?`,
      [userId, startOfMonth]
    );

    const completed = completionStats[0]?.completed || 0;
    const total = completionStats[0]?.total || 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Get longest streak
    const [streaks]: any = await pool.query(
        `WITH StreakData AS (
            SELECT DISTINCT DATE(date) AS habit_date
            FROM habitlog
            WHERE user_id = ? AND status = 'Completed'
        ),
        StreakGroups AS (
            SELECT 
                habit_date, 
                habit_date - INTERVAL (ROW_NUMBER() OVER (ORDER BY habit_date)) DAY AS streak_group
            FROM StreakData
        )
        SELECT MAX(streak_count) AS longest_streak FROM (
            SELECT COUNT(*) AS streak_count 
            FROM StreakGroups 
            GROUP BY streak_group
        ) AS streak_lengths;`,
        [userId]
      );
      
      const longestStreak = streaks.length > 0 && streaks[0]?.longest_streak ? streaks[0].longest_streak : 0;
      

    return NextResponse.json({
      topHabit: topHabit.length > 0 ? topHabit[0] : { title: "No habits yet", count: 0 },
      completionRate,
      longestStreak,
    });
  } catch (error) {
    console.error("❌ Error fetching habit completion stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch habit stats" },
      { status: 500 }
    );
  }
}
