// app/api/habits/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/auth";
import { verifyToken } from '@/app/auth';

// Enable CORS
const allowedOrigin = "http://localhost:5173";


export async function GET(req: NextRequest) {
    const user = verifyToken(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get('user_id');
        
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        
        // Fetch habits with latest status and streak calculation
        const [habits] = await pool.query(`
            WITH todays_status AS (
                SELECT 
                    habit_id,
                    status
                FROM habitlog
                WHERE user_id = ? 
                AND date(date) = CURDATE()
            ),
            streak_data AS (
                SELECT 
                    habit_id,
                    COUNT(*) AS streak_count
                FROM (
                    SELECT 
                        habit_id,
                        date,
                        status,
                        LAG(date) OVER (PARTITION BY habit_id ORDER BY date DESC) AS prev_date
                    FROM habitlog
                    WHERE user_id = ?
                ) habit_dates
                WHERE status = 'Completed' 
                AND (prev_date IS NULL OR DATEDIFF(prev_date, date) = 1)
                GROUP BY habit_id
            )
            SELECT 
                h.habit_id, 
                h.title, 
                h.description, 
                h.frequency, 
                h.time_req,
                h.category,
                h.created_at, 
                COALESCE(ts.status, 'Pending') AS status,  -- Default to 'Pending' if no entry for today
                COALESCE(sd.streak_count, 0) AS streak
            FROM 
                habits h
            LEFT JOIN 
                todays_status ts ON h.habit_id = ts.habit_id
            LEFT JOIN 
                streak_data sd ON h.habit_id = sd.habit_id
            WHERE 
                h.user_id = ?

            
        `, [userId, userId, userId]);

        return NextResponse.json(habits, { status: 200, headers: { "Access-Control-Allow-Origin": allowedOrigin } });
    } catch (error: unknown) {  
        console.error("Detailed error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {

    try {
        const { user_id, title, description, frequency, time_req, category } = await req.json();
        const [habitResult]: any =await pool.query(
            "INSERT INTO habits (user_id, title, description, frequency, time_req, category, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
            [user_id, title, description, frequency, time_req, category]
        );
        const habit_id = habitResult.insertId;

        // Insert into habitlog with default "Pending" status
        await pool.query(
        "INSERT INTO habitlog (user_id, habit_id, status, date) VALUES (?, ?, 'Pending', NOW())",
        [user_id, habit_id]
        );
        return NextResponse.json({ message: "Habit added successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, title, description, frequency, time_req, category } = await req.json();
        console.log("Received data for update:", { id, title, description, frequency, time_req, category });

        if (!id) {
            return NextResponse.json({ error: "Habit ID is required" }, { status: 400 });
        }

        const [result]: any = await pool.query(
            "UPDATE habits SET title = ?, description = ?, frequency = ?, time_req = ?, category = ? WHERE habit_id = ?",
            [title, description, frequency, time_req, category, id]
        );

        console.log("Update result:", result);

        return NextResponse.json({ message: "Habit updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("Received DELETE request body:", body);

        const habit_id = body.habit_id;

        if (!habit_id) {
            console.error("Habit ID is missing in request body!");
            return NextResponse.json({ error: "Habit ID is required" }, { status: 400 });
        }

        console.log("Deleting habit with ID:", habit_id);

        // Delete habit from database
        const [result]: any = await pool.query("DELETE FROM habits WHERE habit_id = ?", [habit_id]);

        console.log("Delete result:", result);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Habit not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Habit deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}



// // Handle CORS Preflight Requests
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, user-id",
        }
    });
}
