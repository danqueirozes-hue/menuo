# MENUO — One menu. Every language.

A digital menu platform for restaurants: build a menu, publish it, and
guests access it via QR code, choosing from 20 languages before they see a
single dish.

## Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript + Tailwind CSS 4
- **Prisma 6** + SQLite (swap to Postgres later by changing the datasource)
- **Auth.js (NextAuth v5)** — email/password login for restaurant owners
- **Stripe** — subscription billing that gates menu publishing
- **qrcode** — QR code generation for the public menu link
- **Playwright (Chromium)** — renders the real public menu page and prints it
  to PDF, so the PDF is a pixel-faithful copy of what guests see from the QR
  code, in any supported language

> **Deployment note:** PDF export launches a headless Chromium browser
> server-side. That works great on a normal Node.js host (a VM, Docker
> container, Railway/Render/Fly, etc.), but most serverless platforms
> (e.g. plain Vercel functions) don't support it out of the box — if you
> deploy there, you'd need a serverless-friendly Chromium build
> (`@sparticuz/chromium`) or an external "HTML to PDF" service instead.

## Getting started

```powershell
npm install
Copy-Item .env.example .env    # already done in this checkout
npx prisma migrate dev
npm run dev
```

Open `http://localhost:3000`.

## Account structure

One **User** (login) can own multiple **Restaurants** (establishments),
each of which can have multiple **Menus**. Each `Menu` is what actually
gets published, translated and turned into a QR code/PDF — it has its own
slug, source language and publish state. `Restaurant` holds the shared
branding (name, logo, address, currency).

- `/dashboard` → redirects to your first establishment
- `/dashboard/r/[restaurantId]` → list of menus for that establishment, "+
  New menu" (limited by your plan)
- `/dashboard/r/[restaurantId]/menus/[menuId]` → the menu builder
- `/dashboard/r/[restaurantId]/menus/[menuId]/publish` → publish, QR code, PDF
- `/dashboard/r/[restaurantId]/settings` → establishment branding
- `/dashboard/new-establishment` → add another establishment (Multi-location
  plan only)
- `/dashboard/billing` → current plan, usage, subscribe/cancel

## Plans & billing

Plans are defined in code (`src/lib/plans.ts`), not in the database — there
are only four fixed tiers:

| Plan | Monthly | Annual (2 months free) | Establishments | Menus per establishment |
|---|---|---|---|---|
| Essential | €29/mo | €290/yr | 1 | 1 |
| Business | €39/mo | €390/yr | 1 | 3 |
| Hospitality | €49/mo | €490/yr | 1 | 10 |
| Multi-location | from €99/mo | from €990/yr | 5 | 5 |

Annual price is always 10x the monthly price (`priceCentsFor` in
`src/lib/plans.ts`) — customers get 2 months free by prepaying annually.
Each interval needs its own Stripe Price object (see `.env.example`'s
`STRIPE_PRICE_*_ANNUAL` vars); the `Subscription.interval` column tracks
which one a customer is on.

An account with **no active subscription** can still build a single menu
for a single establishment (so people can try the product before paying),
but **cannot publish it** — `POST /api/publish` returns `402` with
`code: "SUBSCRIPTION_REQUIRED"` and the dashboard shows a "Subscribe to go
live" prompt instead of hiding the feature.

Billing goes through Stripe (`src/lib/stripe.ts`,
`src/app/api/billing/*`). **Without `STRIPE_SECRET_KEY` and a price ID
configured**, clicking "Subscribe" activates the plan directly instead of
opening a real checkout — a dev-mode bypass clearly labelled in the code,
so the whole publish-gating flow can be built and tested without a live
payment processor. Add the Stripe env vars in `.env` to switch to real
billing; `src/app/api/billing/webhook/route.ts` keeps the subscription
status in sync with Stripe afterward (needs `STRIPE_WEBHOOK_SECRET`).

## Translation

Publishing a menu automatically translates every section and dish name/
description into all 20 supported languages (`src/lib/languages.ts`),
caching the result in `SectionTranslation` / `ItemTranslation`. Editing a
dish's name or description clears its cached translations so they get
regenerated on the next publish.

Translation is done through a pluggable provider (`src/lib/translate.ts`):

- Set `DEEPL_API_KEY` (recommended, best quality for European languages) or
  `GOOGLE_TRANSLATE_API_KEY` in `.env` to enable real translation.
- **Without a key**, MENUO does not fabricate translations — it keeps the
  original text for every language. This is intentional: showing guests a
  fake translation would be worse than showing the source text. Add a key
  before onboarding real restaurants.
- Translation calls are paced and retried with backoff (`src/lib/
  translate.ts`, `src/app/api/publish/route.ts`) since free-tier providers
  rate-limit bursts — publishing fires one call per dish/section per
  language.

## Dietary filters

Dishes can be flagged vegetarian / vegan / gluten-free / contains-seafood
(`src/lib/dietary-tags.ts`). Guests see small discreet icons next to each
dish and can filter the public menu with a button in the top-right corner
(`src/components/menu/DietaryFilter.tsx`) — labels are localized across
all 20 languages.

## Notes

- Uploaded photos are stored under `public/uploads/<userId>/`.
- The 20 languages were chosen to cover the main language of every
  continent, weighted toward Europe (MENUO's primary market): English,
  French, German, Spanish, Italian, Portuguese, Dutch, Polish, Swedish,
  Greek, Russian, Turkish, Arabic, Chinese, Japanese, Korean, Hindi, Thai,
  Vietnamese, Swahili.
- Flag emoji may render as two-letter codes instead of pictures on Windows
  desktop browsers (Windows ships no color flag-emoji font by default).
  This is a platform font limitation, not a bug — flags render normally on
  iOS/Android, which is what guests will actually use to scan the QR code.
