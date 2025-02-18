// //app/api/streaklog/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/auth";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const habit_id = searchParams.get("habit_id");

    if (!user_id || !habit_id) {
        return NextResponse.json({ error: "Missing user_id or habit_id" }, { status: 400 });
    }

    try {
        // Fetch the latest streak data for the given user and habit
        const [streakResult]: any = await pool.query(
            "SELECT streak_count, last_completed FROM streaklog WHERE user_id = ? AND habit_id = ?",
            [user_id, habit_id]
        );

        // Fetch the latest habit completion status
        const [habitLogResult]: any = await pool.query(
            "SELECT status FROM habitlog WHERE user_id = ? AND habit_id = ? ORDER BY date DESC LIMIT 1",
            [user_id, habit_id]
        );

        return NextResponse.json({
            message: "Streak data fetched successfully",
            streak: streakResult.length > 0 ? streakResult[0] : { streak_count: 0, last_completed: null },
            habit_status: habitLogResult.length > 0 ? habitLogResult[0].status : "Pending"
        });
    } catch (error) {
        console.error("Error fetching streak data:", error);
        return NextResponse.json({ error: "Failed to fetch streak data" }, { status: 500 });
    }
}

// export async function POST(req: NextRequest) {
//     const { user_id, habit_id, status } = await req.json();

//     if (!user_id || !habit_id || status === undefined) {
//         return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     try {
//         // Fetch the current streak data
//         const [streakData]: any = await pool.query(
//             "SELECT streak_id, streak_count, last_completed FROM streaklog WHERE user_id = ? AND habit_id = ?",
//             [user_id, habit_id]
//         );

//         const today = new Date();
//         const yesterday = new Date();
//         yesterday.setDate(yesterday.getDate() - 1);

//         let streak_count = 1; // Default to 0 if new streak
//         let last_completed = today;

//         if (streakData.length > 0) {
//             const { streak_id, streak_count: existingStreak, last_completed: lastCompleted } = streakData[0];
//             const lastCompletedDate = new Date(lastCompleted);

//             // Check if marked complete today
//             if (status) {
//                 if (lastCompletedDate.toDateString() === yesterday.toDateString()) {
//                     streak_count = existingStreak + 1; // Continue streak
//                 } else if (lastCompletedDate.toDateString() !== today.toDateString()) {
//                     streak_count = 1; // Reset streak
//                 }

//                 await pool.query(
//                     "UPDATE streaklog SET streak_count = ?, last_completed = ? WHERE streak_id = ?",
//                     [streak_count, today, streak_id]
//                 );
//             } else {
//                 // If marking as incomplete, reset last_completed but keep streak count
//                 await pool.query(
//                     "UPDATE streaklog SET last_completed = NULL WHERE streak_id = ?",
//                     [streak_id]
//                 );
//             }
//         } else {
//             // Create new streak entry if none exists
//             await pool.query(
//                 "INSERT INTO streaklog (user_id, habit_id, streak_count, last_completed) VALUES (?, ?, ?, ?)",
//                 [user_id, habit_id, streak_count, today]
//             );
//         }

//         return NextResponse.json({ message: "Streak log updated successfully", streak_count });
//     } catch (error) {
//         console.error("Error updating streak log:", error);
//         return NextResponse.json({ error: "Failed to update streak log" }, { status: 500 });
//     }
// }
// ===============================================================================================
export async function POST(req: NextRequest) {
  const { user_id, habit_id, status } = await req.json();

  if (!user_id || !habit_id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
      // Fetch the current streak data
      const [streakData]: any = await pool.query(
          "SELECT streak_id, streak_count, last_completed FROM streaklog WHERE user_id = ? AND habit_id = ?",
          [user_id, habit_id]
      );

      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      let streak_count = 1; // Default to 0 if new streak
      let last_completed = today;

      if (streakData.length > 0) {
          const { streak_id, streak_count: existingStreak, last_completed: lastCompleted } = streakData[0];
          const lastCompletedDate = new Date(lastCompleted);

          // Check if marked complete today
          if (status === "Completed") {
              if (lastCompletedDate.toDateString() === yesterday.toDateString()) {
                  streak_count = existingStreak + 1; // Continue streak
              } else if (lastCompletedDate.toDateString() !== today.toDateString()) {
                  streak_count = 1; // Reset streak
              }

              await pool.query(
                  "UPDATE streaklog SET streak_count = ?, last_completed = ? WHERE streak_id = ?",
                  [streak_count, today, streak_id]
              );
          } else if (status === "Pending") {
              // If status is Pending, decrease streak count by 1 if possible
              if (existingStreak > 0) {
                  streak_count = existingStreak - 1; // Decrease streak count
              }

              // Reset last_completed but keep streak count
              await pool.query(
                  "UPDATE streaklog SET streak_count = ?, last_completed = NULL WHERE streak_id = ?",
                  [streak_count, streak_id]
              );
          }
      } else {
          // Create new streak entry if none exists
          await pool.query(
              "INSERT INTO streaklog (user_id, habit_id, streak_count, last_completed) VALUES (?, ?, ?, ?)",
              [user_id, habit_id, streak_count, today]
          );
      }

      return NextResponse.json({ message: "Streak log updated successfully", streak_count });
  } catch (error) {
      console.error("Error updating streak log:", error);
      return NextResponse.json({ error: "Failed to update streak log" }, { status: 500 });
  }
}
