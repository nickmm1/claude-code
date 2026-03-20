# Coaching Schedule and Sales Process

## Coaching Call Schedule (For Zoom Integration)

- **Monday 1:00 PM ET:** Strategy Call (Five Forces topic of the week). All members.
- **Monday 3:00 PM ET:** Fundamentals (New member onboarding). Members in first 10 weeks.
- **Tuesday 1:00 PM ET:** Hot Seat Call. All members. 3 hot seats, 15 minutes each.
- **Tuesday 3:00 PM ET:** Tech Workshop. Once per month, rotating topics (Shopify, SEO, booking software, AI tools, website optimization, social media systems).
- **Wednesday 1:00 PM ET:** Implementation Workshop. All members. Guided implementation of the week's concept.

After each call, the Zoom attendance tracker runs automatically.

## The Coaching Call Structure

**Monday Strategy Call (The Big Idea):** 45 minutes.
- 5 min: Member win from last week (celebration)
- 5 min: Story connected to the topic (emotional hook)
- 15 min: Teach one concept deep (using SPARC method)
- 5 min: Assignment for the week (one action, specific, measurable, under 30 min)
- 15 min: Topic-specific Q&A
- End with open loop teasing next week's topic

**Monday Fundamentals (New Members):** 45 minutes.
- 10 min: Welcome new members by name, introductions
- 15 min: Walk through program structure and resources
- 15 min: One Phase 1 fundamental they can use immediately
- 5 min: Assign each new member a buddy (someone 2-3 months ahead)

**Tuesday Hot Seat (The Mirror):** 45 minutes.
- 3 hot seats, 15 minutes each
- Hot seat 1: Related to Monday's topic
- Hot seat 2: Different angle on same topic
- Hot seat 3: Open topic
- Each ends with public commitment: "What are you doing by Wednesday?"

**Wednesday Implementation (The Workshop):** 45 minutes.
- 5 min: Recap Monday's concept, check who did the assignment
- 30 min: Guided implementation. Members do the work live on the call.
- 10 min: Share results, wins, discoveries
- First Wednesday each month at 3 PM: Shopify deep-dive replaces regular workshop

## Billing-Synced Report Delivery System

Reports are NOT delivered on a fixed date. Each member's reports generate and deliver relative to their individual billing date.

**Daily Automation Script (runs 6:00 AM ET every day):**

1. Query Airtable for all members where Status = "Active"
2. For each member, read their Billing Date
3. If today = Billing Date minus 7 days, add to today's report queue
4. For each member in the queue:
   - Run Apify scrapers (Instagram, website, GBP, competitors)
   - Pull AI Accountant data
   - Pull NPS form responses for the month
   - Pull previous month's data from Airtable for comparison
   - Call Claude API three times: Monthly Profit Report, Monthly Visibility Report, Monthly NPS Report
   - Push all three reports to their Notion portal
   - Update Airtable Reports table
   - Update member record (Last Report Generated, Report Delivery Status)
5. Notify team: "X reports generated today. Ready for review."
6. Team reviews and approves
7. On approval, send Quo text: "Hey [name], your monthly reports just dropped. Check your portal: [link]"
8. Update Airtable: Report Delivery Status = "Delivered"

## Member Communication Rules

- Primary channel: Quo (text messages). This is how Nick communicates with members.
- Email is secondary. Used ONLY for login credentials and Notion portal links.
- All automated messages should sound like they are from Nick's team, not a bot.
- Never use em dashes in any automated message.
- Keep texts short. 2-3 sentences max.
- Always include a link when referencing reports or the portal.
- Personalize with member name and salon name when possible.

### Standard Quo Messages

**Welcome (within 1 hour of payment):**
"Hey [name], it's Nick. Welcome to The Level Up Academy. You made the right call. Check your email for next steps."

**Reports Ready (after team approval):**
"Hey [name], your monthly reports just dropped. Your Visibility Score this month is [score]/100. Check your portal: [link]"

**Missed Call (after each coaching call):**
"Hey [name], missed you on today's call. Here's the replay so you don't fall behind: [link]. See you next time."

**First Report (onboarding):**
"Hey [name], your Visibility Blueprint, Profit First Blueprint, and Marketing Report are ready. This is your starting point. We build from here. Check your portal: [link]"

## Sales Process (Text-First)

There are no formal sales calls. The process is text-based through Quo with optional phone calls.

1. Prospect fills out 6-question Typeform (from Facebook ads or organic)
2. Typeform creates Airtable Pipeline record
3. Team texts via Quo within 1 hour: "Hey [name], just saw your application. Love what you're building at [salon name]. What made you fill this out today?"
4. Prospect responds with their pain
5. Team shows value: "Most owners in your situation find $5K-$10K in hidden profit in the first 60 days. We looked at your website and there are some quick wins already."
6. Team states price IN THE TEXT before any call: "The investment is $2,000 to get started. That covers your first month, a full profit audit, a visibility blueprint, and we fix your website SEO during onboarding. Most agencies charge $5K just for that."
7. If they want to talk after seeing the price, they get on a call with Nick. These people are pre-sold.
8. If they hesitate: "No pressure. I can send you some free resources." Move to nurture.

**Rule: Never get on a call with someone who does not know the price. The text conversation handles the price objection. The call handles the trust objection.**
