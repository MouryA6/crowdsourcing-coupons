# Crowdsourcing Coupons

## Project Overview
The Crowdsourcing Coupons platform allows users to register, log in, and securely access protected endpoints. This project provides an API for user management (e.g., registration, login) with robust authentication and validation mechanisms.

## Features
- User Registration with hashed passwords.
- Secure login with JWT-based authentication.
- Access-protected routes using JSON Web Tokens.
- Input validation with JOI.
- Rate-limiting to prevent abuse.
- Helmet for enhanced security.

## Installation and Setup

### Prerequisites
- Node.js (v14+)
- PostgreSQL (running locally or remotely)
- Git

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

4. Configure the `.env` file:
   ```env
   PORT=5001
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/coupons_db
   JWT_SECRET=your_jwt_secret
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

6. Test the server by navigating to:
   - [http://localhost:5001](http://localhost:5001)

## API Endpoints

### 1. **Register User**
**Endpoint:** `/register`
- **Method:** POST
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "testuser@example.com",
      "created_at": "2025-01-02T22:00:28.532Z"
    }
  }
  ```

### 2. **Login User**
**Endpoint:** `/login`
- **Method:** POST
- **Description:** Authenticates a user and returns a JWT.
- **Request Body:**
  ```json
  {
    "email": "testuser@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "accessToken": "<JWT>",
    "refreshToken": "<Refresh JWT>"
  }
  ```

### 3. **Access Protected Route**
**Endpoint:** `/protected`
- **Method:** GET
- **Description:** Returns a welcome message for authenticated users.
- **Headers:**
  ```json
  {
    "Authorization": "Bearer <JWT>"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Welcome testuser!"
  }
  ```

### 4. **Database Connection Test**
**Endpoint:** `/db-test`
- **Method:** GET
- **Description:** Tests database connectivity.
- **Response:**
  ```json
  {
    "now": "2025-01-02T21:43:49.552Z"
  }
  ```

### 5. **Refresh Token**
**Endpoint:** `/refresh-token`
- **Method:** POST
- **Description:** Generates a new access token using a valid refresh token.
- **Request Body:**
  ```json
  {
    "token": "<Refresh JWT>"
  }
  ```
- **Response:**
  ```json
  {
    "accessToken": "<New JWT>"
  }
  ```

## Technologies Used
- **Node.js:** Backend runtime environment.
- **Express.js:** Web application framework.
- **PostgreSQL:** Database.
- **bcrypt:** Password hashing.
- **jsonwebtoken:** JWT authentication.
- **Joi:** Input validation.
- **Helmet:** Security middleware.
- **Rate-Limit:** Prevent abuse with request rate limiting.

## Contributing
We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---
For any issues, please create an issue on the GitHub repository.

**Repository:** [https://github.com/MouryA6/crowdsourcing-coupons](https://github.com/MouryA6/crowdsourcing-coupons)
