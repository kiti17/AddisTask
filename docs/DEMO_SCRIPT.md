# AddisTask Demo Script

## Goal

Show AddisTask as a TaskRabbit-style local services marketplace for Addis Ababa. The demo should explain the city problem, show the working marketplace flow, and connect the MSSE project to a future startup.

Recommended demo length: 6 to 8 minutes.

## Opening

Suggested opening:

```text
AddisTask started from a practical problem in Addis Ababa: people need reliable help for everyday services, and skilled local providers need a better way to find paid work. The current process often depends on word of mouth, which makes trust, pricing, timing, and availability hard to manage.

AddisTask turns that informal process into a structured marketplace. Customers can post tasks, providers can create profiles and apply, the platform recommends matching providers, and the job can move from open to assigned to completed.
```

## Demo Setup

Before presenting:

1. Start the backend if available.
2. Start the frontend.
3. Open the frontend in the browser.
4. Click `Load Demo Data` if the database is empty.

Useful local URL:

```text
http://localhost:5173
```

If the backend is unavailable or the database is empty, use demo data. Demo data runs in the browser and shows realistic Addis Ababa tasks, providers, marketplace metrics, and smart matching behavior.

## Walkthrough

### 1. Problem And Product Framing

Screen: Home

Say:

```text
The first screen frames AddisTask as a local services marketplace for Addis Ababa. The product focuses on common services such as cleaning, plumbing, moving, delivery, repair, electrical work, appliance repair, and painting.
```

Point out:

- Addis Ababa local-services focus.
- Customer and provider entry points.
- Marketplace snapshot.
- Demo data controls.

### 2. Marketplace Snapshot

Screen: Home or Marketplace

Action:

1. Click `Load Demo Data`.
2. Show the marketplace dashboard.

Say:

```text
The dashboard shows the marketplace as an operating system, not only a listing page. It tracks open requests, assigned jobs, completed jobs, provider supply, average rating, completion rate, and category-level demand versus supply.
```

Point out:

- Open requests.
- Assigned jobs.
- Completed jobs.
- Provider supply.
- Average rating.
- Category insights such as `Need providers` or `Need demand`.

### 3. Customer Posts A Task

Screen: Post a Task

Action:

1. Click `Post a task`.
2. Choose a category such as Cleaning or Plumbing.
3. Show the guidance panel.
4. Use the example title.
5. Point to budget, urgency, preferred date, time window, and access notes.

Say:

```text
The posting flow helps the customer create a clear request. For each service category, AddisTask suggests a realistic budget range and a checklist of details providers need before they can quote or accept the work.
```

Point out:

- Suggested budget.
- Example title.
- Checklist.
- Addis Ababa area selection.
- Schedule and access notes.

### 4. Marketplace Task Browsing

Screen: Marketplace

Action:

1. Click `Browse jobs` or return to Marketplace.
2. Show task cards.
3. Filter by category if useful.

Say:

```text
The marketplace shows task details in a way providers can scan quickly: location, category, budget, urgency, date, time window, and access notes. Each task also shows a lifecycle from open to assigned to completed.
```

Point out:

- Task lifecycle indicator.
- Budget and schedule tags.
- Access notes.
- Filter by category.

### 5. Smart Matching

Screen: Marketplace

Action:

1. Click `Smart Match` on a demo task.
2. Show the matched provider panel.

Say:

```text
Smart matching ranks providers by category, area, rating, completed work, and response time. This is one of the features that moves the project beyond basic CRUD and toward a real marketplace experience.
```

Point out:

- Match score.
- Provider rating.
- Completed jobs.
- Response time.
- Service category and area match.

### 6. Provider Directory

Screen: Marketplace

Action:

1. Show Provider Directory.
2. Click `Load Providers` if needed.

Say:

```text
Customers can also browse the provider directory. This supports discovery before or after posting a task and gives customers trust signals before choosing someone.
```

Point out:

- Provider name.
- Service category.
- City or area.
- Rating.
- Completed jobs.
- Response time.

### 7. Applications And Assignment

Screen: Marketplace

Action:

1. Click `Applications` on a task.
2. Show applicant card.
3. Click `Accept` or explain accept/reject.

Say:

```text
Providers apply to tasks, and the customer can compare applicants. Accepting one provider assigns the task and rejects other pending applications. This creates a real booking workflow instead of just a public job board.
```

Point out:

- Accept and reject.
- Application status.
- Trust signals on applicant cards.

### 8. Messaging

Screen: Marketplace

Action:

1. Show Messages section.
2. Select an assigned task.
3. Explain customer-provider coordination.

Say:

```text
After a provider is accepted, task-specific messaging becomes available. This keeps timing, access, and job details connected to the task instead of moving the conversation outside the platform.
```

Point out:

- Assigned tasks only.
- Message history.
- Message composer.

### 9. Completion And Reviews

Screen: Marketplace

Action:

1. Complete an assigned demo task.
2. Show Reviews section.

Say:

```text
After the task is completed, the customer can review the provider. Reviews update provider reputation, which improves future matching and trust.
```

Point out:

- Completed task review.
- Rating.
- Comment.
- Provider rating update in backend workflow.

## Technical Summary

Say:

```text
Technically, AddisTask is a full-stack application. The frontend is React with Vite and Axios. The backend is FastAPI with SQLAlchemy, PostgreSQL, Pydantic schemas, JWT authentication, and REST endpoints for users, tasks, providers, applications, messages, and reviews.
```

Mention:

- Authentication.
- REST API design.
- Database models.
- Smart matching.
- Deployment on Render.

## Startup Direction

Say:

```text
For the startup direction, the next priorities are provider verification, richer provider profiles, availability scheduling, payments, SMS notifications, admin tools, and dispute handling. The current MVP already demonstrates the core marketplace loop: post, match, apply, accept, coordinate, complete, and review.
```

## Closing

Suggested closing:

```text
AddisTask solves a local service discovery and trust problem in Addis Ababa. It began as an MSSE final project, but the architecture and product workflow are designed so it can continue growing into a real startup marketplace.
```

## Backup Plan

If something fails during the demo:

- If the backend database is empty, click `Load Demo Data`.
- If login is slow, present the demo-data workflow first.
- If provider matching has no results, use a demo task with a matching demo provider.
- If a real API request fails, explain that demo mode is local and use it to continue the walkthrough.
- If time is short, show only: Home, Load Demo Data, Marketplace, Smart Match, Provider Directory, Applications, Dashboard.
