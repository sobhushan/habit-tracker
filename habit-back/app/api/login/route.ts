// import { NextResponse, NextRequest } from 'next/server';
// import pool from '@/app/auth';
// // import jwt from 'jsonwebtoken';

// // const SECRET_KEY = "qwerty";

// export async function POST(request: NextRequest) {
//   const { username, password } = await request.json();
//   console.log("Login attempt: ",username, password);

//   const [results]: any = await pool.query(
//           'SELECT * FROM users WHERE username = ? AND password = ?',
//           [username, password]
//         );
//   if (results.length > 0) {
//     //const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
//     //return Response.json({token, message: `Login successful! Welcome, ${username}`,});
//     return Response.json({message: `Login successful! Welcome, ${username}`,});
//   }else{
//     return Response.json({message: "Invadid Credendials",});
//   }
// }
// // -------------------------------------------------------------------------------
//app/api/login/route.ts
import { NextResponse, NextRequest } from "next/server";
import pool from "@/app/auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const [user]: any = await pool.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );
    if (user.length > 0) {
      // Return user_id, username, and email after successful login
      return NextResponse.json({
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
