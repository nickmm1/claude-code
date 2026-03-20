# The AI Accountant - Project TODO

## Completed
- [x] Password gate (members-only access with shared password "levelup2024")
- [x] Branded landing/login page (navy #1b365d, gold #c5a572, white - Level Up Academy design)
- [x] Three-file upload interface (Sales Report, Commission Report, Bank Statement)
- [x] Salon info form (name, email, business model dropdown)
- [x] Backend /api/analyze endpoint with multer file handling
- [x] Claude Sonnet 4.6 integration for Profit First analysis
- [x] System prompt with Nick Mirabella / Level Up Academy identity
- [x] Knowledge base embedded in system prompt (Real Revenue formula, TAPs, 6-account system, Debt Destroyer)
- [x] Analysis results dashboard (Financial Dashboard, Profit First Allocations, Top 3 Bottlenecks, Next Steps)
- [x] Loading state with progress indicator during analysis
- [x] Error handling for bad files or API failures
- [x] Mobile-responsive layout
- [x] Airtable integration - "AI Accountant Reports" table created in Mirabella Coaching base
- [x] Airtable record saving (salon name, email, date, revenue, stage, bottleneck, full report)
- [x] Report rendering with formatted HTML output
- [x] Print / Save PDF button
- [x] New Analysis button to reset and start over
- [x] All 7 tests passing (auth, secrets, Airtable read/write)
- [x] End-to-end test confirmed working with sample salon data

## Pending / Future
- [ ] Email delivery of reports via Resend (currently saves to Airtable only)
- [ ] Custom access code management (currently hardcoded as "levelup2024")
- [ ] PDF file parsing improvement (currently reads PDFs as raw text - may need pdf-parse for better extraction)
- [ ] "The Ultimate Salon Calculator" web app (Lesson 2 centerpiece)
- [ ] Lesson 2 lesson plan for calculator class
- [ ] Color schemes for Forces 1, 2, 3, and 5 (to be added to skill document)

## In Progress
- [ ] Update access code from levelup2024 to levelup2026
- [ ] Expand upload UI to support multiple files per category (up to 3 Sales Reports, 3 Commission/Payroll Reports, 2 Bank Statements)
- [ ] Update backend to merge and label multiple files per category before sending to Claude
- [ ] Add backend GET /api/member-lookup?email= endpoint to fetch past records from Airtable
- [ ] Auto-populate salon name and business model when email is recognized
- [ ] Report history dashboard showing all past analyses for a given email
- [ ] View full past report from history dashboard
- [ ] Add linked record field in AI Accountant Reports pointing to PRIMARY CLIENT RECORD
- [ ] Build registration form (name, email, salon name, business model, phone)
- [ ] Backend POST /api/register endpoint - creates/updates Airtable record and sets localStorage session
- [ ] Backend GET /api/member-lookup?email= - returns member profile and past reports
- [ ] Update analyze endpoint to link new reports to PRIMARY CLIENT RECORD by email
- [ ] Multi-file upload UI (up to 3 sales reports, 3 commission reports, 2 bank statements)
- [ ] Report history dashboard showing past analyses with view full report option
- [ ] Auto-populate salon name and business model from saved member profile
- [ ] Update access code to levelup2026
- [ ] Make access code input type="text" (visible, not masked)
- [ ] Add client name selector on registration form - when email matches Airtable record, show dropdown to confirm/select their profile
- [ ] Fix token limit error - add smart file truncation so large PDFs/CSVs don't exceed Claude's 200k token limit
- [ ] Add separate Service Revenue and Retail Revenue upload slots
- [ ] Add manual override fields (service revenue, retail revenue, color costs, product costs, commissions, other expenses)
- [ ] Add retail markup analysis (100% markup target, color cost vs retail revenue)
- [ ] Add vendor-by-vendor expense breakdown section to report output
- [ ] Update backend prompt to handle new data categories
- [ ] Add "How to Use" help section / link on the upload page
- [ ] Simplify upload UI: two manual fields (service revenue, retail/product sales) + two file uploads (commission/payroll report, bank statement)
- [ ] Update backend analyze prompt: strict Profit First profitability analysis with vendor expense breakdown
- [ ] Remove all extra upload slots (service report, retail report, expense report) -- keep only commission + bank statement
- [ ] Fix Airtable field mapping bug - registration data saving to wrong fields in AI Accountant Reports
- [ ] Create new PRIMARY CLIENT RECORD for members not already in Airtable when they register
- [ ] Update AI knowledge base with Nick's Profit First for Hair Salons framework (Real Revenue, bucket percentages, coaching language from PDF)
- [ ] Add full Salon Financial Percentage Reference Guide to AI knowledge base (hourly model, back bar, retail %, booked %, rent, net profit, owner comp, OPEX)
- [ ] Correct commission benchmarks: W-2 max is 48% (not 55%), Revenue Share/1099 can go higher, update all red line flags
- [ ] Fix employer burden language: 10-18% range depending on state/country (not flat 15%)
- [ ] Fix retail margin vs markup language: use "50% gross margin" (not "100% markup") throughout
- [ ] Fix Debt Destroyer sequencing: enforce Stability stage + 90-day consistency requirement before opening account
- [ ] Keep 90% booked as red line threshold (confirmed correct)
- [ ] Add collapsible "How to Get Your Reports" help section on upload page (Vagaro, GlossGenius, Square, Mindbody, bank statements, AI data cleaning tip)

## Security Fixes (In Progress)
- [x] Move access code validation server-side (remove ACCESS_PASSWORD from frontend JS)
- [x] Add persistent session cookie so members stay logged in across page refreshes
- [x] Add per-email rate limiting on /api/analyze (one analysis per 10 minutes per email)

## Branding Update
- [x] Rename app from "The AI Accountant" to "Mirabella OS" across all UI and config

## Header Branding Fix
- [x] Restore "The AI Accountant" as header title, change subtitle to "Powered by Mirabella OS"

## Notion CRM Fix
- [x] Removed Notion save from analyze endpoint -- AI Accountant is Airtable-only (clean separation)
- [x] Notion CRM stays as coaching workspace, synced separately from Airtable

## Current Sprint
- [ ] Add monthly cash reserves dollar field to form and AI prompt
- [ ] Remove dead Notion dashboard link from results page
- [ ] Connect Client Intake database to Notion Client CRM via relation property
- [ ] Connect Weekly Check-Ins database to Notion Client CRM via relation property
- [ ] Connect Coaching Questions database to Notion Client CRM via relation property
- [ ] Connect Support Questions database to Notion Client CRM via relation property

## Hybrid Model (In Progress)
- [ ] Add Hybrid business model to dropdown (booth rental + W-2/Rev Share mix)
- [ ] Add conditional Hybrid split revenue fields (booth rental income vs. employee revenue)
- [ ] Update AI prompt to handle Hybrid model dual cost structure analysis

## Email Gate (Completed)
- [x] Replaced access code gate with email-based member verification
- [x] Server checks Airtable Primary Client Record (populated by Shopify webhook) for the entered email
- [x] Access granted if email found; session cookie issued (30-day)
- [x] Email and member name pre-filled into report form after successful gate verification
- [x] Support contact info shown on failed email lookup: support@nickmirabella.com / (908) 808-4849
- [x] Fail-open behavior if Airtable is unreachable (prevents lockouts during outages)
- [x] Evergreen -- no password to update; membership is managed automatically via Shopify purchase

## Profit First Education (In Progress)
- [x] Add Profit First Primer as Section 0 of every report (plain-English explanation personalized to business model)
- [x] Build standalone Glossary page at /glossary with all Profit First terms defined in plain language (17 terms with examples)
- [x] Add Glossary link to header nav and bottom of every report
- [ ] Add summary callout box at top of report showing Real Revenue, Stage, and Top Bottleneck at a glance
- [x] Improve report section spacing and visual hierarchy
