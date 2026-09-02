# Spyro Application Feature, Pricing & Credit Audit

**Audit date:** 2026-09-01
**Source:** C:\Users\kullu\Downloads\Spyro-App (read-only inspection)
**Documentation target:** C:\Users\kullu\Downloads\spyro-mintlify-docs

---

## 1. Executive Summary

This audit compares the actual Spyro application implementation against the Mintlify documentation. The application is an SEO + AI-visibility (GEO/AEO) SaaS built with Next.js 16, Drizzle ORM, Supabase PostgreSQL, Inngest background jobs, and Dodo Payments. It uses a **unified org-level credit pool** model.

### Key discrepancies found:
- **Shopify** is documented as "coming soon" but is fully implemented and available
- **Google Analytics 4** is documented as "coming soon" but is fully implemented and available
- **WordPress.com** is documented as available but is NOT shown in the frontend integrations list
- Several credit-consuming actions are missing from documentation (site intel, LLM mentions scan, SERP lookup, workspace creation)
- Prompt cadence options (daily/weekly) not documented
- Rank tracker daily frequency option not documented
- Credit costs table is incomplete in billing and FAQ pages

---

## 2. Current Product Terminology

| Term | Definition |
|---|---|
| **Workspace** | One website/domain. Everything (audits, rankings, content, settings) belongs to a workspace. |
| **Organization (Org)** | The billing/tenancy root. Owns the credit pool and subscription. Contains one or more workspaces. |
| **Credits** | The unified currency for paid actions. Org-level pool shared across all workspaces. |
| **Tracking prompts** | Buyer questions asked of AI assistants to measure citation frequency. |
| **Citations** | When an AI engine's answer references/links to a URL or domain. |
| **Mentions** | Every AI response (whether or not it cited the user's site). |
| **Share of voice** | The user's slice of all AI mentions, relative to competitors. |
| **AI visibility** | The overall feature showing how often AI assistants mention the user's brand. |
| **Competitor scan** | A structured keyword gap analysis comparing the user's domain against competitor domains. |
| **Site intel** | Off-domain intelligence: backlinks, domain authority, ranked keywords for a domain. |
| **Rank tracker** | Google position monitoring for chosen keywords. |
| **Content calendar** | Monthly blog planning with AI-generated topic suggestions. |
| **AI agent** | Chat assistant that performs SEO/GEO actions using tools. |
| **Blog/Article** | AI-generated SEO-ready content piece. |

---

## 3. Pricing

### Plans (source: `lib/plans.ts`)

| Plan | Monthly | Annual | Credits/mo | Workspaces | Tracked Prompts | Tracked Keywords | Integrations | Team Members |
|---|---|---|---|---|---|---|---|---|
| **Pro** | $99 | $990 | 15,000 | up to 10 | 50 per workspace | 500 per workspace | 5 per workspace | Unlimited |
| **Agency** | $399 | $3,990 | 80,000 | Unlimited | 250 per workspace | 500 per workspace | 5 per workspace | Unlimited |
| **Custom** | Contact sales | Contact sales | Tailored | Tailored | Tailored | Tailored | Tailored | Tailored |

- Annual pricing: exactly 10 months' worth ($990 and $3,990), marketed as "2 months free"
- Both plans include all 5 citation engines (AI Overview, Gemini, ChatGPT, Perplexity, Claude)
- Both plans: weekly rank check frequency by default; daily available as option
- Legacy "growth" plan is gone; `normalizePlan()` maps any legacy "growth" → "pro"

### Trial

| Aspect | Value |
|---|---|
| Duration | 3 days (Dodo-managed, card on file) |
| Credits | 500 |
| Blog hard cap | 3 articles total |
| Subscription required | Yes (card on file, $0 charged until trial ends) |
| Post-trial | Unused trial credits cleared; full plan credits apply |

Source: `lib/plans.ts:117,226-229`, `lib/profile.ts:46`

---

## 4. Credit Model

### Architecture
- **Single org-level credit pool** (`credits:<orgId>` usage counter)
- Shared across ALL workspaces in the organization
- Resets monthly on billing date
- Pre-check before spend; blocked if insufficient
- Post-charge low-credits warning at 80% usage (email, once per window)
- Out-of-credits email when pool is exhausted (once per window)

### Credit Costs (source: `lib/plans.ts:55-82`)

| Action | Credits | Notes |
|---|---|---|
| Blog article | 150 | Per generated article. Priced below measured COGS. |
| AI response (agent/audit chat) | 5 | Flat per agent chat turn AND audit "Ask Spyro" answer |
| Keyword research search | 10 | Per search. Priced below measured cost. |
| Citation check | 10 | Standard price per prompt × engine check |
| Rank check | 2 | Per tracked keyword per rank check |
| SERP lookup | 13 | Per on-demand SERP analysis lookup |
| Keyword analysis | 20 | Per keyword-analysis view (first view; re-opens within TTL free) |
| Competitor scan | 150 | Per competitor domain in one scan |
| Site intel run | 30 | Per weekly site-intel snapshot |
| LLM mentions scan | 70 | Per tracked competitor, monthly. Floors at 1 unit. |
| Workspace creation | 300 | Per additional workspace. First workspace is free. |

### Citation Engine Costs (source: `lib/plans.ts:88-94`)

| Engine | Credits |
|---|---|
| Google AI Overviews | 10 |
| Gemini | 10 |
| ChatGPT | 10 |
| Perplexity | 10 |
| Claude | 20 |

### Key behaviors:
- Site audits are **FREE** (no credits charged)
- Failed competitor scans are **NOT charged**
- Keyword analysis first view charges 20; re-opens within TTL are free
- Credits are attributed per acting user; org total is sum over all members
- Trial usage is wiped when trial → paid transition occurs

---

## 5. Limits

### Workspace/Website Model
- One workspace = one website/domain (1:1 relationship)
- Pro: up to 10 workspaces
- Agency: unlimited workspaces
- First workspace is free; each additional costs 300 credits

### Competitor Limits
- Up to 10 competitors can be added to the workspace competitor list
- Up to 5 competitors per individual competitor research scan (MAX_COMPETITORS = 5). Users can return and run additional scans with up to 5 competitor domains each time.
- Up to 2,000 keyword rows stored per scan
- Up to 6 topic clusters shown per scan

### Keyword Limits
- Pro: up to 500 tracked keywords per workspace
- Agency: up to 500 tracked keywords per workspace
- Auto-tracking: one keyword auto-added per published article

### Prompt Limits
- Pro: up to 50 tracked prompts per workspace
- Agency: up to 250 tracked prompts per workspace
- Cadence options: daily or weekly

### Integration Limits
- Both plans: up to 5 connected integrations per workspace

### Article Limits
- No hard per-month article count limit for paid plans
- Gated by credit pool (150 credits per article)
- Trial: 3 articles total (hard cap)

### Team Members
- Both plans: unlimited team members

---

## 6. Feature Inventory

### 6.1 Authentication / Onboarding
- Email/password signup with email verification code
- Google OAuth sign-in
- Cloudflare Turnstile bot protection
- 8-step onboarding wizard: business profile, audience, blog setup, article style, image generation, competitors, discover prompts, find us
- Auto-detection of brand name, color, logo, language, audience, competitors
- Background crawl + site analysis during onboarding

### 6.2 Dashboard
- Org-level home screen per workspace
- SEO health score, AI readiness score
- AI citation rate, domain rating
- Visibility trend chart
- AI engine citations per engine
- Google Search Console performance (if connected)
- Rank movers
- Recent AI mentions cards

### 6.3 Site Audit
- **FREE** (no credits)
- Weekly automatic audits (configurable)
- Manual re-run available
- SEO health score (0-100)
- AI readiness/GEO score (0-100)
- Per-page drill-down
- Issue fixed/unfixed toggling
- AI-generated fix suggestions ("Ask Spyro")
- History trend chart
- Manual URL checks (up to 10 URLs)
- PDF report download
- Core Web Vitals (sampled)
- Bot access analysis (robots.txt for AI crawlers)

### 6.4 AI Visibility
- Tracks 5 engines: Google AI Overviews, Gemini, ChatGPT, Perplexity, Claude
- Tracking prompts: buyer questions asked of AI engines
- Citation tracking per prompt × engine
- Citation cadence: daily or weekly per prompt
- Per-engine visibility strip
- Competitor ranking among AI mentions
- Share of voice over time
- Mention rate trend
- Sources analysis (cited URLs/domains, scored 0-100)
- 90-day citation window

### 6.5 AI Mentions
- Live feed of actual AI responses from last 30 days
- Mentioned/not-mentioned per response
- Sentiment classification (positive/neutral/negative) for mentions
- Full answer text with brand highlight
- Source links per response
- Monthly summary

### 6.6 Competitors
- Auto-discovered competitors (from SERP, DataForSEO, LLM)
- Manual add/remove (up to 10 per workspace)
- Shared keyword count per competitor
- Competitor list feeds AI visibility and rank tracker

### 6.7 Competitor Research
- Structured keyword gap analysis dashboard
- Scan parameters: location, language, position depth (10/20/50/100), min volume, max difficulty, subdomains
- 1-5 competitor domains per scan
- 150 credits per competitor
- Overview: domain rank, organic keywords, top-10 keywords, estimated traffic, AI verdict, topic-gap clusters
- Content gaps: gaps, shared, quick wins buckets
- Topic clusters (AI-generated, min 8 gap keywords, max 6 clusters)
- Competitor profiles
- AI Analysis tab (synthesis)
- Write article, track keyword, export CSV actions
- Up to 2,000 keyword rows per scan

### 6.8 Keyword Research
- Seed topic → up to 60-80 keyword ideas
- Volume, CPC, competition, difficulty (KD), intent, cluster labels
- Country/language targeting
- Intent classification: informational, commercial, transactional, navigational
- Auto-clustering by topic
- 10 credits per search

### 6.9 Keyword Analysis
- Deep-dive on a single keyword
- Metrics: volume, CPC, competition, KD, trend
- SERP: top 10 organic results, SERP features, AI Overview, People Also Ask
- Related keywords (up to 50 rows from DataForSEO)
- Similar keywords (from workspace's own research, free)
- 20 credits per first view; re-opens within TTL free

### 6.10 Rank Tracking
- Tracks Google positions for chosen keywords
- Each keyword: keyword, location, device, cadence (daily/weekly)
- First position appears automatically after SERP check
- History per monitor (keyword + location + device)
- Auto-tracking on article publication (smart keyword selection)
- 500 keywords per workspace
- 2 credits per rank check

### 6.11 Content / Article Generation
- AI writer: research → outline → write → quality checks → SEO scoring → images
- Default target: 2,500 words
- GEO mode (answer-first/FAQ schema)
- Internal linking, tone derivation
- Image pipeline (featured + in-article)
- Auto-publish option
- 150 credits per article
- Editor: TipTap-based rich text editor
- SEO score panel
- PDF download

### 6.12 Content Calendar
- Monthly grid view of scheduled blog posts
- AI-generated topic suggestions
- "Plan with Spyro" chat panel
- Drag-and-drop scheduling
- Status: scheduled → writing → done
- Credit-gated (shows remaining credits)
- Content plan: 30-day idea generation based on business profile, pillars, content focus, publishing pace

### 6.13 AI Agent (Spyro AI Agent)
- Chat assistant with tools
- Tools: discoverKeywords, findQuestions, findGems, auditPage, findCompetitors, getCompetitorKeywords, validateNiche
- Additional capabilities: citation gap analysis, discovered AI prompts, share of voice, workspace snapshot
- Context-aware: workspace snapshot, GSC data, tracked prompts, recent posts, seed keywords, top issues
- 5 credits per chat turn
- Conversation history, feedback (thumbs up/down)
- Suggested prompts based on workspace

### 6.14 Integrations
**Publishing:**
- WordPress.org (self-hosted) via Application Passwords — available
- Shopify via OAuth — **available** (not "coming soon")
- Webhooks — available
- Wix — coming soon
- Framer — coming soon
- WordPress.com — backend implemented but NOT shown in frontend PROVIDERS list

**Data:**
- Google Search Console — OAuth read-only
- Google Analytics 4 — OAuth read-only — **available** (not "coming soon")

**Other:**
- API keys (workspace-level, up to 3 per workspace)
- Auto-publish toggle

### 6.15 Google Search Console
- OAuth read-only connection
- Import: impressions, clicks, CTR, position
- AI surface data
- Opportunity detection: almost-ranking, low CTR, content decay
- Fix plans per suggestion
- Dashboard integration

### 6.16 Google Analytics 4
- OAuth read-only connection
- AI referral traffic tracking
- Property picker
- Traffic data import
- Fully implemented (not "coming soon")

### 6.17 Site Intel
- Off-domain intelligence: backlinks, domain authority, ranked keywords, SERP competitors
- Weekly automatic snapshots
- 30 credits per snapshot
- Used for competitor analysis and content planning

### 6.18 LLM Mentions Scan
- Monthly scan of DataForSEO's ~287M real AI responses
- Discovers prompts where the workspace's domain/brand is cited
- Niche search (keyword-anchored) + brand search (domain-anchored)
- 70 credits per tracked competitor (minimum 1 unit)
- Aggregated mentions + AI search volume, per-platform breakdown

### 6.19 Onboarding
- 8-step wizard
- Business profile, audience, blog setup, article style, image generation, competitors, discover prompts, find us
- Auto-detection from website
- Background crawl + analysis
- GSC/GA4 connection offered
- Competitor scoring with LLM explanations

### 6.20 Workspace Settings
- General: workspace name, time zone, re-crawl
- Audience: segments, business description
- Competitors: add/remove
- Crawled pages: list with SEO/GEO scores, add up to 10 URLs
- API keys: create/remove (up to 3)
- Image generation settings
- Article defaults
- Blog settings
- Integrations

### 6.21 Team Members
- Invite by email with role (owner/admin/member)
- Org-level roles: owner, admin, manager, member
- Workspace-level roles: admin, member
- Unlimited team members on both plans
- Invite expiry: 14 days

### 6.22 Billing
- Dodo Payments (Merchant of Record)
- Checkout, customer portal, plan changes
- Org-level billing (not per-workspace)
- Owner/admin only can change plan/billing
- Three billing states: active, lapsed, never
- Lapsed = read-only in-app access

---

## 7. Error / Empty / Insufficient-Credit Behavior

- **Insufficient credits**: Pre-check blocks the action; message shows credits needed vs. remaining
- **Out of credits**: Email sent once per quota window; paid actions blocked until reset or upgrade
- **Low credits warning**: Email at 80% pool usage, once per window
- **Failed competitor scan**: No credits charged
- **Keyword analysis re-open**: Free within TTL (no double charge)
- **Trial exhaustion**: Blog hard cap at 3; paid actions blocked
- **Lapsed subscription**: Read-only access; spend actions blocked with message "Your subscription is inactive. Reactivate your plan to run this."

---

## 8. Outdated Documentation Claims Discovered

| Document | Claim | Actual |
|---|---|---|
| `product/integrations.mdx` | "Shopify is on the way and shows as coming soon" | Shopify is fully implemented and available |
| `product/integrations.mdx` | "Google Analytics support is coming soon" | GA4 is fully implemented and available |
| `product/integrations.mdx` | Lists "WordPress.com" as available | WordPress.com NOT in frontend PROVIDERS list |
| `product/faq.mdx` | "Shopify is coming soon" | Shopify is available |
| `product/faq.mdx` | "Google Analytics (GA4) support is coming soon" | GA4 is available |
| `product/billing-and-usage.mdx` | Credit costs table missing LLM mentions scan | These are real credit-consuming actions |
| `product/faq.mdx` | Credit costs list incomplete | Missing several actions |
| `product/billing-and-usage.mdx` | "What you also get" incomplete | Missing tracked prompts, cadence options, daily rank checks |
| `product/prompts.mdx` | Only mentions weekly cadence | Daily cadence is also available |
| `product/rank-tracker.mdx` | Only mentions weekly re-checks | Daily frequency is available |
| `product/overview.mdx` | Missing mention of AI agent feature | AI agent is a major feature |

---

## 9. Documentation Changes Required

### High priority (factual errors) — ALL FIXED:
1. `product/integrations.mdx`: Remove "Shopify coming soon" — Shopify is available ✅
2. `product/integrations.mdx`: Update "Google Analytics coming soon" — GA4 is available ✅
3. `product/faq.mdx`: Remove "Shopify coming soon" and "GA4 coming soon" claims ✅
4. `backend/billing.mdx`: Remove stale white-label reference ✅
5. `backend/authorization.mdx`: Remove stale white-label and pricing references ✅

### Medium priority (incomplete information) — ALL FIXED:
6. `product/billing-and-usage.mdx`: Add missing credit costs ✅
7. `product/billing-and-usage.mdx`: Add workspace creation cost ✅
8. `product/faq.mdx`: Update "What uses credits?" answer with complete list ✅
9. `product/prompts.mdx`: Document daily cadence option ✅
10. `product/rank-tracker.mdx`: Document daily frequency option ✅
11. `product/billing-and-usage.mdx`: Complete "What you also get" section ✅

### Lower priority (enhancements) — ALL FIXED:
12. `product/overview.mdx`: Add AI agent to feature cards ✅
13. `product/integrations.mdx`: Remove WordPress.com, add Shopify ✅
14. `backend/billing.mdx`: Update stale limits table and remove white-label ✅
15. `backend/authorization.mdx`: Update stale pricing table and remove white-label ✅

---

## 10. Items That Could Not Be Verified — ALL RESOLVED

1. **WordPress.com integration** — VERIFIED: NOT user-facing. Not in PROVIDERS array, no OAuth flow, no feature flag.
2. **Notion integration** — VERIFIED: NOT user-facing in main integrations UI. Backend exists but no UI connect path.
3. **White-labeling in Agency plan** — VERIFIED: NOT implemented. Deliberately removed.
4. **Article image count** — VERIFIED: Hardcoded (2 in-content on Inngest, 3 inline). Not configurable.
5. **Daily rank checking** — VERIFIED: Fully supported with UI toggle and dedicated cron.
6. **Competitor workspace limit (10)** — VERIFIED: Enforced at UI level, not at server action level.
