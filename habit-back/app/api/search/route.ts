// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/auth";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query");
    const userId = url.searchParams.get("user_id"); // Pass user_id to filter habits by user

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const [results] = await pool.query(
      `SELECT habit_id, title, status, category, streak
       FROM habits 
       WHERE user_id = ? AND title LIKE ?`,
      [userId, `%${query}%`]
    );

    return NextResponse.json(results, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in search API:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

