# Contributing to Crowdsourcing Coupons

Thank you for considering contributing to the Crowdsourcing Coupons project! We welcome contributions of all kinds, including bug fixes, feature enhancements, documentation improvements, and more.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Reporting Bugs](#reporting-bugs)
3. [Suggesting Enhancements](#suggesting-enhancements)
4. [Contributing Code](#contributing-code)
5. [Style Guide](#style-guide)
6. [Commit Message Guidelines](#commit-message-guidelines)

---

## Getting Started

### 1. Clone the Repository
First, fork the repository to your GitHub account. Then, clone it to your local machine:

```bash
git clone https://github.com/your-username/crowdsourcing-coupons.git
cd crowdsourcing-coupons
```

### 2. Install Dependencies
Ensure you have Node.js and PostgreSQL installed. Install the required dependencies:

```bash
npm install
```

### 3. Set Up the Environment
Create a `.env` file in the root directory and configure the following variables:

```env
PORT=5001
DATABASE_URL=postgresql://<your_username>:<your_password>@localhost:5432/coupons_db
JWT_SECRET=your_jwt_secret
```

### 4. Run the Development Server
Start the development server:

```bash
npm run dev
```

The server will run on `http://localhost:5001`.

---

## Reporting Bugs

If you encounter a bug, please file an issue on GitHub. Include the following:
- A clear description of the problem.
- Steps to reproduce the issue.
- Expected and actual results.
- Screenshots or logs, if applicable.

---

## Suggesting Enhancements

We’re open to suggestions for new features or improvements! To suggest an enhancement:
- Open an issue on GitHub.
- Provide a clear description of the feature.
- If possible, include examples of how it could work.

---

## Contributing Code

### 1. Fork the Repository
Fork the repository to your GitHub account.

### 2. Create a Branch
Create a branch for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
```

### 3. Write Your Code
- Follow the [Style Guide](#style-guide).
- Test your changes thoroughly.

### 4. Commit Your Changes
Write clear and concise commit messages (see [Commit Message Guidelines](#commit-message-guidelines)).

### 5. Push Your Changes
Push your branch to your forked repository:

```bash
git push origin feature/your-feature-name
```

### 6. Submit a Pull Request
Go to the original repository and submit a pull request. Provide a detailed description of your changes.

---

## Style Guide

### JavaScript
- Use `prettier` for consistent formatting.
- Use ES6+ syntax (e.g., `const`, `let`, arrow functions).
- Write comments for complex logic.

### File Structure
- Organize code logically (e.g., separate routes, utilities, and database logic).
- Avoid hardcoding values; use environment variables.

---

## Commit Message Guidelines

Follow this format for commit messages:

```plaintext
<type>(<scope>): <subject>

<body>
```

### Types
- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation changes.
- `refactor`: Code refactoring.
- `test`: Adding or updating tests.
- `chore`: Miscellaneous tasks.

### Examples
- `feat(auth): implement JWT authentication`
- `fix(db): resolve unique constraint error`

---

We appreciate your time and effort in contributing to Crowdsourcing Coupons. Together, we can build something amazing!

