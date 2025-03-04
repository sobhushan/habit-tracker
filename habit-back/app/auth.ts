// app/auth.ts
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
// import './cron/resetHabits'; 


// Create MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'somy@B2002', // Replace with your MySQL password
  database: 'habit_tracker',
  waitForConnections: true, // Prevents overload
  connectionLimit: 10, // Limits simultaneous connections
  queueLimit: 0, // Ensures requests are queued
});

// Test MySQL connection
const testConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection(); // Get a single connection
    await connection.query('SELECT 1'); // Run test query
    console.log('✅ Connected to MySQL database!');
  } catch (error) {
    console.error('❌ Error connecting to MySQL database:', error);
  } finally {
    if (connection) connection.release(); // ✅ Release only the individual connection
  }
};
testConnection();
export default pool;


// const SECRET_KEY = 'qwerty';

export function verifyToken(req: NextApiRequest, res: NextApiResponse): { username: string } | null {
  const SECRET_KEY = 'qwerty';
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
  if (!token) {
    res.status(403).json({ error: 'No token provided' });
    return null;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { username: string };
    return decoded;
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }
}