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
      `SELECT category, COUNT(*) as count 
       FROM habits 
       WHERE user_id = ? 
       GROUP BY category`, 
      [user_id]
    );

    // Format data for frontend chart
    const categories = {
      Work: 0,
      Fitness: 0,
      Leisure: 0,
      Health: 0,
      "Self-care": 0,
      Growth: 0,
      Relationships: 0,
      Finances: 0,
      Other: 0,
    };

    rows.forEach((row: any) => {
      if (categories.hasOwnProperty(row.category)) {
        categories[row.category as keyof typeof categories] = row.count;
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching habit categories:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
