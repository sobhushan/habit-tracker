// //app/api/habitlog/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/auth";

export async function PUT(req: NextRequest) {
  const { user_id, habit_id, status} = await req.json();

  try {
    const [existingLog]: any = await pool.query(
      "SELECT * FROM habitlog WHERE user_id = ? AND habit_id = ? AND DATE(date) = CURDATE()",
      [user_id, habit_id]
    );
    console.log("habitlog PUT res:======> ", existingLog);

    if (existingLog.length > 0) {
      // Update existing habit log
      await pool.query(
        "UPDATE habitlog SET status = ?, date = NOW() WHERE user_id = ? AND habit_id = ? AND DATE(date) = CURDATE()",
        [status, user_id, habit_id]
      );
       // Update points in user_rewards
      await pool.execute(
       `UPDATE user_rewards SET points = points + 10 WHERE user_id = ?`,
       [user_id]
      );
      return NextResponse.json({ message: `Habit status updated to ${status}` });
    } else {
      // Insert a new log if no entry exists for today
      await pool.query(
        "INSERT INTO habitlog (user_id, habit_id, status, date) VALUES (?, ?, ?, NOW())",
        [user_id, habit_id, status]
      );
      return NextResponse.json({ message: `New habit log created with status: ${status}` });
      // return NextResponse.json({ message: `not exist the Habit in log: ${status}` });
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
        'INSERT INTO habitlog (user_id, habit_id, status, date) VALUES (?, ?, ?, NOW())',
        [user_id, habit_id, status]
      );
  
      return NextResponse.json({ message: 'Habit completion logged successfully', logResult });
    } catch (error) {
      console.error('Error logging habit completion:', error);
      return NextResponse.json({ error: 'Failed to log habit completion' });
    }
  }

  
