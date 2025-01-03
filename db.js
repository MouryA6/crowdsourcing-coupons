require('dotenv').config();
const { Pool } = require('pg');

// Use a different database based on environment
const connectionString = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

console.log('Using database:', connectionString);

// Configure the PostgreSQL connection pool
const pool = new Pool({
    connectionString, // Uses the DATABASE_URL from the .env file
});

module.exports = pool;
