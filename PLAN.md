# Ember — a one-tap daily ritual app

## Goal and users
Ember is a consumer habit app for people who want gentle self-improvement: pick one tiny habit, check in each morning with one tap, and watch a year fill in. Free to start; $2.99/month subscription unlocks unlimited rituals, sync and reminders. Working means: a domain-ready marketing site that converts, a real iPhone-capable app people can use daily, and a revenue path (App Store subscription) once accounts and StoreKit are wired.

**Design brief (Quiet Companion):** for people seeking calm self-improvement; each screen's one job is a single morning decision. Mood: serene, editorial, unhurried. Direction: editorial serif on warm paper (#F7F4EE), sage accent (#6B7F5E). Memorable thing: the year-in-pixels grid you want to keep filling.

## Scope
In scope now (Phase 1): landing site + real API + Expo app (Today check-in, year view, settings) with on-device storage, GitHub repo, deploy-ready configuration.
Out of scope for now: RevenueCat/StoreKit purchases (Phase 2), cross-device sync backend + auth (Phase 3), push reminders, TestFlight/App Store submission, email capture.

## Architecture
- **Web (repo root):** Next.js App Router, plain CSS with design tokens. Chosen because it deploys to Vercel in one step (domain connection is a DNS record) and hosts the API the app calls.
- **API:** `GET /api/prompt` — deterministic daily journal prompt (date-keyed, no auth, stateless). Real backend for the app; rate-limit friendly.
- **Mobile (`mobile/`):** Expo + Expo Router (tabs: Today, Year, Settings). Check-ins stored on-device with AsyncStorage (works offline; sync comes later). Daily prompt fetched from `EXPO_PUBLIC_API_URL` with a built-in offline fallback rotation.
- **Data model (client-side, Phase 1):** `{ ritualName, checkins: { "YYYY-MM-DD": true } }`. Streak = consecutive days ending today or yesterday.
- **Hosting:** Vercel (web + API). Mobile: Expo/EAS when the user is ready (needs their Expo account).
- **Secrets:** none required in Phase 1. Later: RevenueCat keys (public key via `EXPO_PUBLIC_`, secret server-side), never in the bundle.

## Risks and assumptions
- Assumed the free tier covers one ritual; subscription unlocks unlimited — matches the App Store plan in the design brief.
- iCloud sync deferred until an account system exists (Phase 3); Phase 1 data is on-device only.
- App Store submission requires the user's Apple Developer account ($99/yr) — cannot be done from here.

## Phase 1: Launch-ready product core (this run)
Goal: a working app and site someone can use today, deployed and monetizable next.
- [x] Landing site with Quiet Companion design: hero, how-it-works, year-in-pixels explainer, pricing ($2.99/mo, 7-day trial), SEO + OG tags
- [x] `GET /api/prompt` returning a real daily prompt
- [x] Expo app: one-tap morning check-in, streak, editable ritual name, offline storage
- [x] Year-in-pixels screen rendering the current year's check-ins
- [x] Web build passes, mobile typecheck passes, both checked in browser at phone width
- [ ] All code committed and pushed to a GitHub repository

Acceptance: you can open the site, open the app in Expo, tap check in, and see today fill in on the year grid.

## Phase 2: Monetization
Goal: take payments. RevenueCat + StoreKit 2 subscription ($2.99/mo, 7-day trial), paywall screen, entitlement gating for unlimited rituals, receipts validated server-side. Acceptance: a sandbox purchase unlocks unlimited rituals.

## Phase 3: Accounts and sync
Goal: keep data across devices. Auth (Sign in with Apple), hosted database, sync of check-ins, iCloud-compatible export. Acceptance: check in on phone, see it on a second device.

## Phase 4: Distribution
Goal: ship it. App icons and screenshots, App Store listing copy, EAS production build, TestFlight, marketing site CTA pointed at the live App Store link, custom domain DNS handoff. Acceptance: TestFlight invite installs on an iPhone.
