// app/auth.ts
import mysql from 'mysql2/promise';
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import './cron/resetHabits'; 


// Create MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '**********', // Replace with your MySQL password
  database: 'habit_tracker',
  waitForConnections: true, // Prevents overload
  connectionLimit: 10, // Limits simultaneous connections
  queueLimit: 0, // Ensures requests are queued
});

// Test MySQL connection
const testConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection(); 
    await connection.query('SELECT 1'); 
    console.log('✅ Connected to MySQL database!');
  } catch (error) {
    console.error('❌ Error connecting to MySQL database:', error);
  } finally {
    if (connection) connection.release(); 
  }
};
testConnection();
export default pool;

const SECRET_KEY = "qwerty";

export function verifyToken(req: NextRequest): { user_id: number; username: string } | null {
  const token = req.headers.get("authorization")?.split(" ")[1]; // Extract JWT

  if (!token) {
    return null; // No token provided
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { user_id: number; username: string };
    return decoded;
  } catch (err) {
    return null; // Invalid token
  }
}
