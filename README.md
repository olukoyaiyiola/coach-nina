# Coach Nina — AI Video Creation Platform & Conversational AI Admin Studio

A complete, production-ready web platform for **Coach Nina**, an AI video creation educator targeting beginners, business owners, content creators, freelancers, and students.

The platform includes two fully integrated environments:
1. **Public Marketing Website**: A warm editorial, high-converting landing page showcasing the AI Video Creation Starter Class, practical use cases, official TikTok creator embeds and video examples, a live campaign countdown timer, interactive syllabus modules, FAQs, and WhatsApp conversion pathways.
2. **Private Admin Studio (`/studio-control`)**: A secure, password-authenticated admin console featuring a **conversational AI assistant powered by the Google Gemini API**, direct visual copy & pricing editors, a persistent media asset library (with device upload, Android camera support, and SSRF-protected URL import), TikTok showcase manager, FAQ manager, and full change audit history with 1-click rollback.

---

## 🌟 Key Architecture & Implemented Features

### 1. Established Brand Design Preservation
- Warm cream background (`#FFF8F1`), card surface (`#FFFDF9`), espresso-brown typography (`#2A1711`), terracotta & burnt orange accents (`#A84D27`), and muted gold highlights (`#C9794B`).
- Typography pairing: **Cinzel** & **Playfair Display** editorial serif headings with **Plus Jakarta Sans** clean sans-serif body.
- Ambient luxury gold glow effects and subtle editorial grid background.

