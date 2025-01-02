require('dotenv').config();
const { Pool } = require('pg');

// Configure the PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Uses the DATABASE_URL from the .env file
});

module.exports = pool;
