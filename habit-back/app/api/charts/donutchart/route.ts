import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const [rows]: any = await pool.query(
      `SELECT status, COUNT(*) as count FROM habitlog 
       WHERE user_id = ? AND DATE(date) = CURDATE()
       GROUP BY status`,
      [user_id]
    );

    // Format data for frontend chart
    const result = {
      completed: rows.find((row: any) => row.status === "Completed")?.count || 0,
      pending: rows.find((row: any) => row.status === "Pending")?.count || 0,
    };
    console.log("PROGRESS:",result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching habit status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
