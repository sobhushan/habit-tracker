//app/api/login/route.ts
import { NextResponse, NextRequest } from "next/server";
import pool from "@/app/auth";
import jwt from 'jsonwebtoken';

const SECRET_KEY = "qwerty";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const [user]: any = await pool.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );
    if (user.length > 0) {
      // Return user_id, username, and email after successful login
      const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
      return NextResponse.json({token,
        message: `Login successful! Welcome, ${user[0].username}`,
        user_id: user[0].id,
        username: user[0].username,
      });
    } else {
      return NextResponse.json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Login failed." }, { status: 500 });
  }
}
