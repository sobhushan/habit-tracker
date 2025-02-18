// Schedule a dummy task to set the timezone (this is not actually needed for setInterval)
// cron.schedule('0 1 * * *', () => {
//   console.log('Running a dummy job at 01:00 at Asia/Kolkata timezone');
// }, {
//   scheduled: true,
//   timezone: "Asia/Kolkata"
// });