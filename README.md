# Ember — small habits, quietly kept for life

Ember is a one-tap daily ritual app: pick one tiny habit, check in each morning, and
watch a year fill in. Free to start; $2.99/month (App Store subscription, 7-day trial)
for unlimited rituals, sync and gentle streak reminders.

This repository contains both halves of the product:

| Path       | What it is                                                                 |
| ---------- | -------------------------------------------------------------------------- |
| `/`        | Marketing site + API (Next.js App Router). Deploys to Vercel as-is.        |
| `/mobile`  | The iPhone app (Expo + Expo Router). Today, Year and Settings tabs.        |

See [PLAN.md](./PLAN.md) for the roadmap (Phase 2 monetization, Phase 3 sync,
Phase 4 App Store release).

## Web (landing site + API)

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

- `/` — the landing page (Quiet Companion design: warm paper, sage accent, serif type)
- `/api/prompt` — `GET` returns `{ date, prompt }`, one deterministic prompt per day;
  optional `?date=YYYY-MM-DD`. Used by the mobile app's "daily prompt" card.

## Mobile app

```bash
cd mobile
npm install
npx expo start --web   # preview in a browser
npx expo start         # scan the QR code with the Expo Go app on an iPhone
```

Check-ins are stored on the device (AsyncStorage) and work offline. The app fetches
the daily prompt from `EXPO_PUBLIC_API_URL` (defaults to the deployed site; set it in
`mobile/.env` to point at your own domain).

## Connect a domain

1. Deploy the root of this repo to Vercel (import the repo, framework auto-detected).
2. In Vercel → Settings → Domains, add your domain (for example `ember.yourdomain.com`).
3. At your registrar, point the domain at Vercel with the records Vercel shows
   (usually `A 76.76.21.21` or a `CNAME` to `cname.vercel-dns.com`).
4. Update `metadataBase` in `app/layout.tsx` and `EXPO_PUBLIC_API_URL` for the app.

## App Store path

Phase 4 in [PLAN.md](./PLAN.md) covers this. What you need that this repo can't do
for you: an Apple Developer account ($99/yr), and an Expo account for `eas build`.
