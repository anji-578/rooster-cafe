# ROOSTER Cafe & Dine

Simple consumer website + shop for coffee beans and homemade pickles.

## Run

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000

## Pages

- `/` — Home
- `/shop` — Coffee & pickles
- `/shop/[slug]` — Product detail
- `/cart` — Bag → order on WhatsApp
- `/menu` — Cafe food overview
- `/about` — Story
- `/contact` — Visit & map
- `/review` — Catering / customer feedback

## Domain

Production: **https://www.roostercafe.in**

## Config

Copy `.env.example` to `.env.local`:

- `NEXT_PUBLIC_SITE_URL=https://www.roostercafe.in`
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — for shop orders
- `NEXT_PUBLIC_GOOGLE_REVIEW_URL` — Google write-review link
- `NEXT_PUBLIC_INSTAGRAM_URL`

## Deploy (Vercel) + connect domain

1. Push this `web/` app to GitHub (or deploy from folder).
2. Import project in [vercel.com](https://vercel.com) — root directory = `web`.
3. Set env vars (same as `.env.example`).
4. Project → **Settings → Domains** → add:
   - `www.roostercafe.in`
   - `roostercafe.in` (redirect to www)
5. At your domain registrar, add the DNS records Vercel shows (usually A / CNAME).
6. Wait for SSL to become active, then reprint QR codes if needed:

```bash
npm run qr
```

QR currently points to: `https://www.roostercafe.in/review?src=catering`
