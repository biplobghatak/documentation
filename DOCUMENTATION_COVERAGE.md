# Documentation Coverage Report

Generated for the **Spyro** app (`C:\Users\kullu\Downloads\Spyro-App`) → Mintlify docs
(`C:\Users\kullu\Downloads\Spyro-Doc`). Every page was reverse-engineered directly from the
source code, with claims cited to real `path:line` references and code snippets copied verbatim.

## Summary

| Metric | Count |
|---|---|
| **Total pages generated** | **40** `.mdx` pages |
| Navigation entries | 40 (1:1 with files — no orphans, no missing files) |
| Architecture / flow diagrams (Mermaid) | **33** diagrams across 26 pages |
| Internal links | All resolve (0 broken) |
| Pages missing frontmatter | 0 |
| API endpoints documented | ~46 (4 public `/api/v1` + ~42 internal `app/api/*`) |
| Database tables documented | 52 (all tables in `lib/db/schema.ts`) |
| Background jobs documented | 41 Inngest functions (15 cron / 25 event / 1 dual) |
| Free tools documented | 5 (no-auth public tools) |
| Env vars documented | ~70 (from `.env.local.example`, names + purpose only) |

## Page inventory

```
introduction.mdx
getting-started/  installation · project-structure · architecture · environment
frontend/         overview · routing · components · ui-system · state-management · forms · performance · marketing-site
backend/          overview · apis · public-api · database · authentication · authorization · middleware ·
                  services · ai · seo-engine · geo-engine · crawler · audit · content-engine ·
                  background-jobs · billing · integrations · free-tools · pdf-engine · security · logging
deployment/       vercel · environment · production
reference/        environment-variables · folder-reference · glossary
```

## Modules documented

The full `lib/*` service layer is mapped in `backend/services.mdx`, with deep dives where warranted:

- **Data & auth:** `lib/db` (schema, RLS, service-role connection) → `backend/database`; `lib/supabase`,
  `lib/auth-guard`, `lib/admin`, `proxy.ts` → `backend/authentication` / `authorization` / `middleware`.
- **AI:** `lib/llm` (provider abstraction), `lib/engines` (citation-target engines), `lib/agent`,
  `lib/citations`, `lib/embed`, `lib/vector`, `lib/rerank` → `backend/ai`.
- **SEO/GEO:** `lib/seo`, `lib/serp`, `lib/dataforseo`, `lib/keyword-data`, `lib/geo` → `backend/seo-engine`
  / `geo-engine`.
- **Crawl & audit:** `lib/crawler`, `lib/site-intel`, `lib/discovery`, `lib/url`, `lib/audit`,
  `lib/seo/cwv` → `backend/crawler` / `audit`.
- **Content:** `lib/writer`, `lib/publish`, `lib/research`, `lib/seo/content-plan`, `lib/images` →
  `backend/content-engine`.
- **Jobs:** `lib/inngest` (client + 41 functions), `lib/scheduling` → `backend/background-jobs`.
- **Commerce:** `lib/dodo`, `lib/billing`, `lib/plans`, `lib/usage`, `lib/profile` → `backend/billing`.
- **Integrations:** `lib/ga4`, `lib/gsc`, `lib/wordpress`, `lib/email`, `lib/calendar`, `lib/api/signing`
  → `backend/integrations`.
- **Free tools:** `lib/free-tools/*` (5 tools + shared SSRF/rate-limit/PDF) → `backend/free-tools` /
  `pdf-engine`.
- **Cross-cutting:** `lib/rate-limit`, `lib/crypto`, `lib/posthog-server`, `lib/admin/cost` →
  `backend/security` / `logging`.

## Components & hooks documented

- **`backend`/frontend components:** `frontend/components.mdx` documents the `components/ui/*`
  design-system primitives (22 files; Base UI wrappers, Radix only for `tooltip`) and the major feature
  components (`AgentChat`, `ArticleEditor`, `CalendarBoard`, `AppShell`, `BusinessProfileSection`,
  contact form) with verbatim prop types.
