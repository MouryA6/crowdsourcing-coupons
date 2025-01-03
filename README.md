# Crowdsourcing Coupons API

## Table of Contents
1. [Project Overview](#project-overview)
2. [Installation and Setup](#installation-and-setup)
3. [API Endpoints](#api-endpoints)
    - [/register](#register)
    - [/login](#login)
    - [/protected](#protected)
    - [/db-test](#db-test)
4. [Technologies Used](#technologies-used)
5. [Contributing](#contributing)
6. [Limitations and Edge Cases](#limitations-and-edge-cases)

---

## Project Overview
The Crowdsourcing Coupons API provides authentication and validation features to manage users and access secure endpoints. This serves as the foundation for a crowdsourcing platform where users can sell and purchase coupons.

---

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/MouryA6/crowdsourcing-coupons.git
   ```
2. Navigate to the project directory:
   ```bash
   cd crowdsourcing-coupons
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and configure the following variables:
   ```env
   PORT=5001
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/coupons_db
   JWT_SECRET=your_jwt_secret
   ```
5. Start the PostgreSQL server and create the required database:
   ```sql
   CREATE DATABASE coupons_db;
   ```
6. Run the server:
   ```bash
   npm run dev
   ```
7. Access the API locally at `http://localhost:5001`.

---

## API Endpoints

### /register
- **Method:** POST
- **Description:** Register a new user.
- **Request Body:**
    ```json
    {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "password123"
    }
    ```
- **Response:**
    - **Success (201):**
        ```json
        {
            "message": "User registered successfully",
            "user": {
                "id": 1,
                "username": "testuser",
                "email": "testuser@example.com",
                "created_at": "2025-01-01T00:00:00Z"
            }
        }
        ```
    - **Error (400):**
        ```json
        {
            "message": "Username or email already exists"
        }
        ```

### /login
- **Method:** POST
- **Description:** Authenticate a user and issue a JWT.
- **Request Body:**
    ```json
    {
        "email": "testuser@example.com",
        "password": "password123"
    }
    ```
- **Response:**
    - **Success (200):**
        ```json
        {
            "message": "Login successful",
            "accessToken": "<JWT>",
            "refreshToken": "<JWT>"
        }
        ```
    - **Error (401):**
        ```json
        {
            "message": "Invalid credentials"
        }
        ```

### /protected
- **Method:** GET
- **Description:** Access a protected resource.
- **Headers:**
    ```json
    {
        "Authorization": "Bearer <JWT>"
    }
    ```
- **Response:**
    - **Success (200):**
        ```json
        {
            "message": "Welcome testuser!"
        }
        ```
    - **Error (401):**
        ```json
        {
            "message": "Access denied. No token provided."
        }
        ```

### /db-test
- **Method:** GET
- **Description:** Test the database connection.
- **Response:**
    ```json
    {
        "now": "2025-01-01T00:00:00Z"
    }
    ```

---

## Technologies Used
- Node.js
- Express.js
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- Joi (validation)
- Helmet (security middleware)
- express-rate-limit (rate limiting)

---

## Contributing

See the [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines.

---

## Limitations and Edge Cases
- **Rate Limiting:** Login attempts are limited to 5 per 15 minutes.
- **Error Handling:** Specific error codes are used for database violations, but general errors may require debugging.
- **Refresh Tokens:** Ensure the refresh token list is properly managed to avoid security risks.

