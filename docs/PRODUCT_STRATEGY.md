# AddisTask Product Strategy

## Vision

AddisTask is a trusted local services marketplace for Addis Ababa. The product connects customers who need everyday help with skilled local providers who want consistent paid work.

The long-term direction is similar to TaskRabbit, but adapted for Addis Ababa: phone-first onboarding, local area matching, trust signals, scheduled work, provider reputation, and simple coordination between customers and providers.

## Problem

Many Addis Ababa residents and small businesses need help with cleaning, moving, delivery, repair, plumbing, electrical work, and other everyday services. The current process is often informal:

- Customers rely on word of mouth and may not know who is reliable.
- Skilled workers may depend on personal networks instead of a steady marketplace.
- Pricing, timing, quality, and communication are not always clear before work begins.
- Customers have limited visibility into provider reputation.
- Providers have limited visibility into available jobs nearby.

This creates friction on both sides of the market. AddisTask turns that informal process into a structured digital workflow.

## Target Users

### Customers

Customers are residents, tenants, homeowners, families, and small business owners in Addis Ababa who need trusted help for local tasks.

Customer needs:

- Find available providers by service category and area.
- Post clear task requirements with budget, timing, and access notes.
- Compare provider trust signals before assigning work.
- Coordinate job details after accepting a provider.
- Review providers after completed work.

### Providers

Providers are skilled workers, small service businesses, freelancers, and local operators who want easier access to paid work.

Provider needs:

- Create a simple service profile.
- Browse open tasks that match their category and area.
- Apply to tasks without needing personal referrals.
- Build reputation through completed jobs and customer reviews.
- Communicate with customers after being accepted.

## Value Proposition

AddisTask helps customers find reliable local help and helps providers find paid work. The platform adds trust, structure, and visibility to everyday services in Addis Ababa.

Core value:

- Faster discovery of local service providers.
- Smarter matching by category, area, rating, completed work, and response time.
- Clear task details including budget, urgency, preferred date, time window, and access notes.
- Application and acceptance workflow.
- Messaging after a provider is accepted.
- Reviews and rating updates after completed work.

## Current MVP Capabilities

The current product supports the main marketplace journey:

1. User registration and login.
2. Customer task posting.
3. Task details with service category, area, budget, urgency, preferred date, time window, and access notes.
4. Provider profile creation.
5. Marketplace task browsing and category filtering.
6. Provider directory with trust signals.
7. Smart provider matching for a task.
8. Provider applications to tasks.
9. Customer review of applications.
10. Accept or reject provider applications.
11. Task status workflow from open to assigned to completed.
12. Task-specific messaging after a provider is accepted.
13. Customer review after a completed task.
14. Provider rating updates from review history.

## Marketplace Workflow

```text
Customer registers or logs in
        |
        v
Customer posts a task with details, budget, schedule, and location
        |
        v
Providers browse matching tasks or appear through smart matching
        |
        v
Provider applies to task
        |
        v
Customer compares applicants and accepts one provider
        |
        v
Task becomes assigned and other pending applications are rejected
        |
        v
Customer and provider coordinate through task messages
        |
        v
Customer marks task completed
        |
        v
Customer reviews provider and provider rating is updated
```

## Differentiation for Addis Ababa

AddisTask should not copy TaskRabbit blindly. The product should be localized for Addis Ababa:

- Area-based matching for neighborhoods such as Bole, Kazanchis, Piassa, Megenagna, CMC, Sar Bet, and Mexico.
- Phone-first identity because phone numbers are often more practical than email-only onboarding.
- Service categories that match local demand, including cleaning, delivery, repair, moving, plumbing, electrical work, painting, and home repair.
- Trust-building features that matter in informal service markets: completed jobs, response time, customer reviews, provider profile status, and clear communication.
- Future support for local payment and notification channels.

## Business Model Options

Possible startup revenue paths:

- Commission per completed job.
- Provider subscription for premium visibility.
- Featured provider placement by category and area.
- Service fee charged to customers for booking protection.
- Business accounts for small offices, apartments, and property managers.
- Verification fee for providers who complete identity or quality checks.

The safest early model is a small commission per completed job because it aligns revenue with actual marketplace value.

## Key Risks

- Trust and safety: customers need confidence before inviting providers into homes or businesses.
- Provider quality: early provider selection will shape the brand.
- Liquidity: both sides of the market must grow together by category and neighborhood.
- Pricing expectations: customers and providers may need guidance on fair pricing.
- Offline leakage: users may try to coordinate outside the platform after first contact.
- Operations: disputes, cancellations, no-shows, and low-quality work will need clear policies.

## Roadmap

### Near Term

- Provider verification status and admin approval.
- Better provider profiles with bio, experience, ID status, service areas, and availability.
- Customer task history and provider job history.
- Review display on provider profile cards.
- Better empty states and guided demo data for capstone presentations.

### Mid Term

- Booking calendar and availability slots.
- In-app notifications.
- SMS or WhatsApp-style notification integration.
- Payment flow or payment intent tracking.
- Admin dashboard for users, providers, tasks, and disputes.
- Cancellation and dispute workflow.

### Long Term

- Mobile-first app experience.
- Location-aware matching.
- Provider background checks or document verification.
- Dynamic pricing recommendations.
- Customer support dashboard.
- Business customer accounts.
- Analytics for service demand by neighborhood and category.

## Capstone Framing

For the MSSE final project, AddisTask demonstrates:

- Full-stack application architecture.
- REST API design.
- Authentication with JWT.
- Database modeling with users, tasks, providers, applications, reviews, and messages.
- Marketplace workflow design.
- Smart matching logic using category, location, rating, completed task count, and response time.
- Real-world problem analysis for Addis Ababa.
- A path from academic project to startup MVP.

Presentation walkthrough:

```text
docs/DEMO_SCRIPT.md
```

## Success Metrics

Early product metrics:

- Number of posted tasks.
- Number of active providers.
- Application rate per task.
- Acceptance rate.
- Task completion rate.
- Average provider rating.
- Average provider response time.
- Repeat customer activity.
- Completed jobs by service category and area.

These metrics show whether AddisTask is becoming a working marketplace instead of only a listing tool.
