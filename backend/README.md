# AddisTask

AddisTask is a Taskrabbit-style local services marketplace designed for Addis Ababa. Customers can post service tasks, providers can create service profiles, and the platform recommends matching providers using category, location, rating, completed task count, and response time.

## Live Links

# Running AddisTask Locally

## Backend (FastAPI)

Start the backend server:

```powershell
cd backend
python -m uvicorn app.main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend (React + Vite)

Start the frontend server:

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# Production Deployment

- Frontend: https://addistask-1.onrender.com
- Backend API: https://addistask.onrender.com
- API Docs: https://addistask.onrender.com/docs
- Health Check: https://addistask.onrender.com/api/health
- GitHub Repository: https://github.com/kiti17/AddisTask

> If a Render URL changes, update the links above before final submission.

## Project Purpose

AddisTask solves a practical local service problem: customers need reliable help for everyday work, while skilled local providers need a simple way to find jobs. The project supports services such as cleaning, plumbing, electrical work, moving, delivery, and home repair.

## Core Features

- User registration and login
- Persistent authentication using JWT and localStorage
- Customer task posting
- Provider profile creation
- Task category and location filtering
- Smart provider matching
- Provider applications to tasks
- Customer application review and acceptance
- Task status workflow: open → assigned
- Deployed frontend, backend, and PostgreSQL database

## Technology Stack

### Frontend

- React
- Vite
- Axios
- CSS responsive layout
- Render Static Site deployment

### Backend

- FastAPI
- SQLAlchemy ORM
- PostgreSQL
- Pydantic schemas
- JWT authentication
- Render Web Service deployment

### Database

- PostgreSQL hosted on Render
- Tables include users, tasks, provider_profiles, and applications

## Architecture Overview

```text
React Frontend
   |
   | Axios HTTP requests
   v
FastAPI Backend
   |
   | SQLAlchemy ORM
   v
PostgreSQL Database
```

## Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/health | Backend health check |
| POST | /api/auth/register | Register a user |
| POST | /api/auth/login | Login and receive JWT token |
| POST | /api/tasks/ | Create a task |
| GET | /api/tasks/ | List tasks |
| POST | /api/providers/ | Create provider profile |
| GET | /api/providers/ | List providers |
| GET | /api/providers/match/{task_id} | Smart provider matching |
| POST | /api/applications/ | Provider applies to task |
| GET | /api/applications/task/{task_id} | List applications for a task |
| PATCH | /api/applications/{application_id}/status | Accept/reject application |

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kiti17/AddisTask.git
cd AddisTask
```

### 2. Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

### 3. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Environment Variables

Backend Render environment variables:

```text
DATABASE_URL=postgresql://...
PYTHON_VERSION=3.11.9
JWT_SECRET=replace-with-secure-secret
JWT_ALG=HS256
JWT_EXPIRES_MIN=60
CORS_ORIGINS=http://localhost:5173,https://addistask-1.onrender.com
```

Frontend Render environment variable:

```text
VITE_API_URL=https://addistask.onrender.com
```

## Demo Workflow

1. Register or login as a customer.
2. Post a task, such as House Cleaning.
3. Register or login as a provider.
4. Create a provider profile with a matching skill category.
5. Browse marketplace tasks.
6. Use Smart Match to see matching providers.
7. Provider applies to a task.
8. Customer reviews applications and accepts a provider.
9. Task status changes from open to assigned.

## Capstone Notes

This project demonstrates full-stack software engineering, REST API design, authentication, database modeling, deployment, and a functioning marketplace workflow. It also includes an intelligent provider matching feature that goes beyond basic CRUD operations.

## Future Roadmap

- Provider ratings and customer reviews
- Availability scheduling
- Search by location and price
- Provider verification workflow
- Admin dashboard
- Payment integration
- SMS notifications
- Chat between customers and providers
- Mobile-first redesign

## Author

Amaha K