### 2. Authentic Coach Nina Image Asset
- Found and utilized the supplied high-resolution laptop portrait at [public/images/coach-nina-laptop.png](file:///c:/Users/Odg/Documents/coach%20nina/public/images/coach-nina-laptop.png).
- Depicts Coach Nina seated at a desk with her laptop, black lace outfit, gold jewellery, Coach Nina mug, and study books (*AI & Creativity*, *Digital Income*, *The Next Chapter*).
- Featured prominently in the hero section and instructor introduction card with natural proportions and responsive sizing.

### 3. TikTok Showcase & Official Creator Hub
- **TikTok Creator Profile Embed**: Official profile embed for `@noinoi.stories` in the Creator Hub section with single-load official script (`https://www.tiktok.com/embed.js`).
- **Individual Video Embeds**: High-performance responsive player iframes using supplied video IDs:
  - Swim Sexy Launch Spot (`7681170901257227542`)
  - The Price of Envy Part 1 (`7670253315820735766`)
  - Children of the Tide Part 1 (`7670968106403073312`)
- **Graceful Fallbacks**: Every card includes an overlay direct link to the TikTok post ensuring visitors can always view the video even if third-party scripts or cookies are blocked.
- **Admin Studio Manager**: Add new TikTok URLs (with auto-extraction and validation of video IDs), edit descriptions, reorder items, and toggle the Creator Hub.

### 4. Real Live Countdown & Pricing System
- Initial configuration:
  - Original price: **₦25,000** (strikethrough)
  - Launch price: **₦15,000** (prominent discount)
  - Campaign deadline: **31 October 2026 at 11:59:59 PM (Africa/Lagos time)**
- Dynamic countdown timer deriving remaining time in real-time. Upon reaching zero or if deactivated in the admin studio, gracefully displays the expired-offer state and directs visitors to WhatsApp for current cohort tuition.

### 5. WhatsApp Conversion Pipeline
- Direct destination: `https://wa.me/2349133942845`
- URL-encoded prefilled message: *"My name is [Your Name] and I am interested in learning about AI video creation."*
- Touch-friendly action buttons throughout the page + non-intrusive sticky mobile CTA bar.
- Fully editable phone number, prefilled text, and CTA labels via Admin Studio.

### 6. Conversational Gemini AI Website Assistant
- Powered by the Google Gemini API (`GEMINI_API_KEY` strictly server-side).
- Supports natural-language website editing:
  - *"Change the launch price to ₦18,000"*
  - *"Rewrite the hero headline in simpler language"*
  - *"Add a FAQ about smartphone editing"*
  - *"Show me every section that mentions pricing"*
- **Two-phase approval**: The assistant formulates a structured `ProposedChangeSet` showing before/after diffs, affected sections, and human-readable summaries. Changes only persist after the administrator clicks **Apply & Publish Live**.

### 7. Dual-Mode Database Persistence & Migration Scripts
- **Production Mode**: Connects directly to **Supabase Postgres** using `DATABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Complete SQL migration (`supabase/schema.sql`) and seed (`supabase/seed.sql`) files included.
- **Local Fallback Mode**: When running offline or without Supabase keys, automatically persists all content, media metadata, settings, and audit logs to `data/coach_nina_store.json` using atomic file writes.
- **Instant Live Reflection**: Updates persist to the database and revalidate `/` immediately without requiring a Git commit or Vercel redeployment!

### 8. Full Security & Diagnostics
- Dedicated admin route: `/studio-control` (configurable via `ADMIN_PATH`).
- Protected by `ADMIN_PASSWORD` and `SESSION_SECRET` with HttpOnly, SameSite session cookies.
- In-memory rate limiting against brute force attempts (max 5 failed attempts per window).
- Blocked from search engines via `app/robots.ts` and `X-Robots-Tag: noindex`.
- SSRF protection on media URL imports (blocks loopback, private ranges `10.*`, `172.16.*`, `192.168.*`, and cloud metadata services).

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, PostCSS
- **Icons**: Lucide React
- **Database**: Supabase PostgreSQL / Local Atomic JSON Store
- **AI Engine**: Google Gemini API (`@google/generative-ai`)
- **Authentication**: JWT session tokens via `jose`, HttpOnly cookies

---

## 📁 Project Structure

```
coach-nina/
├── app/
│   ├── api/admin/
│   │   ├── apply-changes/route.ts  # Commit confirmed AI changes to DB
│   │   ├── assistant/route.ts      # Gemini AI conversation endpoint
│   │   ├── content/route.ts        # Direct editorial copy API
│   │   ├── diagnostics/route.ts    # System status & storage stats
│   │   ├── faqs/route.ts           # FAQs CRUD API
│   │   ├── history/route.ts        # Audit log & rollback API
│   │   ├── login/route.ts          # Rate-limited session authentication
│   │   ├── logout/route.ts         # Session destruction
│   │   ├── media/route.ts          # Media upload & SSRF-safe URL import
│   │   ├── settings/route.ts       # Global settings & pricing API
│   │   └── showcase/route.ts       # TikTok showcase manager API
│   ├── studio-control/
│   │   └── page.tsx                # Private Admin Studio Route
│   ├── globals.css                 # Warm luxury theme tokens
│   ├── layout.tsx                  # Fonts, metadata & SEO setup
│   ├── page.tsx                    # Public Marketing Website
│   ├── robots.ts                   # Crawler exclusion rules
│   └── sitemap.ts                  # SEO Sitemap
├── components/
│   ├── admin/                      # Admin Studio interactive modules
│   │   ├── AdminChatAssistant.tsx  # Gemini conversation panel
│   │   ├── AdminHeader.tsx         # Studio navigation & status
│   │   ├── AdminLogin.tsx          # Password authentication screen
│   │   ├── ContactSettings.tsx     # WhatsApp & socials editor
│   │   ├── ContentEditor.tsx       # Direct copy editor
│   │   ├── DiagnosticsPanel.tsx    # Live system diagnostic gauges
│   │   ├── FaqManager.tsx          # FAQ accordion manager
│   │   ├── HistoryManager.tsx      # Audit trail & 1-click rollback
│   │   ├── MediaLibrary.tsx        # Device & URL media manager
│   │   ├── PricingManager.tsx      # Tuition & countdown editor
│   │   └── ShowcaseManager.tsx     # TikTok videos & Creator Hub
│   ├── CoachBio.tsx                # Instructor introduction
│   ├── Curriculum.tsx              # 6 modules & what's included
│   ├── FaqSection.tsx              # Interactive FAQ accordion
│   ├── Footer.tsx                  # Verified contact channels
│   ├── Hero.tsx                    # Hero headline, laptop photo & CTAs
│   ├── Navbar.tsx                  # Header, launch banner & mobile drawer
│   ├── PricingOffer.tsx            # Live countdown card & discount
│   ├── ShowcaseGallery.tsx         # 3 TikTok videos & Creator Hub
│   ├── StickyMobileCta.tsx         # Mobile floating WhatsApp CTA
│   └── WhoItsFor.tsx               # 5 target audience categories
├── lib/
│   ├── auth.ts                     # Password verify, rate limiter & JWT
│   ├── db.ts                       # Dual Supabase / persistent DB layer
│   ├── gemini.ts                   # Gemini tool calls & structured schema
│   └── types.ts                    # Strong TypeScript models
├── public/
│   ├── images/
│   │   └── coach-nina-laptop.png   # Authentic supplied laptop portrait
│   └── uploads/                    # Persistent media uploads directory
├── supabase/
│   ├── schema.sql                  # Supabase PostgreSQL tables & RLS
│   └── seed.sql                    # Initial seed data
├── .env.example                    # Documented configuration variables
├── .env.local                      # Local development credentials
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v18 or higher (v24 tested)
- npm or pnpm

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file (or copy `.env.example`):
```env
ADMIN_PASSWORD=CoachNina2026!
SESSION_SECRET=your_random_32_character_secret_here
ADMIN_PATH=/studio-control
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

### 4. Running Locally
```bash
npm run dev
# or for production server:
npm run build
npm run start
```
- Public Website: `http://localhost:3000`
- Admin Studio: `http://localhost:3000/studio-control` (Password: `CoachNina2026!`)

### 5. Automated E2E Verification Test
Run the automated verification test script:
```bash
node test_e2e.js
```
Validates:
- Public homepage status 200 and all copy/embed assertions.
- Unauthenticated API access rejected with 401.
- Invalid password rejection with 401.
- Valid password login with session cookie.
- Setting mutations and live instant update on the public homepage.
- Diagnostic readings and session logout.

---

## 🗄️ Supabase Deployment (Optional Production Setup)

To use Supabase Postgres instead of the local store:
1. Create a project on [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Run the SQL script located in [supabase/schema.sql](file:///c:/Users/Odg/Documents/coach%20nina/supabase/schema.sql).
4. Run the seed script in [supabase/seed.sql](file:///c:/Users/Odg/Documents/coach%20nina/supabase/seed.sql).
5. In your project settings, copy your `Project URL` and `service_role` key and add them to your environment:
   ```env
   SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

---

## ☁️ Deploying to Vercel

1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New Project** and import the repository.
3. Add the following Environment Variables in Vercel:
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`
   - `GEMINI_API_KEY`
   - `SUPABASE_URL` (optional)
   - `SUPABASE_SERVICE_ROLE_KEY` (optional)
4. Click **Deploy**.
