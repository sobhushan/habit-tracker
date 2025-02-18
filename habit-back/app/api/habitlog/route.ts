// //app/api/habitlog/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/auth";

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
