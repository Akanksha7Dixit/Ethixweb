# Ethixweb India

India-specific redesign of ethixweb.com. Monorepo with a clean split:

```
ethixweb-india/
├── backend/            Node + Express API, PostgreSQL, admin auth, spam protection
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/           React + Vite + Framer Motion
│   ├── index.html
│   ├── public/logo.svg
│   └── src/
│       ├── main.jsx · App.jsx · Layout.jsx · ui.jsx · data.js · icons.jsx · styles.css
│       └── pages/  Home · Services · About · Contact · Admin
└── package.json        helper scripts
```

## Run locally
```bash
npm run install:all
cp backend/.env.example backend/.env     # set DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET
npm run dev:backend                      # API on :3000 (creates the `leads` table)
npm run dev:frontend                     # UI on :5173 (proxies /api to :3000)
```
Production: `npm run build && npm start`; the backend serves `frontend/dist` and the API from one origin on `$PORT`. Any PostgreSQL works (Supabase, Neon, Railway, Render). Set `NODE_ENV=production` so cookies are `Secure`.

## Frontend: design & UI features
**Direction:** editorial luxury. Dark sections alternate with warm ivory ones, an Instrument Serif display face over Inter, Ethixweb red with gold hairlines, film grain and a jaali-inspired lattice.

Framer Motion (lazy-loaded via `LazyMotion`/`domMax`, `MotionConfig reducedMotion="user"`) plus Lenis smooth scrolling:
- Kinetic hero headline, parallax aurora glows, 3D-tilt WhatsApp booking demo with floating status chips
- Scroll-linked manifesto text that fills in word by word
- Pinned **horizontal services reel** driven by scroll (native swipe carousel on mobile)
- **Stacking process cards** that scale back as the next one arrives
- Editorial accordion index for featured work and services (spring height animation)
- **Animated dot-matrix map of India** (canvas): pulse wave from Delhi NCR, arcs and travelling packets to 9 cities, hover a city to trace it; pauses off-screen
- Floating-label form, animated choice chips (shared `layoutId`), animated validation errors, SVG path-drawn success check
- Custom blend-mode cursor (desktop only), magnetic buttons, page-wipe curtain transitions, scroll-progress bar, live IST clock, staggered mobile menu
- Route-level code splitting, self-hosted fonts, no third-party requests

## Backend
- `POST /api/leads` saves to PostgreSQL (parameterised SQL). Server-side validation: name, email, Indian mobile (`[6-9]` + 9 digits → `+91…`), service/budget allow-lists, message length, DPDP consent.
- Spam protection: honeypot field · HMAC-signed time-trap token (3 s–2 h) · IP rate limit (5/h) · optional Cloudflare Turnstile (`TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET`).
- Admin at `/admin`: password login → signed HttpOnly SameSite=Strict cookie; every `/api/admin/*` route returns 401 without it, and the page shows only the sign-in form until authenticated. List, search, filter, change status, notes, delete, CSV export (formula-injection safe). `noindex` on admin.
- Helmet CSP, gzip, 20 KB body limit, login rate limit.

## Design rationale: what makes it India-specific
- **Commercial reality:** ₹ and lakh budget bands, GST invoicing, DPDP Act consent and IST support hours instead of a US LLC framing.
- **Channels & stack:** WhatsApp-first AI agents, UPI/Razorpay/COD, Tally and Zoho beside HubSpot/GHL; Hindi and regional-language support.
- **Forms:** +91 mobile validation, city field, IST timestamps in admin.
- **Audience-fit work:** clinics, D2C/retail, real estate/education blueprints.
- **Look & feel:** premium dark-and-ivory editorial design with Ethixweb red and gold hairlines, a jaali-inspired lattice, a Hindi sign-off and a dot-matrix map of India connecting major cities.

## Improvements over the current site
- The current homepage repeats the same four testimonials four times in the DOM and runs a rotating globe plus several live clocks; this build ships route-split code, no third-party scripts and self-hosted fonts.
- One clear CTA path, accessible forms (labels, aria-live, 16px inputs, focus rings, reduced-motion), and a real lead pipeline with admin.
- No invented testimonials. "50+ projects" and "<1h response" come from the current site; featured work is labelled illustrative.

## Notes before launch
- Replace `frontend/public/logo.svg` with the official logo files.
- Add a WhatsApp number/link when available.
- Tested end to end against real PostgreSQL (insert, validation, honeypot, bad token, rate limit, admin auth, update, export, SPA routes). Run PageSpeed Insights on your deployed URL to confirm 90+; the page is built for it (code-split, lazy motion, compressed hashed assets cached 1 year).
