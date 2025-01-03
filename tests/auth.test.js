const request = require('supertest');
const { app } = require('../index'); // Import the app from index.js
const pool = require('../db'); // Import the database connection pool

beforeAll(async () => {
    // Ensure the test database is clean before tests
    await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
});

describe('Auth API Tests', () => {
    it('POST /register - should create a new user', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser1',
                email: 'testuser1@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user.username).toBe('testuser1');
        expect(response.body.user.email).toBe('testuser1@example.com');
    });

    it('POST /register - should fail with duplicate email', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser2',
                email: 'testuser1@example.com', // Duplicate email
                password: 'password123',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Username or email already exists');
    });

    it('POST /login - should login successfully', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'testuser1@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
    });

    it('POST /login - should fail with invalid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'testuser1@example.com',
                password: 'wrongpassword', // Invalid password
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
    });

    it('POST /login - should fail for non-existent user', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'password123', // Non-existent user
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
    });

    it('POST /refresh-token - should return a new access token', async () => {
        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'testuser1@example.com',
                password: 'password123',
            });

        const refreshToken = loginResponse.body.refreshToken;

        const response = await request(app)
            .post('/refresh-token')
            .send({ token: refreshToken });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
    });

    it('POST /refresh-token - should fail with invalid token', async () => {
        const response = await request(app)
            .post('/refresh-token')
            .send({ token: 'invalidtoken' });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Invalid refresh token');
    });

    it('POST /logout - should logout successfully', async () => {
        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'testuser1@example.com',
                password: 'password123',
            });

        const refreshToken = loginResponse.body.refreshToken;

        const response = await request(app)
            .post('/logout')
            .send({ token: refreshToken });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Logged out successfully');
    });

    it('POST /logout - should fail with invalid token', async () => {
        const response = await request(app)
            .post('/logout')
            .send({ token: 'invalidtoken' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid token');
    });
});
