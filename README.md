# Journal App

![AWS](https://img.shields.io/badge/AWS-Cloud-orange) &nbsp;
![Node.js](https://img.shields.io/badge/Node.js-20-green) &nbsp;
![Express](https://img.shields.io/badge/Express-Backend-black) &nbsp;
![License](https://img.shields.io/badge/License-MIT-blue) &nbsp;
![Status](https://img.shields.io/badge/Status-Active-success) &nbsp;

A full-stack personal journaling app built on **Amazon Web Services (AWS)** infrastructure.

## Overview

This project was built to gain hands-on experience with modern Cloud
Engineering practices by integrating multiple AWS services into a
complete full-stack application.

Users can securely register, log in, create, update, delete, and manage
personal journal entries with optional image uploads. Authentication is
handled by AWS Cognito, data is stored in DynamoDB, images are stored
privately in Amazon S3, and the application is hosted on an EC2 instance
using PM2.

> **⚠️ Note:** This app currently runs on HTTP. HTTPS support via Nginx + Let's Encrypt is planned and in progress.

---

## Live Demo

> _Link coming soon — domain and HTTPS setup in progress._

<!-- Add screenshots or a GIF demo here -->
<!-- ![Demo](assets/demo.gif) -->

---

## Screenshots

> _Screenshots coming soon._

<!-- 
| Login Page | Dashboard |
|---|---|
| ![Login](assets/login.png) | ![Dashboard](assets/dashboard.png) |
-->

---

## Architecture

![Architecture Diagram](assets/architecture.png)

> _Place your architecture diagram image at `assets/architecture.png`_

```
Browser (HTML / CSS / JS)
        │
        │  HTTPS + JWT Token
        ▼
AWS Cognito ──── Authentication (Register / Login / JWT)
        │
        ▼
EC2 Instance (Node.js + Express)
        │
        ├── Amazon DynamoDB ── Journal text and metadata
        └── Amazon S3 ──────── Journal images (private, presigned URLs)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML, CSS, JavaScript (Vanilla) |
| **Backend** | Node.js 20 LTS + Express.js |
| **Authentication** | AWS Cognito (User Pool, JWT) |
| **Database** | AWS DynamoDB (On-Demand) |
| **File Storage** | AWS S3 (Private bucket, Presigned URLs) |
| **Server** | AWS EC2 t3.micro (Ubuntu 24.04 LTS) |
| **Process Manager** | PM2 |
| **Region** | ap-south-1 (Mumbai, India) |

---

## Features

- **Secure Authentication** — Register, email verification, and login via AWS Cognito
- **Journal CRUD** — Create, read, update, and delete personal journal entries
- **Image Attachments** — Upload images per journal entry, stored securely in S3
- **Presigned URLs** — Images accessed via time-limited, auto-refreshing S3 presigned URLs
- **Protected API** — All routes secured with JWT middleware; unauthorized requests return 401
- **User Isolation** — Each user can only access their own journals (enforced server-side)
- **PM2 Process Management** — Server auto-restarts on crash and survives EC2 reboots

---

## Project Structure

```
journal-app/
├── config/
│   ├── dynamodb.js        # DynamoDB client (AWS SDK v3)
│   └── s3.js              # S3 client (AWS SDK v3)
├── middleware/
│   └── auth.js            # JWT verification middleware (aws-jwt-verify)
├── routes/
│   ├── journals.js        # CRUD routes for journal entries
│   └── upload.js          # Image upload route (multer-s3)
├── public/
│   ├── index.html         # Login and Register page
│   └── dashboard.html     # Journal dashboard
├── server.js              # Express app entry point
├── .env.example           # Environment variable template
├── .gitignore
└── package.json
```

---

## API Endpoints

All endpoints except `/health` require a valid JWT token in the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/health` | Server health check | No |
| POST | `/journals` | Create a new journal entry | Yes |
| GET | `/journals` | Get all journals for the authenticated user | Yes |
| GET | `/journals/:id` | Get a single journal entry | Yes |
| PUT | `/journals/:id` | Update a journal entry | Yes |
| DELETE | `/journals/:id` | Delete a journal entry | Yes |
| POST | `/upload` | Upload an image to S3 | Yes |

---

## Security

- **IAM Role** on EC2 — no hardcoded AWS credentials anywhere in the codebase
- **Private S3 bucket** — images are never publicly accessible
- **Presigned URLs** — time-limited (15 min), auto-refreshed on every journal fetch
- **JWT verification** — using official `aws-jwt-verify` library from AWS
- **Helmet.js** — secure HTTP response headers
- **CORS** — cross-origin request control
- **Security Groups** — SSH access restricted to developer IP only
- **`.env` excluded** — sensitive config never committed to version control

---

## Getting Started

### Prerequisites

- AWS Account with IAM user configured
- Node.js 20 LTS
- PM2 (`npm install -g pm2`)
- AWS CLI configured (or EC2 IAM Role attached)

### AWS Resources Required

| Resource | Details |
|---|---|
| EC2 | t3.micro, Ubuntu 24.04, ap-south-1 |
| DynamoDB | Table: `journals`, PK: `userId`, SK: `journalId` |
| S3 | Private bucket for image storage |
| Cognito | User Pool with SPA App Client (no client secret) |
| IAM Role | Attached to EC2 with DynamoDB and S3 access |
| Elastic IP | Associated with EC2 instance |

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/journal-app.git
cd journal-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Fill in your values in .env

# Start with PM2
pm2 start server.js --name journal-api
pm2 save
pm2 startup
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3000
COGNITO_REGION=ap-south-1
COGNITO_USER_POOL_ID=your-user-pool-id
COGNITO_CLIENT_ID=your-client-id
```

> Never commit your `.env` file. It is listed in `.gitignore`.

---

## Server Management

```bash
# Start server
pm2 start server.js --name journal-api

# Stop server
pm2 stop journal-api

# Restart after code changes
pm2 restart journal-api --update-env

# View logs
pm2 logs journal-api --lines 30

# Check status
pm2 status
```

---

## Roadmap

- [x] EC2 server setup (Ubuntu + Node.js + PM2)
- [x] REST API with Express.js
- [x] DynamoDB integration (CRUD)
- [x] S3 image upload with presigned URLs
- [x] AWS Cognito authentication (JWT)
- [x] Protected API routes
- [x] Frontend (HTML/CSS/JS)
- [x] Elastic IP (permanent public IP)
- [x] GitHub repository
- [ ] Domain name
- [ ] HTTPS with SSL/TLS (Let's Encrypt + Certbot)
- [ ] Nginx reverse proxy
- [ ] UI/UX redesign (separate HTML, CSS, JS files)
- [ ] CloudWatch logging
- [ ] Node.js v22 upgrade
- [ ] CI/CD pipeline

---

## Key Learnings

This project provided hands-on experience with:

- Setting up and managing AWS EC2 instances
- Designing DynamoDB tables with composite keys for multi-user data
- Implementing secure image storage with S3 presigned URLs
- Building JWT authentication with AWS Cognito
- Writing REST APIs following industry conventions
- Managing Node.js processes with PM2 in production
- AWS IAM roles and credential-free server configuration
- Debugging real cloud infrastructure issues

---

## Author

**Jayanta Ojha**

<!-- Add your links below -->
Social Links: &nbsp;
[GitHub](https://github.com/jayanta-ojha) &nbsp;
[LinkedIn](https://linkedin.com/in/jayanta-ojha) &nbsp;

---

## License

This project is for personal use and learning purposes.

---


