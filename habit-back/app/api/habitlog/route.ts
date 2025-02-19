// //app/api/habitlog/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/auth";

  export async function PUT(req: NextRequest) {
    const { user_id, habit_id, status } = await req.json();
  
    try {
      const [existingLog]: any = await pool.query(
        "SELECT * FROM habitlog WHERE user_id = ? AND habit_id = ? AND date = CURDATE()",
        [user_id, habit_id]
      );
      console.log("res:======> ",existingLog);
  
      if (existingLog.length > 0) {
        await pool.query(
          "UPDATE habitlog SET status = ? WHERE user_id = ? AND habit_id = ? AND date = CURDATE()",
          [status, user_id, habit_id]
        );
        return NextResponse.json({ message: `Habit status updated to ${status}` });
      } else {
        // Insert a new log if none exists for today
        await pool.query(
          "INSERT INTO habitlog (user_id, habit_id, status, date) VALUES (?, ?, ?, CURDATE())",
          [user_id, habit_id, status]
        );
        return NextResponse.json({ message: `New habit log created with status: ${status}` });
        // return NextResponse.json({ error: "No entry found for today" }, { status: 404 });
      }
    } catch (error) {
      console.error("Error updating habit log:", error);
      return NextResponse.json({ error: "Failed to update habit log" });
    }
  }
  
  export async function POST(req: NextRequest, res: NextResponse) {
    const { user_id, habit_id, status } = await req.json();
    console.log("received habitlog: ",{ user_id, habit_id, status })

    try {
      const [logResult] = await pool.query(
        'INSERT INTO habitlog (user_id, habit_id, status, date) VALUES (?, ?, ?, ?)',
        [user_id, habit_id, status, new Date()]
      );
  
      return NextResponse.json({ message: 'Habit completion logged successfully', logResult });
    } catch (error) {
      console.error('Error logging habit completion:', error);
      return NextResponse.json({ error: 'Failed to log habit completion' });
    }
  }
