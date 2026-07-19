# AddisTask Manual Testing Checklist

Use this checklist after a group of changes, not after every small edit. The goal is to test AddisTask like a real customer, provider, and admin.

For a live pilot session with real users, use `docs/PILOT_TEST_SCRIPT.md`.

## Before Testing

- Start the backend.
- Start the frontend.
- Open the frontend in the browser.
- Use fresh test phone numbers when registering new users.
- Keep one customer account, one provider account, and one admin account for repeat testing.

## 1. Customer Account

- Register a new customer.
- Confirm registration logs the customer in.
- Open Account and update the password.
- Log out.
- Confirm the old password no longer logs in.
- Log back in with the same phone and new password.
- Try several wrong passwords and confirm the temporary wait message appears.
- Confirm the customer dashboard shows customer-focused information.

Pass if:

- Login/register works without confusing errors.
- Password update works only when the current password is correct.
- Repeated failed logins are temporarily limited.
- Customer mode is active after normal customer login.

## 2. Customer Posts A Task

- Go to customer mode.
- Post a task with title, description, category, area, budget, preferred date, time window, and access notes.
- Open the marketplace.
- Confirm the task appears under `My Posted Tasks` or `My Task History`.
- Confirm the provider directory focuses on related providers for that service and area.

Pass if:

- The posted task does not disappear after refresh.
- The task status starts as `open`.
- Payment status starts as `unpaid`.

## 3. Provider Profile

- Register or log in as a provider user.
- Switch to provider mode.
- Create a provider profile.
- Confirm the provider profile status is pending approval.
- Try applying to a task before approval.

Pass if:

- The app blocks the provider from applying before approval.
- The message clearly explains that approval is required.

## 4. Admin Approves Provider

- Log in as admin.
- Open admin mode.
- Load the provider approval queue.
- Approve the pending provider.
- Confirm the provider approval status changes to approved.

Pass if:

- Normal users cannot access admin approval.
- Admin can approve providers.
- Approved provider appears as eligible for marketplace work.

## 5. Provider Applies To Task

- Log back in as the approved provider.
- Switch to provider mode.
- Open marketplace.
- Find a matching open task.
- Apply to the task.
- Open provider activity.

Pass if:

- Application is sent successfully.
- Provider activity shows the application as `pending`.

## 6. Customer Accepts Provider

- Log back in as the customer who posted the task.
- Open marketplace.
- Open applications for the posted task.
- Accept the provider application.

Pass if:

- Task status changes to `assigned`.
- Other pending applications for that task are rejected.
- Customer sees the task as assigned.
- Provider activity shows the application as accepted.

## 7. Messages

- As customer, open messages for the assigned task.
- Send a short message.
- Log in as provider and open messages for the same task.

Pass if:

- Messages are available only after a provider is accepted.
- Customer and accepted provider can both view the conversation.

## 8. Complete Task

- Log in as the customer who posted the assigned task.
- Mark the task completed.
- Confirm the task appears under completed tasks.

Pass if:

- Only the task owner can complete the task.
- Task status becomes `completed`.
- Provider completed job count increases.

## 9. Payment Tracking

- As the customer, update payment status:
  - Cash agreed
  - Paid
  - Disputed
- Log in as the provider and check provider activity.

Pass if:

- Only the task owner can update payment status.
- Provider can see the latest task payment status.
- Payment summary updates for the customer.

## 10. Review Provider

- As the customer, choose the completed task.
- Submit a provider rating and comment.
- Open the provider profile.

Pass if:

- Review is saved.
- Provider profile shows customer review information.
- The same task cannot be reviewed twice.

## 11. Error Message Check

Try these blocked actions:

- Provider applies to own task.
- Provider applies before approval.
- Non-owner tries to complete a task.
- Non-owner tries to update payment.
- User tries to message before provider acceptance.

Pass if:

- The app blocks the action.
- The message explains the reason in plain language.

## 12. Admin Pilot Run Check

- Log in as admin.
- Open Marketplace Operations.
- Review First Admin Checklist, Launch Checklist, Manual Pilot Messages, and Pilot Run.
- Run Scan Data after the customer/provider test.
- Confirm Pilot Run reflects task, provider, application, acceptance, messages, completion, and review activity.

Pass if:

- The admin can understand what happened during the pilot run.
- Missing pilot steps are easy to identify.
- The owner knows which follow-up message or fix is needed next.

## Final Pilot Readiness Signal

The flow is ready for a small controlled pilot when:

- Customer can complete the whole flow without help.
- Provider understands approval and application status.
- Admin can approve providers without confusion.
- Payment and review status are visible to both sides.
- No critical page feels broken, crowded, or unclear.
