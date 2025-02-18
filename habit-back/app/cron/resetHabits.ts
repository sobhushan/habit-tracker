// /app/cron/resetHabits.ts
import cron from 'node-cron';
import pool from "@/app/auth";
// Set up a cron job that runs every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    // Query to reset the status of all habits to "pending" at midnight
    const resetQuery = `
      UPDATE habitlog 
      SET status = "Pending" 
      WHERE date < CURDATE(); 
    `;

    await pool.query(resetQuery);
    console.log('Successfully reset all habits to pending at midnight.');
  } catch (error) {
    console.error('Error resetting habits:', error);
  }
});

console.log('Cron job to reset habits has been set up.');



//=====================================================
// //FOR TESTING ONLI

// import cron from 'node-cron';
// import pool from "@/app/auth";

// // Run the cron job at every minute for testing purposes
// cron.schedule('*/2 * * * *', async () => { 
//   try {
//     // Query to reset the status of all habits that were logged today
//     const resetQuery = `
//       UPDATE habitlog 
//       SET status = "Pending" 
//       WHERE DATE(date) = CURDATE();
//     `;

//     await pool.query(resetQuery);
//     console.log('Successfully reset all habits to pending.');
//   } catch (error) {
//     console.error('Error resetting habits:', error);
//   }
// });

// console.log('Cron job to reset habits has been set up.');
