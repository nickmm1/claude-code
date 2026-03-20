# What You Are Building

## Tool 1: Salon Visibility Analyzer (Force 2: Demand and Marketing)

Web application that scrapes a salon's entire digital landscape and generates a Visibility Blueprint (onboarding) and Monthly Visibility Reports (ongoing).

- **Data sources:** Apify (Instagram, Facebook, website, GBP, competitors)
- **Intelligence:** Claude API with Five Forces Framework and 7 Demand Channels
- **Storage:** Airtable (raw data and report links)
- **Delivery:** Notion customer portal
- **Hosting:** Manus for V1, Cloudflare for production
- **Full spec:** See Salon_Visibility_Analyzer_Build_Spec_V2.md

Key features: two entry points (manual input or Airtable trigger), scrapes Instagram/Facebook/website/GBP/competitors, generates 10-section report, billing-synced delivery (7 days before billing date), admin dashboard, member dashboard with visibility score and trend chart, dark mode premium UI, data visualizations (donut charts, bar charts, radar charts, calendar grids).

## Tool 2: NPS / Client Experience Tool (Force 3: Client Journey and Sales)

Web application giving each salon a branded client feedback form. Responses generate monthly Client Experience Reports.

- **Data sources:** Client feedback form submissions in Airtable
- **Intelligence:** Claude API analyzes feedback themes, calculates NPS, generates insights
- **Storage:** Airtable (NPS Responses table linked to member)
- **Delivery:** Notion customer portal
- **Hosting:** Manus for V1

Key features: unique URL and QR code per salon, 5-question client form (NPS score 0-10, what they loved, what could improve, rebook intent, testimonial permission), Claude generates monthly report with NPS score, themes, recommendations, approved testimonials, admin dashboard.

## Tool 3: AI Accountant Enhancement (Force 4: Profit and Protection)

Already built and running on Manus. Members input financial data. Generates profit analysis.

- **Current state:** Working web app on Manus
- **Future state:** Bring code into Claude Code. Add Five Forces intelligence. Connect to Airtable. Push output to Notion. Billing-synced delivery.

## Tool 4: On-Site SEO Fixer (Part of Onboarding)

Automation script that crawls a new member's website, identifies all on-site SEO issues, and generates optimized fixes (meta titles, descriptions, headers, schema markup, alt text, internal linking).

- **Data sources:** Apify website crawler
- **Intelligence:** Claude generates optimized versions of all SEO elements
- **Output:** Document with fixes. For Shopify/WordPress, fixes can be applied via API.
- **Timing:** Runs during onboarding as part of the $2,000 deliverable

## Tool 5: Automated Achievement Action Plan Generator

Script that takes member data and generates personalized Achievement Action Plans using the Five Forces Framework.

- **Data sources:** Airtable member record, post-call form submissions, blueprint data
- **Intelligence:** Claude generates custom action plans
- **Output:** Structured plan pushed to Notion portal
- **Timing:** After 1:1 Strategy Call, updated quarterly

## Tool 6: At-Risk Detection System

Daily/weekly script monitoring member engagement and flagging at-risk members.

- **Data sources:** Airtable Engagement Tracker (Zoom attendance, community activity, report opens)
- **Triggers:** Missed 2+ calls in a row, no community activity in 14 days, report not opened, team NLS inactive
- **Output:** At-risk flag in Airtable. Notification to team via Quo or Slack.

## Tool 7: Zoom Attendance Tracker

Post-call automation that pulls Zoom attendance and cross-references with active members.

- **Data sources:** Zoom API attendance reports
- **Output:** Attendance data to Airtable. Quo text to members who missed: "Hey [name], missed you on today's call. Here's the replay: [link]"
- **Timing:** Runs after each coaching call ends

## Priority Build Order

1. Airtable base setup with all tables and fields
2. Apify scraper integration (Instagram, website, GBP, Facebook, competitors)
3. Claude API integration with all framework prompts
4. Salon Visibility Analyzer (onboarding Visibility Blueprint generation)
5. Notion portal creation and API integration
6. On-site SEO fixer (part of onboarding pipeline)
7. Billing-synced daily report scheduler
8. Monthly Visibility Report generation with month-over-month comparison
9. NPS tool (form, QR code, report generation)
10. Zoom attendance tracker with Quo texting for missed calls
11. At-risk detection system
12. Achievement Action Plan generator
13. Inner Circle marketing strategy generator
14. Admin dashboards for all tools
