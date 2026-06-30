# Source: https://spyro.app/privacy

## 1\. Who we are

**Data controller:** Spyro. 
**Contact:** [support@spyro.app](mailto:support@spyro.app) 
**Jurisdiction:**India. We comply with India's Digital Personal Data Protection Act, 2023 (DPDPA) and, for users in those regions, the EU/UK General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA/CPRA).

## 2\. What we collect

- **Account data:** email address, hashed password (or magic-link token), display name, account creation date, last login.
- **Billing data:**we don't store card numbers. Dodo Payments (our Merchant of Record) collects and processes payment details and returns a customer ID, subscription ID, plan, billing interval and the country we're instructed to invoice - we store those.
- **Project data you give us:** the domains you add, keywords you research, prompts you track, sites you crawl, blog ideas, and the generated content and reports.
- **Crawl & API outputs:**public HTML and SEO metadata we fetch from your own sites (and from the public SERP) on your behalf. We do not crawl pages behind authentication unless you give us credentials, and we don't store full page bodies - only the structured findings.
- **Usage data:** feature events (which screens you opened, which jobs you ran), error/diagnostic logs, and aggregate counters used to enforce plan limits.
- **Technical data:** IP address (truncated after 30 days), browser type, device type, referring URL. We use this for security and fraud prevention only.

We do **not**collect special-category personal data (health, biometric, political views, etc.). Don't put any in a tracked prompt or audit report.

## 3\. Why we collect it (legal bases)

- **Performance of contract** - to actually run keyword lookups, audits, citation checks, the AI writer and the dashboard you signed up for.
- **Legitimate interest** - security, fraud prevention, abuse detection, debugging, and improving the Service.
- **Legal obligation** - tax/invoicing records (kept by Dodo Payments on our behalf as Merchant of Record).
- **Consent** - optional product-update emails. You can opt out from any email or from Settings → Account.

## 4\. Where your data lives (sub-processors)

We're a small company and deliberately use a limited set of well-known processors. Each one only sees the data it needs to do its job:

| Processor | Purpose | Location |
| --- | --- | --- |
| Supabase | Database, authentication, file storage | US / EU (multi-region) |
| Vercel | Web hosting, request edge | Global |
| Inngest | Background jobs (crawls, scheduled checks) | US |
| Dodo Payments | Payments & invoicing (Merchant of Record) | Global |
| Resend | Transactional & digest email | EU / US |
| OpenRouter | AI chat, blog writing, ideation, citation parsing | US |
| OpenAI / Perplexity / Gemini / Anthropic | Optional citation-target engines (only if enabled) | US |

Cross-border transfers (for example to the US or the EU) are covered by Standard Contractual Clauses or equivalent safeguards where the processor offers them. We do not sell or rent your data to third parties, and we do not use your private content to train third-party AI models.

## 5\. Cookies & tracking

We use a strictly-necessary cookie for authentication (your Supabase session). We do not run third-party advertising trackers. If we enable a privacy-respecting analytics tool in the future we'll list it in the sub-processor table above, request consent where required, and never link it to your email.

## 6\. How long we keep it

- **Active account:** as long as the account exists.
- **Cancelled account:** 30 days, then permanently deleted. You can request immediate deletion at any time.
- **Invoices & tax records:** retained by Dodo Payments for the period required by applicable tax and merchant regulations.
- **Diagnostic logs:** 30 days.

## 7\. Your rights

You can: access your data, get a copy in a portable format (CSV/JSON), correct it, delete it, restrict or object to certain processing, and withdraw consent for optional emails. Most of these are one-click in Settings → Account. For anything else email [support@spyro.app](mailto:support@spyro.app) - we aim to respond within the timeframe required by applicable law.

If you're in the EEA or UK and unhappy with our response, you may complain to your local supervisory authority. If you're in India, you may complain to the Data Protection Board of India. California residents may request the categories of personal information we collect and request deletion; we do not sell personal information as defined by the CCPA.

## 8\. Security

Data is encrypted in transit (TLS 1.2+) and at rest in our database. Row-level security ensures one tenant's data can't be read by another. The service-role key is only used in server-side jobs. Passwords are hashed (never plaintext). We'll notify affected users within 72 hours of becoming aware of any personal-data breach that's likely to result in risk to your rights.

## 9\. Children

Spyro is a business tool not directed at children under 16, and we don't knowingly collect their data. If you believe a child has provided us with personal data, contact us and we will delete it.

## 10\. Changes to this policy

We'll post any change on this page with a new “last updated” date. If the change is material - for example, a new sub-processor with a different purpose - we'll email account holders at least 14 days before it takes effect.

## 11\. Contact

Questions, requests or complaints: [support@spyro.app](mailto:support@spyro.app). See also our [Terms of Service](https://spyro.app/terms).