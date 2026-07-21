# AddisTask Production Readiness Roadmap

AddisTask has moved from MSSE demo project to startup product. The next goal is not more demo features. The next goal is a safe, focused pilot with real customers and a small number of trusted providers in Addis Ababa.

## Current Readiness

### Strong foundation

- Customer registration and login
- Logged-in password change
- Basic failed-login limiting for pilot safety
- Pilot communication templates
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
- Admin-only provider approval protection
- Customer/provider/admin role-focused dashboards
- Manual payment status tracking
- Backend workflow tests for the core marketplace loop

### Main production gaps

- Provider verification is a prototype, not a secure operating process.
- The frontend is concentrated in one large `App.jsx`, which makes future changes risky.
- Database changes need stricter production migration discipline.
- Production environment guards now reject unsafe secrets and localhost database URLs when `APP_ENV=production`.
- There is no production-grade shared rate limiting, phone verification, verified password reset, or automated account recovery.
- There is no real external notification channel yet, such as SMS, email, or WhatsApp, though pilot communication templates are prepared for manual outreach.
- Payment is manually tracked, but commission reports, cancellation, refunds, and full dispute operations are not implemented.

## Phase 1: Production Foundation

Goal: make the existing marketplace safer and easier to maintain before inviting real pilot users.

### P0 - Must fix before pilot

1. Keep admin authorization protected
   - Admin-only route protection is in place.
   - Provider approval/rejection is restricted to admins.
   - Continue testing that normal providers and customers cannot access platform verification controls.

2. Add Alembic migrations
   - Replace ad hoc schema changes with versioned migrations.
   - Create migrations for provider approval status and future production tables.
   - Document database upgrade steps.

3. Expand automated backend workflow tests
   - Current tests cover registration/login, provider approval protection, applying rules, customer acceptance, task completion, payment status rules, messaging permissions, and review rules.
   - Next tests should cover task history visibility and dashboard edge cases.

4. Continue refining dashboards by role
   - Customer dashboard now focuses on posted tasks, applications, assigned tasks, and payment.
   - Provider dashboard now focuses on approval status and applications.
   - Admin dashboard keeps verification, marketplace operations, and supply/demand visibility.
   - Next: reduce crowded sections and move repeated workflows into smaller focused pages/components.

5. Harden environment configuration
   - Production guard added for `JWT_SECRET` and `DATABASE_URL`.
   - Backend and frontend `.env.example` files added.
   - Next: remove remaining local defaults after deployment scripts are finalized.

## Phase 2: Trust and Operations

Goal: support a controlled Addis Ababa pilot with real providers.

### P1 - Pilot readiness

1. Provider verification details
   - Add provider bio, experience, service areas, ID/document status, and availability.
   - Internal admin notes for approval decisions are in place.
   - Provider reminders, approvals, rejections, and pending resets are recorded in admin history.

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
   - Provider reminder and approval decision history is now in place for pilot operations.
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

Continue with account safety and pilot onboarding after the launch checklist.

Reason: the admin launch checklist and cleanup controls now help the owner prepare a controlled pilot. The next risk is whether real pilot users can access accounts safely, recover from login problems, and understand what to do before test day.

First implementation scope:

- Plan password reset and account recovery.
- Prepare first real admin setup instructions.
- Write simple customer and provider onboarding instructions.
- Keep using `docs/MANUAL_TESTING_CHECKLIST.md`, `docs/PILOT_TEST_SCRIPT.md`, and `docs/PILOT_LAUNCH_CHECKLIST.md` after each group of changes.
