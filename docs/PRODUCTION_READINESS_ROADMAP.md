# AddisTask Production Readiness Roadmap

AddisTask has moved from MSSE demo project to startup product. The next goal is not more demo features. The next goal is a safe, focused pilot with real customers and a small number of trusted providers in Addis Ababa.

## Current Readiness

### Strong foundation

- Customer registration and login
- Customer and provider mode
- Task posting and browsing
- Provider profiles
- Provider approval status
- Provider applications
- Customer accept/reject workflow
- Assigned and completed task states
- In-app notification center
- Messaging and reviews foundation
- Marketplace metrics and category insights

### Main production gaps

- Admin actions are not protected by a true admin role yet.
- Provider verification is a prototype, not a secure operating process.
- The frontend is concentrated in one large `App.jsx`, which makes future changes risky.
- Database changes are partly handled by `create_all` and a manual startup `ALTER TABLE`; production needs Alembic migrations.
- Production environment guards now reject unsafe secrets and localhost database URLs when `APP_ENV=production`.
- There are no automated backend tests for the core marketplace workflow.
- There is no rate limiting, phone verification, password reset, or account recovery.
- There is no real external notification channel yet, such as SMS, email, or WhatsApp.
- Payment, commission tracking, cancellation, refunds, and disputes are not implemented.

## Phase 1: Production Foundation

Goal: make the existing marketplace safer and easier to maintain before inviting real pilot users.

### P0 - Must fix before pilot

1. Add real admin authorization
   - Add admin-only route protection.
   - Restrict provider approval/rejection to admins.
   - Prevent normal providers or customers from accessing platform verification controls.

2. Add Alembic migrations
   - Replace ad hoc schema changes with versioned migrations.
   - Create migrations for provider approval status and future production tables.
   - Document database upgrade steps.

3. Add automated backend workflow tests
   - Register/login.
   - Customer creates task.
   - Provider profile starts pending.
   - Pending provider cannot apply.
   - Admin approves provider.
   - Provider applies.
   - Customer accepts.
   - Task becomes assigned.
   - Customer completes task.
   - Customer reviews provider.

4. Split dashboards by role
   - Customer dashboard: my tasks, applications, messages, reviews.
   - Provider dashboard: my profile, approval status, available jobs, applications.
   - Admin dashboard: verification queue and provider decisions.

5. Harden environment configuration
   - Production guard added for `JWT_SECRET` and `DATABASE_URL`.
   - Backend and frontend `.env.example` files added.
   - Next: remove remaining local defaults after deployment scripts are finalized.

## Phase 2: Trust and Operations

Goal: support a controlled Addis Ababa pilot with real providers.

### P1 - Pilot readiness

1. Provider verification details
   - Add provider bio, experience, service areas, ID/document status, and availability.
   - Add internal admin notes for approval decisions.
   - Track who approved or rejected a provider.

2. Customer and provider history
   - Show task history by role.
   - Show provider application history.
   - Show customer completed tasks and reviews.

3. Cancellation and dispute basics
   - Add cancel task.
   - Add report issue.
   - Add support status for disputed jobs.

4. Real notifications
   - Start with email or SMS for critical events.
   - Notify customer when a provider applies.
   - Notify provider when application is accepted or rejected.
   - Notify both sides when task is completed or reviewed.

5. Basic audit logs
   - Track provider approval decisions.
   - Track task status changes.
   - Track application acceptance and rejection.

## Phase 3: Monetization

Goal: test business model with low operational risk.

### P2 - Revenue experiments

1. Manual payment tracking first
   - Add service fee estimate.
   - Add payment status: unpaid, cash agreed, paid, disputed.
   - Track platform commission manually.

2. Online payments later
   - Add payment provider only after pilot workflow is stable.
   - Support receipt and refund records.
   - Add commission reporting.

## Recommended Next Implementation

Start with P0 item 1: real admin authorization.

Reason: provider approval is currently a production-critical trust feature, but the approval endpoint is only protected by login. Before a real pilot, normal users must not be able to approve providers.

First implementation scope:

- Add `is_admin` helper on the backend.
- Restrict provider verification queue and approval routes to admin users.
- Add frontend behavior that hides admin verification controls for non-admin users.
- Add a small backend test or smoke workflow proving normal users are blocked and admins can approve.
