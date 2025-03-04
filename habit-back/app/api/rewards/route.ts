//app/api/rewards/route.ts
import { NextResponse, NextRequest } from "next/server";
import pool from "@/app/auth";

// Function to determine badges based on points & streaks
function getBadges(points: number, highestStreak: number): string[] {
  let badges: string[] = [];

  // Point-based badges
  if (points >= 200) badges.push("Gold Achiever");
  else if (points >= 100) badges.push("Silver Achiever");
  else if (points >= 50) badges.push("Bronze Achiever");

  // Streak-based badges
  if (highestStreak >= 30) badges.push("Streak Master");
  else if (highestStreak >= 15) badges.push("Dedicated");
  else if (highestStreak >= 7) badges.push("One Week Warrior");

  return badges;
}

// GET: Fetch rewards for a user
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    console.log("📢 Fetching rewards for user:", userId);

    const [results]: any = await pool.execute(
      `SELECT reward_id, habit_id, points, highest_streak, badges, earned_at 
       FROM user_rewards WHERE user_id = ?`,
      [userId]
    );

    if (!results.length) {
      return NextResponse.json({ error: "No rewards found" }, { status: 404 });
    }

    // Convert badges from text to an array
    const rewards = results.map((reward: any) => ({
      ...reward,
      badges: reward.badges ? reward.badges.split(",") : [],
    }));

    console.log("✅ Rewards Data:", rewards);
    return NextResponse.json(rewards);
  } catch (error) {
    console.error("❌ Error fetching rewards:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
    try {
      const { user_id, habit_id, status } = await req.json();
      if (!user_id || !habit_id || !status) {
        return NextResponse.json({ error: "Missing user_id, habit_id, or status" }, { status: 400 });
      }
  
      console.log("📢 Updating rewards for User:", user_id, "Habit:", habit_id, "Status:", status);
  
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];
  
      // Fetch the last recorded status for today
      const [lastLog]: any = await pool.query(
        `SELECT status FROM habitlog 
         WHERE user_id = ? AND habit_id = ? AND DATE(date) = ?
         ORDER BY date DESC LIMIT 1`,
        [user_id, habit_id, today]
      );
  
      const lastStatus = lastLog.length > 0 ? lastLog[0].status : null;
  
      // If marking as "incomplete" after being "complete", subtract points
      if (status === "incomplete" && lastStatus === "complete") {
        console.log("⚠️ Habit marked incomplete after completion. Subtracting points.");
  
        // Fetch current user reward data
        const [existingReward]: any = await pool.query(
          `SELECT points FROM user_rewards WHERE user_id = ? AND habit_id = ?`,
          [user_id, habit_id]
        );
  
        if (existingReward.length > 0) {
          let updatedPoints = existingReward[0].points - 10; // Subtract base points
          if (updatedPoints < 0) updatedPoints = 0; // Prevent negative points
  
          // Update the user rewards table
          await pool.query(
            `UPDATE user_rewards SET points = ? WHERE user_id = ? AND habit_id = ?`,
            [updatedPoints, user_id, habit_id]
          );
  
          return NextResponse.json({
            message: "Points deducted due to incomplete status.",
            totalPoints: updatedPoints,
          });
        }
      }
  
      // If marking as "complete" and not already completed today, add points
      if (status === "complete") {
        const [completedToday]: any = await pool.query(
          `SELECT COUNT(*) as count FROM habitlog 
           WHERE user_id = ? AND habit_id = ? AND status = 'complete' AND DATE(date) = ?`,
          [user_id, habit_id, today]
        );
  
        if (completedToday[0].count > 0) {
          console.log("⚠️ Habit was already completed today. No extra points awarded.");
          return NextResponse.json({ message: "No points awarded. Habit was already completed today." });
        }
  
        let currentStreak = 1;
        const [logs]: any = await pool.query(
          `SELECT DATE(date) as log_date 
           FROM habitlog 
           WHERE user_id = ? AND habit_id = ? 
           ORDER BY date DESC LIMIT 1`,
          [user_id, habit_id]
        );
  
        const lastLogDate = logs.length > 0 ? new Date(logs[0].log_date) : null;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
  
        if (lastLogDate && lastLogDate.toDateString() === yesterday.toDateString()) {
          currentStreak += 1; // Streak continues
        }
  
        let pointsEarned = 10; // Base points
        if (currentStreak >= 3) pointsEarned += 5; // Bonus for streaks
  
        // Fetch existing user reward record
        const [existingReward]: any = await pool.query(
          `SELECT points, highest_streak, badges 
           FROM user_rewards WHERE user_id = ? AND habit_id = ?`,
          [user_id, habit_id]
        );
  
        let totalPoints = pointsEarned;
        let highestStreak = currentStreak;
        let badges: string[] = [];
  
        if (existingReward.length > 0) {
          totalPoints += existingReward[0].points; // Accumulate points
          highestStreak = Math.max(existingReward[0].highest_streak, currentStreak);
          badges = existingReward[0].badges ? existingReward[0].badges.split(",") : [];
        }
  
        // Assign badges
        const newBadges = getBadges(totalPoints, highestStreak);
        badges = [...new Set([...badges, ...newBadges])]; // Avoid duplicate badges
  
        // Update or Insert into user_rewards
        if (existingReward.length > 0) {
          await pool.query(
            `UPDATE user_rewards 
             SET points = ?, highest_streak = ?, badges = ? 
             WHERE user_id = ? AND habit_id = ?`,
            [totalPoints, highestStreak, badges.join(","), user_id, habit_id]
          );
        } else {
          await pool.query(
            `INSERT INTO user_rewards (user_id, habit_id, points, highest_streak, badges) 
             VALUES (?, ?, ?, ?, ?)`,
            [user_id, habit_id, totalPoints, highestStreak, badges.join(",")]
          );
        }
  
        return NextResponse.json({
          message: "Rewards updated successfully",
          pointsEarned,
          totalPoints,
          highestStreak,
          badges,
        });
      }
  
      return NextResponse.json({ message: "Habit status updated successfully" });
    } catch (error) {
      console.error("❌ Error updating rewards:", error);
      return NextResponse.json({ error: "Failed to update rewards" }, { status: 500 });
    }
  }
  

