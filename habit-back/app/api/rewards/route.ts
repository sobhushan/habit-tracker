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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    console.log("📢 Fetching rewards for user:", userId);

    const [results]: any = await pool.execute(
      `SELECT ur.reward_id, ur.habit_id, ur.points, ur.highest_streak, ur.badges, ur.earned_at, 
              b.name as badge_name, b.description as badge_description, b.image_path,
              h.title as habit_name
       FROM user_rewards ur
       LEFT JOIN badges b ON FIND_IN_SET(b.name, ur.badges) > 0
       LEFT JOIN habits h ON ur.habit_id = h.habit_id
       WHERE ur.user_id = ?`,
      [userId]
    );

    if (!results.length) {
      return NextResponse.json({ error: "No rewards found" }, { status: 404 });
    }

    const rewards = results.reduce((acc: any[], reward: any) => {
      let existing = acc.find((r) => r.reward_id === reward.reward_id);
      if (!existing) {
        existing = {
          reward_id: reward.reward_id,
          habit_id: reward.habit_id,
          habit_name: reward.habit_name || "Unknown Habit", // Include Habit Name
          points: reward.points,
          highest_streak: reward.highest_streak,
          earned_at: reward.earned_at,
          badges: [],
        };
        acc.push(existing);
      }

      if (reward.badge_name) {
        existing.badges.push({
          name: reward.badge_name,
          description: reward.badge_description,
          image_path: reward.image_path,
        });
      }

      return acc;
    }, []);

    console.log("✅ Rewards Data:", rewards);
    return NextResponse.json(rewards);
  } catch (error) {
    console.error("❌ Error fetching rewards:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}




export async function PUT(req: NextRequest) {
  try {
    const { user_id, habit_id, status, completion_date } = await req.json();
    if (!user_id || !habit_id || !status || !completion_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("📢 Updating rewards for User:", user_id, "Habit:", habit_id, "Status:", status, "Date:", completion_date);

    const completionDate = new Date(completion_date).toISOString().split("T")[0];

    // Fetch the last recorded status for the given date
    const [lastLog]: any = await pool.query(
      `SELECT status FROM habitlog 
       WHERE user_id = ? AND habit_id = ? AND DATE(date) = ?
       ORDER BY date DESC LIMIT 1`,
      [user_id, habit_id, completionDate]
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

    // If marking as "complete" and not already completed for that date, add points
    if (status === "complete") {
      const [completedOnDate]: any = await pool.query(
        `SELECT COUNT(*) as count FROM habitlog 
         WHERE user_id = ? AND habit_id = ? AND status = 'complete' AND DATE(date) = ?`,
        [user_id, habit_id, completionDate]
      );

      if (completedOnDate[0].count > 0) {
        console.log("⚠️ Habit was already completed on this date. No extra points awarded.");
        return NextResponse.json({ message: "No points awarded. Habit was already completed on this date." });
      }

      // Recalculate streak based on past completions
      const [logs]: any = await pool.query(
        `SELECT DATE(date) as log_date FROM habitlog 
         WHERE user_id = ? AND habit_id = ? 
         ORDER BY date ASC`,
        [user_id, habit_id]
      );

      let streak = 1;
      let highestStreak = 1;
      let prevDate: Date | null = null;

      logs.forEach((log: any) => {
        const logDate = new Date(log.log_date);
        if (prevDate) {
          const diff = (logDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
          if (diff === 1) {
            streak++;
          } else {
            streak = 1; // Reset streak if non-consecutive
          }
        }
        highestStreak = Math.max(highestStreak, streak);
        prevDate = logDate;
      });

      let pointsEarned = 10; // Base points
      if (streak >= 3) pointsEarned += 5; // Bonus for streaks

      // Fetch existing reward record
      const [existingReward]: any = await pool.query(
        `SELECT points, highest_streak, badges FROM user_rewards WHERE user_id = ? AND habit_id = ?`,
        [user_id, habit_id]
      );

      let totalPoints = pointsEarned;
      let updatedHighestStreak = highestStreak;
      let badges: string[] = [];

      if (existingReward.length > 0) {
        totalPoints += existingReward[0].points; // Accumulate points
        updatedHighestStreak = Math.max(existingReward[0].highest_streak, highestStreak);
        badges = existingReward[0].badges
          ? existingReward[0].badges.split(",").filter((b: string) => b.trim() !== "")
          : [];
      }

      // Assign badges based on points and streaks
      const newBadges = getBadges(totalPoints, updatedHighestStreak);
      badges = [...new Set([...badges, ...newBadges])]; // Ensure unique values
      const badgesString = badges.length > 0 ? badges.join(",") : null;

      // Update or Insert into user_rewards
      if (existingReward.length > 0) {
        await pool.query(
          `UPDATE user_rewards 
           SET points = ?, highest_streak = ?, badges = ? 
           WHERE user_id = ? AND habit_id = ?`,
          [totalPoints, updatedHighestStreak, badgesString, user_id, habit_id]
        );
      } else {
        await pool.query(
          `INSERT INTO user_rewards (user_id, habit_id, points, highest_streak, badges) 
           VALUES (?, ?, ?, ?, ?)`,
          [user_id, habit_id, totalPoints, updatedHighestStreak, badgesString]
        );
      }

      return NextResponse.json({
        message: "Rewards updated successfully",
        pointsEarned,
        totalPoints,
        highestStreak: updatedHighestStreak,
        badges,
      });
    }

    return NextResponse.json({ message: "Habit status updated successfully" });
  } catch (error) {
    console.error("❌ Error updating rewards:", error);
    return NextResponse.json({ error: "Failed to update rewards" }, { status: 500 });
  }
}