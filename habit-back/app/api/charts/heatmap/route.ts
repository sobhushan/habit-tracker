// app/api/charts/heatmap/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/auth";
import { parseISO, format, subDays } from "date-fns";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
        const results: any = await pool.query(
        `SELECT DATE(date) as habit_date, COUNT(*) as count FROM habitlog 
         WHERE user_id = ? AND status = 'Completed' 
         AND DATE(date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 180 DAY) AND CURDATE()
         GROUP BY habit_date`,
        [user_id]
      );
      
      // Formatting data for last 180 days
      const last180Days = Array.from({ length: 180 }).map((_, i) => ({
        date: format(subDays(new Date(), i), "yyyy-MM-dd"),
        count: 0,
      })).reverse();
      
      (results[0] || []).forEach((row: any) => {
        const formattedDate = format(new Date(row.habit_date), "yyyy-MM-dd");
        const index = last180Days.findIndex((day) => day.date === formattedDate);
        if (index !== -1) {
          last180Days[index].count = row.count;
        }
      });
      
      return NextResponse.json(last180Days);   

  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//=======================================================================================
//for 30 days
// const results: any = await pool.query(
//     `SELECT DATE(date) as habit_date, COUNT(*) as count FROM habitlog 
//      WHERE user_id = ? AND status = 'Completed' 
//      AND DATE(date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()
//      GROUP BY habit_date`,
//     [user_id]
//   );

//   // Formatting data for last 30 days
//   const last30Days = Array.from({ length: 30 }).map((_, i) => ({
//     date: format(subDays(new Date(), i), "yyyy-MM-dd"),
//     count: 0,
//   })).reverse();

//   results.forEach((row: any) => {
//     const index = last30Days.findIndex((day) => day.date === row.habit_date);
//     if (index !== -1) {
//       last30Days[index].count = row.count;
//     }
//   });

//   // Ensure MySQL date format matches JS format
//   const habitData = results[0] || []; // Extract the actual result set

//   habitData.forEach((row: any) => {
//   if (!row.habit_date) return; // Skip invalid rows

//   const formattedDate = format(new Date(row.habit_date), "yyyy-MM-dd"); // Convert MySQL DATE to YYYY-MM-DD
  
//   const index = last30Days.findIndex((day) => day.date === formattedDate);
//   if (index !== -1) {
//       last30Days[index].count = row.count;
//   }
//   });
    
//   console.log("Heatmap Query Results:", results);

//   return NextResponse.json(last30Days);
// ================================================================================

//90 days
// const results: any = await pool.query(
//     `SELECT DATE(date) as habit_date, COUNT(*) as count FROM habitlog 
//      WHERE user_id = ? AND status = 'Completed' 
//      AND DATE(date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 90 DAY) AND CURDATE()
//      GROUP BY habit_date`,
//     [user_id]
//   );
  
//   // Formatting data for last 90 days
//   const last90Days = Array.from({ length: 90 }).map((_, i) => ({
//     date: format(subDays(new Date(), i), "yyyy-MM-dd"),
//     count: 0,
//   })).reverse();
  
//   (results[0] || []).forEach((row: any) => {
//     const formattedDate = format(new Date(row.habit_date), "yyyy-MM-dd");
//     const index = last90Days.findIndex((day) => day.date === formattedDate);
//     if (index !== -1) {
//       last90Days[index].count = row.count;
//     }
//   });
  
//   return NextResponse.json(last90Days);