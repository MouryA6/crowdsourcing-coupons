require('dotenv').config(); // Load environment variables

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./logger'); // Your custom logger
const pool = require('./db'); // Database connection pool
const app = express();

const PORT = process.env.PORT || 5001;
const refreshTokens = [];

// Rate limiting for login and refresh token routes
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later.',
});

const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many refresh requests, please try again later.',
});

// Input validation schemas
const registerSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const refreshTokenSchema = Joi.object({
    token: Joi.string().required(),
});

// Middleware
app.use(helmet());
app.use(express.json()); // Middleware to parse JSON requests

// Functions
async function registerUser(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at';
    const values = [username, email, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function loginUser(email, password) {
    const query = 'SELECT id, username, email, password FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
        throw new Error('User not found');
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error('Invalid credentials');
    }

    return user; // User authenticated successfully
}

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Add user data to the request
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
}

// Routes
app.post('/register', async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { username, email, password } = req.body;

    try {
        const newUser = await registerUser(username, email, password);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        logger.error(error.message);
        if (error.code === '23505') {
            res.status(400).json({ message: 'Username or email already exists' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

app.post('/login', loginLimiter, async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = req.body;

    try {
        const user = await loginUser(email, password);
        const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

        refreshTokens.push(refreshToken);
        res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
    } catch (error) {
        logger.error(error.message);
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/refresh-token', refreshLimiter, (req, res) => {
    const { error } = refreshTokenSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { token } = req.body;

    if (!refreshTokens.includes(token)) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const accessToken = jwt.sign({ id: payload.id, username: payload.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(400).json({ message: 'Invalid refresh token' });
    }
});

app.post('/logout', (req, res) => {
    const { token } = req.body;
    const tokenIndex = refreshTokens.indexOf(token);

    if (tokenIndex === -1) {
        return res.status(400).json({ message: 'Invalid token' });
    }

    refreshTokens.splice(tokenIndex, 1);
    res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: `Welcome ${req.user.username}!` });
});

app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ message: 'Database connection failed.' });
    }
});

app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