// PUT: Updates rewards when a habit is logged
// export async function PUT(req: NextRequest) {
//   try {
//     const { user_id, habit_id } = await req.json();
//     if (!user_id || !habit_id) {
//       return NextResponse.json({ error: "Missing user_id or habit_id" }, { status: 400 });
//     }

//     console.log("📢 Updating rewards for User:", user_id, "Habit:", habit_id);

//     // Fetch latest habit log entry to determine streak
//     const [logs]: any = await pool.query(
//       `SELECT status, DATE(date) as log_date 
//        FROM habitlog 
//        WHERE user_id = ? AND habit_id = ? 
//        ORDER BY date DESC LIMIT 1`,
//       [user_id, habit_id]
//     );

//     let currentStreak = 1;
//     if (logs.length > 0) {
//       const lastLogDate = new Date(logs[0].log_date);
//       const yesterday = new Date();
//       yesterday.setDate(yesterday.getDate() - 1);

//       if (lastLogDate.toDateString() === yesterday.toDateString()) {
//         currentStreak += 1; // Streak continues
//       }
//     }

//     // Calculate points
//     let pointsEarned = 10; // Base points
//     if (currentStreak >= 3) pointsEarned += 5; // Bonus for streaks

//     // Fetch existing user reward record
//     const [existingReward]: any = await pool.query(
//       `SELECT points, highest_streak, badges 
//        FROM user_rewards WHERE user_id = ? AND habit_id = ?`,
//       [user_id, habit_id]
//     );

//     let totalPoints = pointsEarned;
//     let highestStreak = currentStreak;
//     let badges: string[] = [];

//     if (existingReward.length > 0) {
//       totalPoints += existingReward[0].points; // Accumulate points
//       highestStreak = Math.max(existingReward[0].highest_streak, currentStreak);
//       badges = existingReward[0].badges ? existingReward[0].badges.split(",") : [];
//     }

//     // Assign badges
//     const newBadges = getBadges(totalPoints, highestStreak);
//     badges = [...new Set([...badges, ...newBadges])]; // Avoid duplicate badges

//     // Update or Insert into user_rewards
//     if (existingReward.length > 0) {
//       await pool.query(
//         `UPDATE user_rewards 
//          SET points = ?, highest_streak = ?, badges = ? 
//          WHERE user_id = ? AND habit_id = ?`,
//         [totalPoints, highestStreak, badges.join(","), user_id, habit_id]
//       );
//     } else {
//       await pool.query(
//         `INSERT INTO user_rewards (user_id, habit_id, points, highest_streak, badges) 
//          VALUES (?, ?, ?, ?, ?)`,
//         [user_id, habit_id, totalPoints, highestStreak, badges.join(",")]
//       );
//     }

//     return NextResponse.json({
//       message: "Rewards updated successfully",
//       pointsEarned,
//       totalPoints,
//       highestStreak,
//       badges,
//     });
//   } catch (error) {
//     console.error("❌ Error updating rewards:", error);
//     return NextResponse.json({ error: "Failed to update rewards" }, { status: 500 });
//   }
// }