- **Hooks:** Spyro colocates hooks rather than using a top-level `hooks/` dir. Documented in
  `frontend/state-management.mdx` (server actions, `useActionState`, RHF, URL state, the
  `use-backdrop-scroll-block` hook). No standalone `hooks/`, `providers/`, or `contexts/` directories
  exist in the repo — noted rather than invented.

## Architecture diagrams created (33 Mermaid diagrams)

Overall system architecture, request lifecycle, background-job/enqueue-and-poll flow, multi-tenancy ER,
route-group tree, login sequence, permission model, middleware flow, citation-check sequence, crawler
pipeline, audit flow, content-engine pipeline, Inngest event dispatch, Dodo billing sequence, GA4/GSC
OAuth flow, WordPress headless-blog data flow, free-tool flow, PDF generate→download (×2), and database ER —
among others, distributed across the relevant pages.

## Key code-vs-documentation contradictions resolved (code always wins)

The in-repo `README.md` / `*-EXPLAINED.txt` are partly stale; every writer verified against code:

1. **Billing is Dodo Payments, not Polar.** `DODO_*` env (`lib/env.ts:93-107`), webhook
   `app/api/webhooks/dodo`, migration `0022_dodo_payments`. Only legacy nullable `polarCustomerId` /
   `polarSubscriptionId` columns remain on `organizations` (`schema.ts:86-87`); no `POLAR_*` vars exist.
2. **LLMs are OpenRouter-first, not "Gemini only."** Internal `getLLM()` order is OpenRouter → OpenAI →
   Gemini; the chat agent is OpenRouter → Moonshot → OpenAI; citation engines use OpenRouter; embeddings
   use OpenAI (`text-embedding-3-small` in code, despite `.env.local.example` saying `-large`).
3. **Pricing:** `lib/plans.ts` defines plans `pro | agency` at **$99/site/mo** (Agency = Pro × N sites,
   3–20, with 10/15/20% volume discounts) — not the README's $14/$39/$69. **No credit packs exist**; the
   quota model is `blogsPerMonth: 30` + `aiCreditsPerMonth: 200`.
4. **Trial = 3 days / 3 blogs** (`TRIAL_DAYS=3`), not 7 days.
5. **RLS is membership-driven** (org/workspace membership via `has_workspace_access`), spanning two files
   (`drizzle/rls.sql` + `drizzle/rls_site_chunks.sql`); there are **no database-level foreign keys** —
   relationships are logical, scoped by `user_id` / `workspace_id` / `org_id`.
6. **Middleware file is `proxy.ts`** (Next.js 16 naming), not `middleware.ts`.
7. **CWV uses field data via CrUX/PSI**; the in-process Lighthouse runner was removed (`lighthouse` is a
   vestigial unused dependency). The `crawlSite` page-fetch loop uses a hand-rolled worker pool (though
   `p-limit` *is* a project dependency, `package.json:76`, used elsewhere).
8. **PostHog is wired but dormant** — `/ingest` proxy + identify/reset are live, but there is no
   `posthog.init()` and no `posthog.capture()` calls.
9. **The free-tool `subscribe` route does send email** (MailerLite + team notice), contradicting its own
   "store-only" docstring.
10. **No custom security headers** (`next.config.ts` has no `headers()`, `vercel.json` is empty): no CSP /
    HSTS / X-Frame-Options, no CORS config, no DOMPurify, no Sentry, no `/api/health`. Documented honestly
    in `backend/security.mdx` under "what is NOT implemented."

## Verification status

- **Structural validation — PASSED (scripted).** A Node validator confirmed: 40/40 nav↔file parity (no
  orphans, no dangling nav entries), **0 broken internal links**, **0 pages missing a frontmatter title**,
  and 33 Mermaid blocks. An MDX-safety scan found no stray HTML entities and no unescaped `{…}`/`<…>` in
  prose (all such tokens are inside code fences or inline code).
