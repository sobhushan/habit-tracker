import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/auth";

export async function GET(req: NextRequest) {
  try {
    const [habits]: any = await pool.query("SELECT user_id, habit_id FROM habits");

    if (habits.length > 0) {
      const values = habits.map(({ user_id, habit_id }: any) => `(${user_id}, ${habit_id}, 'Pending', CURDATE())`).join(", ");
      await pool.query(`INSERT INTO habitlog (user_id, habit_id, status, date) VALUES ${values}`);
    }

    return NextResponse.json({ message: "Midnight habit log entries added successfully" });
  } catch (error) {
    console.error("Error inserting midnight habit log entries:", error);
    return NextResponse.json({ error: "Failed to insert habit logs" });
  }
}
