// app/auth.ts
import mysql from 'mysql2/promise';
// import './cron/resetHabits'; 


// Create MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'somy@B2002', // Replace with your MySQL password
  database: 'habit_tracker',
});

// Test MySQL connection
const testConnection = async () => {
  try {
    const [rows] = await pool.query('SELECT 1'); 
    console.log('Connected to MySQL database!');
  } catch (error) {
    console.error('Error connecting to MySQL database:', error);
  }
};
testConnection();
export default pool;