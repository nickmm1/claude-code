# Project Structure

```
salon-strategy-engine/
  config/
    frameworks.txt                    # Complete Five Forces + SPARC + 7 Demand Channels
    profit_blueprint_prompt.txt       # Claude prompt for Profit First Blueprint
    visibility_blueprint_prompt.txt   # Claude prompt for Visibility Blueprint
    monthly_profit_prompt.txt         # Claude prompt for Monthly Profit Report
    monthly_visibility_prompt.txt     # Claude prompt for Monthly Visibility Report
    nps_report_prompt.txt            # Claude prompt for NPS Client Experience Report
    marketing_strategy_prompt.txt     # Claude prompt for Inner Circle Marketing Strategy
    action_plan_prompt.txt           # Claude prompt for Achievement Action Plans
    seo_fix_prompt.txt               # Claude prompt for on-site SEO fixes
    api_keys.env                     # All API keys (NEVER commit to version control)
  scripts/
    apify_scraper.py                 # Apify API integration for all scraping
    search_atlas_pull.py             # Search Atlas API (Inner Circle only)
    ai_accountant_pull.py            # AI Accountant data integration
    claude_generator.py              # Claude API calls for all report generation
    notion_pusher.py                 # Notion API for portal pages
    airtable_manager.py              # Airtable API for all database operations
    zoom_attendance.py               # Zoom API for attendance tracking
    quo_messenger.py                 # Quo API for text messages
    qr_generator.py                  # QR code generation for NPS forms
    seo_fixer.py                     # On-site SEO analysis and fix generation
  workflows/
    onboard_new_member.py            # Full onboarding pipeline
    generate_daily_reports.py        # Daily billing-synced report generation
    detect_at_risk.py                # At-risk member detection
    pipeline_intake.py               # Typeform submission processing
    post_call_attendance.py          # Post-call attendance tracking + Quo texting
    generate_action_plan.py          # Achievement Action Plan generation
    monthly_inner_circle.py          # Inner Circle marketing strategy generation
  apps/
    visibility-analyzer/             # Salon Visibility Analyzer web app
      frontend/                      # React + TypeScript + Tailwind
      backend/                       # Python FastAPI
    nps-tool/                        # NPS Client Experience web app
      frontend/
      backend/
  data/
    members/                         # Per-member data storage
    reports/                         # Generated report storage
  tests/
    test_apify.py
    test_claude.py
    test_airtable.py
    test_notion.py
  CLAUDE.md                          # This file
  README.md                          # Project documentation
  requirements.txt                   # Python dependencies
  .env.example                       # Template for environment variables
  .gitignore                         # Excludes api_keys.env, .env, data/
```

## Testing Protocol

- Test every tool with real salon data before deploying
- Use 5-10 existing members as beta testers for new features
- Always review Claude-generated reports for quality before delivering to members
- Iterate on prompts until output is 10/10
- Store all raw data so reports can be regenerated if prompts improve
- Compare Claude-generated reports against what Nick would actually say on a coaching call. If it does not match, refine the prompt.