- **Per-writer self-verification — DONE.** Each of the 8 section writers read its own source and
  cross-checked load-bearing claims; several caught and corrected their own drafts (e.g. Base UI vs Radix,
  the real LLM provider order, the no-credit-packs billing model, `proxy.ts` not handling impersonation
  cookies).
- **Independent adversarial pass — COMPLETED.** Four independent fact-checker agents re-verified all 40
  pages against source, writing findings to durable files. Verdict: **no invented features, no broken
  citations, no stale-README leaks** — the docs are highly accurate. The agents flagged **11 precise
  errors/imprecisions, all now fixed:**
  1. `billing.mdx` — cited a non-existent migration `0020_drop_growth.sql`; the `growth → pro` migration is
     `0022_dodo_payments.sql:11` (doc had copied a stale comment in `lib/plans.ts:16`). **Fixed.**
  2. `public-api.mdx` — a "verbatim" `generateApiKey()` snippet had two added inline comments not in
     source (`lib/api/keys.ts:21-22`). **Fixed** (now verbatim).
  3. `authentication.mdx` — a snippet silently dropped `lib/actions/auth.ts:71` (`if (error) return …`).
     **Fixed** (line restored).
  4. `apis.mdx` — the Dodo webhook table implied a cancellation email for `cancelled`/`failed`/`expired`;
     it fires for `subscription.cancelled` only (`webhooks/dodo/route.ts:124-126`). **Fixed.**
  5. `crawler.mdx` — claimed "no `p-limit` dependency"; `p-limit` **is** a dependency
     (`package.json:76`). **Fixed.**
  6. `crawler.mdx` — the broken-link sweep was described as "concurrency 8"; it is an **unbounded**
     `Promise.all` (`index.ts:667-674`). **Fixed.**
  7. `crawler.mdx` — `mapWithLimit` was misattributed to that sweep; it belongs to the onboarding
     `checkLinkStatuses` path (`index.ts:746`). **Fixed.**
  8. `audit.mdx` — listed the wrong bot set for `botAccessFromRobots`; it iterates the 7-entry
     `BOT_ACCESS_TARGETS` (`robots.ts:83-91`), not the 8-entry `AI_BOTS`. **Fixed.**
  9. `services.mdx` — a `<Note>` claimed six modules fall back to "a deterministic mock"; only
     `lib/site-intel` does (`llm`/`serp`/`images` throw, `publish` is a static registry, `vector` returns
     one store). **Fixed.**
  10. `production.mdx` — claimed PostHog does "event capture"; it is wired but dormant (no
      `posthog.capture()`). **Fixed.**
  11. Five pages used `npm run …` while `installation.mdx` mandates pnpm (the repo is pnpm-only). Normalized
      to `pnpm …` across `deployment/*`, `reference/*`, and `backend/database`. **Fixed.**
- **Re-validated:** the structural script was re-run after all fixes — still 40/40 nav↔file parity, 0 broken
  links, 0 missing frontmatter.

## Notes & decisions

- **Legacy marketing docs preserved, not deleted.** The pre-existing end-user marketing pages
  (`introduction` original, `quickstart`, `concepts/*`, `features/*`, `account/*`, `help/*`,
  `integrations/*`, `index`, `account-setup`) were a different audience and contained inaccuracies
  (e.g. Copilot, Shopify/Webflow, 3-day-trial-no-card). They were moved to `legacy-marketing/` and added to
  `.mintignore` (kept for reference, excluded from the build) rather than removed. The new developer docs
  fully supersede them.
- **Screenshots were intentionally omitted.** Capturing them requires running the full authenticated,
  multi-tenant app with live third-party keys — out of scope for a source-derived pass, and the prompt
  scoped them as "if applicable."
- **No placeholders or TODOs** were left in any generated page.
