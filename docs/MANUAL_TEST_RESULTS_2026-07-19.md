# AddisTask Manual Test Results - 2026-07-19

This file tracks the admin pilot-cleanup usability pass.

## Summary

- Pilot Cleanup Review admin section: Passed
- Visible task counts: Passed
- Hide-to-hidden-tasks behavior: Passed
- Admin launch checklist: Passed
- Logged-in password change: Passed
- Failed-login limiting: Passed
- Account forgot-password guidance: Passed
- Pilot communication templates: Added
- Manual pilot messages panel: Passed
- First admin checklist panel: Passed
- Pilot run panel and run sheet: Passed
- First admin and pilot onboarding docs: Added
- Temporary test cleanup: Passed
- Frontend check/build: Passed
- Backend marketplace workflow tests: Passed

## Checks Completed

| Area | Status | Notes |
| --- | --- | --- |
| Admin cleanup review section | Passed | Data Management now shows a Pilot Cleanup Review section with visible marketplace task rows and a capped scroll area. |
| Visible task counts | Passed | Browser-tested with a temporary open Moving task. The section showed open, assigned, completed, and visible total counts. |
| Task review hint | Passed | The temporary task title included review wording and was flagged as sample/test-like data. |
| Hide and hidden-list behavior | Passed | Archived the temporary task through the admin archive path, refreshed the admin dashboard, and confirmed the task disappeared from the visible review list and appeared under Hidden marketplace tasks with the archive reason. |
| Admin launch checklist | Passed | Browser-tested with a temporary admin account. Marketplace Operations showed the Launch Checklist with live readiness items and a readiness score. |
| Logged-in password change | Passed | Added backend password-change protection and Account UI. Browser-tested with a temporary customer: password updated from Account, old login failed, and new login succeeded. |
| Failed-login limiting | Passed | Added a temporary in-memory failed-login limiter. Backend test confirms repeated wrong passwords are blocked with a temporary wait message. |
| Account forgot-password guidance | Passed | Added a clear Account-screen note explaining that pilot users should contact the owner directly until verified SMS/email reset is available. |
| Pilot communication templates | Added | Added `docs/PILOT_COMMUNICATION_TEMPLATES.md` with customer invitation, provider invitation, profile reminder, forgot-password, day-of-test, and feedback messages. |
| Manual pilot messages panel | Passed | Added an admin Marketplace Operations panel that highlights manual outreach items such as provider invitations, provider reminders, customer invitations, feedback, and password help. |
| First admin checklist panel | Passed | Added an admin Marketplace Operations panel that guides the owner through account setup, admin controls, data scan, provider queue review, and owner setup docs. |
| Pilot run panel and run sheet | Passed | Added an admin Marketplace Operations panel for tracking one customer/provider pilot transaction and added `docs/PILOT_RUN_SHEET.md` for observation notes. |
| Pilot launch checklist document | Added | Added `docs/PILOT_LAUNCH_CHECKLIST.md` for owner setup, marketplace cleanup, provider readiness, customer test setup, pilot-day flow, observation notes, and stop conditions. |
| First admin setup document | Added | Added `docs/FIRST_ADMIN_SETUP.md` for owner/admin setup, password safety, and manual forgot-password handling during a controlled pilot. |
| Pilot user onboarding document | Added | Added `docs/PILOT_USER_ONBOARDING.md` for customer/provider pilot instructions and observation prompts. |
| Frontend check/build | Passed | `npm run check` completed successfully. |
| Backend workflow tests | Passed | Ran the marketplace workflow backend test file; all 19 tests passed. |
| Temporary test cleanup | Passed | Temporary admin user, temporary task, and related archive history were removed after the browser pass. |

## Follow-Up

- Continue with verified password reset design and decide whether first production notifications should be SMS, email, WhatsApp, or manual owner messages during the first pilot.
