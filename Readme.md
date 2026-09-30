# Job Board API

A production-ready REST API for a job board platform built with Node.js, Express, and MongoDB. Supports three roles — admin, company, and jobseeker — with full job posting, application, and approval workflows.

## Features

- JWT authentication with refresh token rotation
- Role-based access control (admin / company / jobseeker)
- Company registration and admin approval workflow
- Job posting with admin approval before going live
- Job filtering by type, work mode, experience level, salary range, and keyword search
- CV upload for job applications (PDF support)
- Application status tracking (applied → reviewing → interview → offered → rejected)
- Auto-close jobs when max applicants reached
- Duplicate application prevention
- Input validation with Joi
- Rate limiting and brute force protection
- Security headers with Helmet
- Structured logging with Winston and Morgan
- Global error handling
- Pagination support

## Tech Stack

- **Runtime** — Node.js
- **Framework** — Express.js
- **Database** — MongoDB with Mongoose
- **Authentication** — JWT (access + refresh tokens)
- **Validation** — Joi
- **Security** — bcryptjs, Helmet, CORS, express-rate-limit
- **Uploads** — Multer
- **Logging** — Winston, Morgan

## Roles

| Role | Permissions |
|------|-------------|
| `admin` | Approve/reject companies and jobs, delete anything, view all data |
| `company` | Create company profile, post jobs, view and manage applications |
| `jobseeker` | Browse jobs, apply with CV, track application status |

## Project Structure
job-board-api/
├── src/
│ ├── config/
│ │ ├── db.js
│ │ ├── config.js
│ │ ├── logger.js
│ │ ├── multer.js
│ │ └── rateLimiter.js
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── companyController.js
│ │ ├── jobController.js
│ │ └── applicationController.js
│ ├── middleware/
│ │ ├── authmiddleware.js
│ │ ├── authorize.js
│ │ ├── errorHandler.js
│ │ └── validate.js
│ ├── models/
│ │ ├── User.js
│ │ ├── Company.js
│ │ ├── Job.js
│ │ └── Application.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── companyRoutes.js
│ │ ├── jobRoutes.js
│ │ └── applicationRoutes.js
│ ├── validators/
│ │ ├── auth.validator.js
│ │ ├── company.validator.js
│ │ └── job.validator.js
│ └── app.js
├── logs/
│ └── .gitkeep
├── uploads/
│ └── .gitkeep
├── .env
├── .gitignore
└── package.json


## Getting Started

### Prerequisites

- Node.js installed
- MongoDB Atlas account or local MongoDB

### Installation

1. Clone the repository

```bash
git clone https://github.com/Abdullah-Yahya-dev/job-board-api.git
cd job-board-api
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=development


4. Start the server

```bash
nodemon src/app.js
```

Server runs on `http://localhost:5000`

## API Endpoints

### Auth Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register as jobseeker or company | No |
| POST | `/api/v1/auth/login` | Login, returns access + refresh token | No |
| POST | `/api/v1/auth/refresh` | Get new access token | No |
| POST | `/api/v1/auth/logout` | Logout, invalidate refresh token | Yes |

### Company Routes

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/v1/companies` | Create company profile | Yes | company |
| GET | `/api/v1/companies` | Get all approved companies | No | — |
| GET | `/api/v1/companies/:id` | Get company by ID | No | — |
| PUT | `/api/v1/companies/:id` | Update company profile | Yes | company |
| DELETE | `/api/v1/companies/:id` | Delete company | Yes | company, admin |
| PATCH | `/api/v1/companies/:id/approve` | Approve or reject company | Yes | admin |

### Job Routes

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/v1/jobs` | Post a new job | Yes | company |
| GET | `/api/v1/jobs` | Get all approved jobs | No | — |
| GET | `/api/v1/jobs/my-jobs` | Get company's own jobs | Yes | company |
| GET | `/api/v1/jobs/:id` | Get job by ID | No | — |
| PUT | `/api/v1/jobs/:id` | Update job | Yes | company |
| DELETE | `/api/v1/jobs/:id` | Delete job | Yes | company, admin |
| PATCH | `/api/v1/jobs/:id/approve` | Approve or reject job | Yes | admin |

### Application Routes

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/v1/applications/:jobId/apply` | Apply to a job with CV | Yes | jobseeker |
| GET | `/api/v1/applications/my-applications` | View own applications | Yes | jobseeker |
| GET | `/api/v1/applications/:jobId/applications` | View job applications | Yes | company |
| PATCH | `/api/v1/applications/:id/status` | Update application status | Yes | company |

### Job Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `jobType` | string | Filter by job type | `?jobType=full-time` |
| `workMode` | string | Filter by work mode | `?workMode=remote` |
| `experienceLevel` | string | Filter by level | `?experienceLevel=junior` |
| `minSalary` | number | Minimum salary | `?minSalary=30000` |
| `maxSalary` | number | Maximum salary | `?maxSalary=100000` |
| `search` | string | Search title or description | `?search=nodejs` |
| `page` | number | Page number | `?page=1` |
| `limit` | number | Results per page | `?limit=10` |

Combine filters: `?jobType=full-time&workMode=remote&search=nodejs&page=1&limit=5`

## Request Examples

### Register

```json
POST /api/v1/auth/register
Content-Type: application/json

{
    "name": "Abdullah Yahya",
    "email": "abdullah@example.com",
    "password": "SecurePass@123",
    "role": "jobseeker"
}
```

### Create Company

```json
POST /api/v1/companies
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Tech Solutions Inc.",
    "description": "A leading software development company.",
    "location": "Lahore, Pakistan",
    "website": "https://techsolutions.com"
}
```

### Post a Job

```json
POST /api/v1/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
    "title": "Backend Developer",
    "description": "We are looking for a Node.js developer.",
    "location": "Lahore, Pakistan",
    "requirements": ["2+ years Node.js", "MongoDB experience"],
    "skills": ["Node.js", "Express", "MongoDB"],
    "jobType": "full-time",
    "workMode": "hybrid",
    "experienceLevel": "junior",
    "salary": { "min": 50000, "max": 80000, "currency": "PKR" },
    "maxApplicants": 20,
    "applicationDeadline": "2026-12-31"
}
```

### Apply to Job
POST /api/v1/applications/:jobId/apply
Authorization: Bearer <token>
Content-Type: multipart/form-data

cv: <PDF file>

## Response Format

### Success
```json
{
    "success": true,
    "data": {},
    "message": "Operation successful"
}
```

### Error
```json
{
    "success": false,
    "message": "Error description"
}
```

### Validation Error
```json
{
    "errors": ["Title is required", "Invalid job type"]
}
```

## Application Status Flow
applied → reviewing → interview → offered
↘
rejected

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `MONGODB_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret for access tokens |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| `NODE_ENV` | Environment (development/production) |

## Author

**Abdullah Yahya**
BSSE 2024 — University of Sialkot
- GitHub: [@Abdullah-Yahya-dev](https://github.com/Abdullah-Yahya-dev)
- Email: abdullahyahya860@gmail.com