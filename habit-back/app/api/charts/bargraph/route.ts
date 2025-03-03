// app/api/charts/bargraph/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/auth";
import { format, subDays } from "date-fns";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Fetch completed habits in the last 7 days
    const [results]: any = await pool.query(
      `SELECT DATE(date) as habit_date, COUNT(*) as count 
       FROM habitlog 
       WHERE user_id = ? AND status = 'Completed' 
       AND DATE(date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
       GROUP BY habit_date 
       ORDER BY habit_date ASC`,
      [user_id]
    );

    // Initialize last 7 days with 0 values
    const last7Days = Array.from({ length: 7 }).map((_, i) => ({
      date: format(subDays(new Date(), i), "yyyy-MM-dd"),
      count: 0,
    })).reverse();

    // Map the results to the last 7 days
    results.forEach((row: any) => {
      const formattedDate = format(new Date(row.habit_date), "yyyy-MM-dd");
      const index = last7Days.findIndex((day) => day.date === formattedDate);
      if (index !== -1) {
        last7Days[index].count = row.count;
      }
    });

    return NextResponse.json(last7Days);
  } catch (error) {
    console.error("Error fetching weekly progress:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

