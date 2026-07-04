# AddisTask

AddisTask is a local services marketplace designed for Addis Ababa. Customers can post service tasks, providers can create service profiles, and the platform recommends matching providers using category, location, rating, completed task count, and response time.

Project overview:

```text
../README.md
```

Product strategy and startup roadmap:

```text
../docs/PRODUCT_STRATEGY.md
```

MSSE demo walkthrough:

```text
../docs/DEMO_SCRIPT.md
```

## Live Links

- Frontend: https://addistask-1.onrender.com
- Backend API: https://addistask.onrender.com
- API Docs: https://addistask.onrender.com/docs
- Health Check: https://addistask.onrender.com/api/health
- GitHub Repository: https://github.com/kiti17/AddisTask

> If a Render URL changes, update the links above before final submission.

## Project Purpose

AddisTask solves a practical local service problem: customers need reliable help for everyday work, while skilled local providers need a simple way to find jobs. The project supports services such as cleaning, plumbing, electrical work, moving, delivery, painting, appliance repair, and home repair.

## Core Features

- User registration and login
- Persistent authentication using JWT
- Customer task posting
- Task details with budget, urgency, preferred date, time window, and access notes
- Provider profile creation
- Task category and location filtering
- Provider directory with trust signals
- Smart provider matching
- Provider applications to tasks
- Customer application review, acceptance, and rejection
- Task status workflow: open -> assigned -> completed
- Task-specific messaging after a provider is accepted
- Customer reviews after completed tasks
- Provider rating updates from review history
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
- Tables include users, tasks, provider_profiles, applications, reviews, and task_messages

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
| PATCH | /api/tasks/{task_id}/complete | Complete an assigned task |
| POST | /api/providers/ | Create provider profile |
| GET | /api/providers/ | List providers |
| GET | /api/providers/match/{task_id} | Smart provider matching |
| POST | /api/applications/ | Provider applies to task |
| GET | /api/applications/task/{task_id} | List applications for a task |
| PATCH | /api/applications/{application_id}/status | Accept/reject application |
| POST | /api/messages/task/{task_id} | Send a task message |
| GET | /api/messages/task/{task_id} | List task messages |
| POST | /api/reviews/ | Review a completed task provider |
| GET | /api/reviews/provider/{provider_id} | List provider reviews |

## Running AddisTask Locally

### Backend

Start the backend server:

```powershell
cd backend
python -m uvicorn app.main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Environment Variables

Backend Render environment variables:

```text
APP_ENV=production
DATABASE_URL=postgresql://...
PYTHON_VERSION=3.11.9
JWT_SECRET=replace-with-secure-secret-at-least-32-characters
JWT_ALG=HS256
JWT_EXPIRES_MIN=60
CORS_ORIGINS=http://localhost:5173,https://addistask-1.onrender.com
```

Production safety rules:

- `APP_ENV=production` requires a secure `JWT_SECRET`.
- Production `JWT_SECRET` must not be `change-this-secret`.
- Production `JWT_SECRET` must be at least 32 characters.
- Production `DATABASE_URL` must not point to localhost.

For local development, copy `.env.example` to `.env` and keep `APP_ENV=local`.

Frontend Render environment variable:

```text
VITE_API_URL=https://addistask.onrender.com
```

## Database Migrations

Alembic is configured for production database changes.

Run migrations from the backend folder:

```powershell
cd backend
python -m alembic upgrade head
```

The first migration adds `provider_profiles.approval_status`, which is used by the provider verification workflow.

If an existing local database already has the column because it was added before Alembic was introduced, mark the database at the current migration revision:

```powershell
cd backend
python -m alembic stamp head
```

Local note: if `backend/.venv/Scripts/python.exe` points to a missing Python install, recreate the backend virtual environment before running Alembic:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m alembic upgrade head
```

## Tests

The backend includes automated workflow tests for the core marketplace rules: login identity, admin-only provider approval, provider application approval, customer acceptance, and blocking users from applying to their own tasks.

Run the test suite from the backend folder:

```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest tests\test_marketplace_workflow.py -q
```

These tests use the local development database, so keep PostgreSQL running before executing them.

## Demo Workflow

1. Register or login as a customer.
2. Post a task with category, area, budget, schedule, and access notes.
3. Register or login as a provider.
4. Create a provider profile with a matching skill category.
5. Browse marketplace tasks and the provider directory.
6. Use Smart Match to see matching providers.
7. Provider applies to a task.
8. Customer reviews applications and accepts a provider.
9. Task status changes from open to assigned.
10. Customer and provider coordinate with task messages.
11. Customer marks the task completed.
12. Customer reviews the provider and updates the provider rating.

## Capstone Notes

This project demonstrates full-stack software engineering, REST API design, authentication, database modeling, deployment, and a functioning marketplace workflow. It also includes intelligent provider matching and a product path from MSSE final project to startup MVP.

## Future Roadmap

- Provider verification workflow
- Provider profile bio, experience, availability, and service areas
- Search by location and price
- Admin dashboard
- Payment integration
- SMS notifications
- Mobile-first redesign

## Author

Amaha K
