// // app/api/statuslog/route.ts
// import { NextResponse, NextRequest } from "next/server";
// import pool from "@/app/auth";

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const userId = searchParams.get('user_id');

//   if (!userId) {
//     return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
//   }

//   try {
//     // Query to fetch the latest habit status for each unique date
//     const [results] = await pool.execute(
//       `SELECT h.habit_id, h.title, hl.status, DATE(hl.date) AS created_date
//        FROM habits h
//        JOIN habitlog hl ON h.habit_id = hl.habit_id
//        WHERE h.user_id = ?
//        AND hl.date IN (
//          SELECT MAX(hl2.date)
//          FROM habitlog hl2
//          WHERE hl2.habit_id = hl.habit_id
//          GROUP BY hl2.habit_id, DATE(hl2.date)
//        )`,
//       [userId]
//     );

//     // Now results is an array of rows
//     const habits = results as { habit_id: number, title: string, status: string, created_date: string }[];

//     // Format the result into a date-based structure
//     const habitStatusMap: Record<string, { title: string, status: string }[]> = {};

//     habits.forEach((habit) => {
//       const dateKey = habit.created_date;

//       if (!habitStatusMap[dateKey]) {
//         habitStatusMap[dateKey] = [];
//       }

//       habitStatusMap[dateKey].push({
//         title: habit.title,
//         status: habit.status,
//       });
//     });

//     return NextResponse.json(habitStatusMap);
//   } catch (error) {
//     console.error('Error fetching habit status:', error);
//     return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
//   }
// }

import { NextResponse, NextRequest } from "next/server";
import pool from "@/app/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const [results] = await pool.execute(
      `SELECT h.habit_id, h.title, hl.status, DATE_FORMAT(hl.date, '%Y-%m-%d') AS created_date
       FROM habits h
       JOIN habitlog hl ON h.habit_id = hl.habit_id
       WHERE h.user_id = ?
       AND (hl.date, hl.habit_id) IN (
         SELECT MAX(hl2.date), hl2.habit_id
         FROM habitlog hl2
         WHERE hl2.habit_id = hl.habit_id
         GROUP BY hl2.habit_id, DATE(hl2.date)
       )`,
      [userId]
    );

    const habits = results as { habit_id: number, title: string, status: string, created_date: string }[];

    const habitStatusMap: Record<string, { habit_id: number, title: string, status: string, date: string}[]> = {};

    habits.forEach((habit) => {
      const dateKey = habit.created_date;

      if (!habitStatusMap[dateKey]) {
        habitStatusMap[dateKey] = [];
      }

      habitStatusMap[dateKey].push({
        habit_id: habit.habit_id,
        title: habit.title,
        status: habit.status,
        date: habit.created_date,
      });
    });

    console.log("✅ API Response:", habitStatusMap);
    return NextResponse.json(habitStatusMap);
  } catch (error) {
    console.error("❌ Error fetching habit status:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

