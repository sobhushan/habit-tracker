// app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();
    console.log('Signup attempt: ', username, email);

    // // Check if user already exists by email or username
    // const [result]:any = await pool.query(
    //   'SELECT * FROM users WHERE email = ?',
    //   [email]
    // );

    // const rows = result[0]; 
    // if (rows.length > 0) {
    //   return NextResponse.json(
    //     { message: 'User with this email or username already exists' },
    //     { status: 409 } // Conflict status for existing user
    //   );
    // }

    // Insert new user
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );

    return NextResponse.json({ message: 'Signup successful!' }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

    
