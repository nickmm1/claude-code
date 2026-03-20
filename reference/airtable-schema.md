# Airtable Database Structure

One base called "Level Up Academy" (ID: appo1o8n17v0uHt5x) with five tables:

## Table 1: Members
One row per paying member. Master record.

| Field | Type | Purpose |
|-------|------|---------|
| Name | Single line text | Member's full name |
| Phone | Phone number | For Quo communication |
| Instagram | URL | Handle for Apify scraping |
| Website | URL | For Apify and on-site SEO fix |
| GBP Link | URL | Google Business Profile for scraping |
| Monthly Revenue | Single select | Revenue bracket from Typeform |
| Biggest Constraint | Single select | Profit / Clients / Staff / All |
| Phase | Single select | Phase 1 / Phase 2 / Phase 3 / Phase 4 |
| Join Date | Date | When they signed up |
| Billing Date | Date | Day of month their subscription renews |
| Next Report Date | Formula | Billing Date minus 7 days |
| Last Report Generated | Date | When reports were last generated |
| Report Delivery Status | Single select | Pending / Generated / Delivered |
| Payment Type | Single select | Monthly / All-In |
| Status | Single select | Active / At-Risk / Churned / Paused |
| Core Values | Long text | From onboarding form |
| Search Atlas ID | Single line text | Their project ID (Inner Circle only) |
| Notion Portal Link | URL | Link to their Notion dashboard |
| Last Call Attended | Date | For engagement tracking |
| Last Community Post | Date | For engagement tracking |
| Last Report Opened | Date | For retention tracking |
| At-Risk Flag | Checkbox | Auto-flagged when engagement drops |
| Notes | Long text | Internal notes from calls and check-ins |

## Table 2: Team Members
One row per stylist, manager, or front desk person linked to their owner.

| Field | Type | Purpose |
|-------|------|---------|
| Name | Single line text | Team member's name |
| Email | Email | For Next Level Stylist access |
| Role | Single select | Stylist / Manager / Front Desk / Other |
| Linked Member | Linked record | Links to owner in Members table |
| NLS Status | Single select | Active / Removed |
| Date Added | Date | When they got access |

## Table 3: Reports
One row per report generated. Linked to the member.

| Field | Type | Purpose |
|-------|------|---------|
| Linked Member | Linked record | Which member |
| Report Type | Single select | Profit Blueprint / Visibility Blueprint / Marketing Report / Monthly Profit / Monthly Visibility / NPS Report / Marketing Strategy |
| Date Generated | Date | When created |
| Status | Single select | Pending / Reviewed / Delivered |
| Notion Page Link | URL | Link to report in Notion portal |
| Report Data (JSON) | Long text | Raw data that fed into Claude |
| Month | Single line text | Which month this covers |

## Table 4: Pipeline
One row per prospect from Typeform who has not paid yet.

| Field | Type | Purpose |
|-------|------|---------|
| Name | Single line text | Prospect's name |
| Phone | Phone number | For sales outreach via Quo |
| Instagram | URL | For credibility check |
| Website | URL | For visibility audit |
| Revenue Bracket | Single select | From Typeform |
| Biggest Constraint | Single select | From Typeform |
| Ready to Start | Single select | Yes I'm ready / Not yet |
| Pipeline Status | Single select | New / Contacted / Call Scheduled / Closed Won / Closed Lost / Nurture |
| Lead Source | Single select | DM / Typeform / Referral / Ad / Organic |
| Last Contact Date | Date | When last reached out |
| Next Follow-Up | Date | When to follow up |
| Assigned To | Single select | Which sales team member |
| Notes | Long text | Conversation notes |

## Table 5: Engagement Tracker
One row per member per week. Tracks engagement health.

| Field | Type | Purpose |
|-------|------|---------|
| Linked Member | Linked record | Which member |
| Week Of | Date | Which week |
| Calls Attended | Number | How many coaching calls joined |
| Community Posts | Number | Posts or comments |
| Report Opened | Checkbox | Did they open their monthly report |
| Team NLS Active | Checkbox | Are their team members active in NLS |
| At-Risk | Checkbox | Flagged if multiple metrics are low |
