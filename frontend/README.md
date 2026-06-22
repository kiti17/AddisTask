# AddisTask Frontend

This is the React frontend for AddisTask, a local services marketplace for Addis Ababa.

Project overview:

```text
../README.md
```

The frontend supports the main customer and provider workflows:

- Customer account access.
- Customer task posting.
- Task details with category, Addis Ababa area, budget, urgency, preferred date, time window, and access notes.
- Provider profile creation.
- Marketplace task browsing and category filtering.
- Smart provider matching.
- Provider directory with trust signals.
- Application review, acceptance, and rejection.
- Assigned-task messaging.
- Completed-task review submission.

## Local Development

Install dependencies:

```powershell
npm install
```

Start the Vite dev server:

```powershell
npm run dev
```

The app runs at:

```text
http://localhost:5173
```

If the backend is running locally, the frontend uses:

```text
http://127.0.0.1:8000
```

For production, set:

```text
VITE_API_URL=https://addistask.onrender.com
```

## Quality Checks

Run lint:

```powershell
npm run lint
```

Run a production build:

```powershell
npm run build
```

## Product Context

See the product and startup strategy document:

```text
../docs/PRODUCT_STRATEGY.md
```

See the MSSE demo walkthrough:

```text
../docs/DEMO_SCRIPT.md
```
