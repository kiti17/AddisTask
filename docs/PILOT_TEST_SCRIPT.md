# AddisTask Pilot Test Script

Use this script with one customer, one provider, and one admin during a controlled pilot test.

Recommended session length: 20 to 30 minutes.

## Setup

- Backend running at `http://127.0.0.1:8000`
- Frontend running at `http://127.0.0.1:5173`
- One admin account ready
- One fresh customer phone number
- One fresh provider phone number
- One realistic task category, area, and budget

## Customer Test

Ask the customer to complete these steps without coaching unless they are blocked:

1. Register or log in.
2. Post a task with category, area, budget, preferred date, time window, and access notes.
3. Open Browse Jobs.
4. Confirm the task appears under My Posted Tasks.
5. Open Manage Task.
6. Open Smart Match and review recommended providers.
7. Open the Provider Directory and filter by the task service and area.

Pass if:

- The customer can find their task after refresh.
- The customer understands Manage Task as the main place for task actions.
- The customer can identify at least one relevant provider.
- The customer does not need to scroll to the bottom of the page to find the next action.

## Provider Test

Ask the provider to complete these steps:

1. Register or log in.
2. Switch to Provider Mode.
3. Create a provider profile with service, area, bio, experience, availability, and phone.
4. Confirm the profile is waiting for approval.
5. After admin approval, return to Provider Mode.
6. Find a matching open task.
7. Apply to the task.
8. Open Provider Activity and confirm the application is pending.

Pass if:

- The provider understands approval is required before applying.
- The provider can see only relevant open tasks easily.
- The provider can confirm whether an application is pending, accepted, or rejected.

## Admin Test

Ask the admin/operator to complete these steps:

1. Log in as admin.
2. Open the provider approval queue.
3. Review the provider trust checklist.
4. Approve a complete provider profile or reject an incomplete one with a note.
5. Open Data Management.
6. Review Pilot Cleanup Review and confirm visible task counts make sense.
7. Confirm hidden tasks, admin history, and marketplace cleanup controls are understandable.

Pass if:

- Admin-only controls are not visible to normal customers/providers.
- The admin understands why a provider can or cannot be approved.
- The admin can identify old, duplicate, or sample tasks before a pilot demo.
- The admin can explain what cleanup/archive actions do before clicking them.

## Observation Notes

Record these during the session:

- Where the user hesitated
- Which button labels were unclear
- Whether any page felt crowded
- Whether the user knew what to do next
- Any action that required help

## Pilot Readiness Decision

Ready for a small pilot when:

- Customer can post, manage, and compare providers without help.
- Provider can create a profile, wait for approval, and apply without help.
- Admin can approve providers and manage marketplace records without help.
- No critical action depends on scrolling through unrelated sections.
