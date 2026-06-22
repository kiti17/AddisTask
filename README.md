# AddisTask

AddisTask is a local services marketplace for Addis Ababa. It connects customers who need everyday help with skilled local providers who want a clearer way to find paid work.

The product direction is similar to TaskRabbit, but localized for Addis Ababa: phone-first onboarding, neighborhood-aware services, provider trust signals, task scheduling, smart matching, messaging, completion tracking, and reviews.

## Project Purpose

This project began as an MSSE final project and is designed to continue as a startup MVP. The core problem is practical: customers often rely on informal word-of-mouth to find service providers, while skilled providers lack a steady digital marketplace for local jobs.

AddisTask turns that informal process into a structured workflow:

```text
Post task -> Match providers -> Provider applies -> Customer accepts -> Coordinate -> Complete -> Review
```

## Live Links

- Frontend: https://addistask-1.onrender.com
- Backend API: https://addistask.onrender.com
- API Docs: https://addistask.onrender.com/docs
- Health Check: https://addistask.onrender.com/api/health

## Repository Guide

| Path | Purpose |
|---|---|
| `frontend/` | React + Vite customer/provider marketplace UI |
| `backend/` | FastAPI backend, SQLAlchemy models, authentication, and REST API |
| `docs/PRODUCT_STRATEGY.md` | Product, capstone, and startup strategy |
| `docs/DEMO_SCRIPT.md` | 6-8 minute MSSE demo walkthrough |

## Current MVP Features

- Customer registration and login
- Provider profile creation
- Customer task posting
- Service-specific posting guidance and suggested budget ranges
- Task details with category, Addis Ababa area, budget, urgency, schedule, and access notes
- Marketplace task browsing and category filtering
- Provider directory with ratings, completed jobs, and response time
- Smart provider matching
- Provider applications to tasks
- Customer application accept/reject workflow
- Task lifecycle: open -> assigned -> completed
- Task-specific messaging after provider acceptance
- Customer reviews after completed tasks
- Provider rating updates from review history
- Marketplace dashboard with operating metrics
- Category demand-versus-supply insights
- Browser-only demo data for presentations

## Technology Stack

Frontend:

- React
- Vite
- Axios
- Responsive CSS

Backend:

- FastAPI
- SQLAlchemy ORM
- PostgreSQL
- Pydantic
- JWT authentication

Deployment:

- Render Static Site for frontend
- Render Web Service for backend
- Render PostgreSQL database

## Quick Start

Start the backend:

```powershell
cd backend
python -m uvicorn app.main:app --reload
```

Start the frontend in another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

If the database is empty during a presentation, click `Load Demo Data` in the app dashboard.

## Demo Flow

Recommended walkthrough:

1. Open the home page and explain the Addis Ababa service-discovery problem.
2. Click `Load Demo Data`.
3. Show the marketplace dashboard and category insights.
4. Post a task and show service-specific guidance.
5. Browse marketplace task cards and lifecycle status.
6. Use Smart Match.
7. Show the provider directory.
8. Review applications and accept a provider.
9. Show messaging for an assigned task.
10. Complete a task and explain reviews.

Full script:

```text
docs/DEMO_SCRIPT.md
```

## Startup Roadmap

Near-term startup priorities:

- Provider verification workflow
- Richer provider profiles with bio, experience, service areas, and availability
- Customer and provider history views
- Admin dashboard
- Payments or payment intent tracking
- SMS or WhatsApp-style notifications
- Dispute, cancellation, and support workflows

More detail:

```text
docs/PRODUCT_STRATEGY.md
```

## Author

Amaha K
