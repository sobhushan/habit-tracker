// //app/api/newstat/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/auth";

export async function PUT(req: NextRequest) {
  const { user_id, habit_id, status, date} = await req.json();

  try {
    const [existingLog]: any = await pool.query(
      "SELECT * FROM habitlog WHERE user_id = ? AND habit_id = ? AND DATE(date) = ?",
      [user_id, habit_id, date]
    );
    console.log("newstat PUT res:======> ", existingLog);

    if (existingLog.length > 0) {
      // Update existing habit log
      await pool.query(
        "UPDATE habitlog SET status = ? WHERE user_id = ? AND habit_id = ? AND DATE(date) = ?",
        [status, user_id, habit_id, date]
      );
      return NextResponse.json({ message: `Habit status updated to ${status}` });
    } else {
        const [habitInfo]: any = await pool.query(
            "SELECT title FROM habits WHERE habit_id = ?",
            [habit_id]
        );
        if (habitInfo.length === 0) {
            return NextResponse.json({ error: "Habit not found" });
          }
    
          const habitTitle = habitInfo[0].title;
    
          await pool.query(
            "INSERT INTO habitlog (user_id, habit_id, status, date, title) VALUES (?, ?, ?, ?, ?)",
            [user_id, habit_id, status, date, habitTitle]
          );
    
          return NextResponse.json({ message: `New habit log created with status: ${status}` });
        return NextResponse.json({ message: `Habit not found: ${status}` });
    }
  } catch (error) {
    console.error("Error updating habit log:", error);
    return NextResponse.json({ error: "Failed to update habit log" });
  }
}