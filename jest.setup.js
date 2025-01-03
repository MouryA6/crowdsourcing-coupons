const pool = require('./db'); // Import the database connection pool

afterAll(async () => {
    console.log('Database connection pool closed after tests');
    await pool.end();
});
