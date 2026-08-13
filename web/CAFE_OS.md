# Rooster Cafe OS

End-to-end cafe operations for **Rooster** (Koramangala): customer table QR ordering, kitchen display, biller POS, snooker timed billing on **S1**, loyalty/feedback.

## Quick start (local)

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000

### Staff apps
| Role | URL |
|------|-----|
| Admin / unique table QRs | http://localhost:3000/admin |
| Kitchen (chef) | http://localhost:3000/kitchen |
| POS (biller) | http://localhost:3000/pos |
| Customer table | http://localhost:3000/t/{token} (from Admin QR) |

## Flows

1. **Admin** → print QRs for T01–T25 + **S1**
2. Guest scans table QR → orders food (S1 can also **Start playing** snooker)
3. **Kitchen** sees tickets by priority / age
4. Guest **Request bill** (auto-ends snooker timer and adds time charge)
5. **POS** selects table → apply loyalty discount → Cash/UPI/Card → print
6. Guest leaves feedback → 4–5★ unlocks next-visit reward %

### Snooker (S1)
- Separate timed billing: Start → live timer → End → line item `minutes × ₹/min`
- Food orders still tagged to S1 and delivered there
- Default rate: **₹5/min** (configurable in store settings)

## Data
Runtime DB: `web/data/cafe-store.json` (gitignored). Reset from Admin → “Reset demo”.

## Domain
Production URL env: `NEXT_PUBLIC_SITE_URL=https://www.roostercafe.in`
