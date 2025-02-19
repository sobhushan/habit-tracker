// app/api/habits/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/auth";

// Enable CORS
const allowedOrigin = "http://localhost:5173";


// export async function GET(req: NextRequest) {
//     try {
//         const url = new URL(req.url);
//         const userId = url.searchParams.get('user_id');
        
//         if (!userId) {
//             return NextResponse.json({ error: "User ID is required" }, { status: 400 });
//         }

//         // Fetch habits for the specific user
//         const [habits] = await pool.query("SELECT * FROM habits WHERE user_id = ?", [userId]);
        
//         return NextResponse.json(habits, { status: 200, headers: { "Access-Control-Allow-Origin": allowedOrigin } });
//     } catch (error) {
//         return NextResponse.json({ error: "Database error" }, { status: 500 });
//     }
// }

export async function GET(req: NextRequest) {
    try {

        const url = new URL(req.url);
        const userId = url.searchParams.get('user_id');
        
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Fetch habits, status (from the latest habitlog), and streak count (from streaklog)
        const [habits] = await pool.query(`
            SELECT 
                h.habit_id, 
                h.title, 
                h.description, 
                h.frequency, 
                h.time_req,
                h.created_at, 
                COALESCE(
                    (SELECT status 
                    FROM habitlog hl 
                    WHERE hl.habit_id = h.habit_id 
                    AND hl.user_id = ? 
                    ORDER BY hl.date DESC 
                    LIMIT 1), 
                'Pending') AS status,
                COALESCE(MAX(sl.streak_count), 0) AS streak
            FROM 
                habits h
            LEFT JOIN 
                streaklog sl ON h.habit_id = sl.habit_id AND sl.user_id = ?
            WHERE 
                h.user_id = ?
            GROUP BY 
                h.habit_id
        `, [userId, userId, userId]);

        console.log("get request: ",habits);    

        return NextResponse.json(habits, { status: 200, headers: { "Access-Control-Allow-Origin": allowedOrigin } });
    } catch (error: unknown) {  
        console.error("Detailed error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { user_id, title, description, frequency, time_req } = await req.json();
        await pool.query(
            "INSERT INTO habits (user_id, title, description, frequency, time_req, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
            [user_id, title, description, frequency, time_req]
        );
        return NextResponse.json({ message: "Habit added successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, title, description, frequency, time_req } = await req.json();
        console.log("Received data for update:", { id, title, description, frequency, time_req });

        if (!id) {
            return NextResponse.json({ error: "Habit ID is required" }, { status: 400 });
        }

        const [result]: any = await pool.query(
            "UPDATE habits SET title = ?, description = ?, frequency = ?, time_req = ? WHERE habit_id = ?",
            [title, description, frequency, time_req, id]
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

//====================================================
