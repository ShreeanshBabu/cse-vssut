<div align="center">

# Department of CSE — VSSUT Burla
### A modern, full-stack departmental website built for the Digital Department Challenge

[![Live Site](https://img.shields.io/badge/Live-Visit_Site-0A66C2?style=for-the-badge)](https://cse-vssut.vercel.app)
[![API](https://img.shields.io/badge/API-Deployed-00C853?style=for-the-badge)](https://cse-vssut-api.vercel.app)

</div>

---

## What We Built and Why

Most college department websites in India are stuck in the 2000s — static HTML pages, outdated faculty info, notices buried in PDFs nobody can find. We looked at how departments at MIT, Stanford, CMU, IIT Bombay, and IIT Delhi present themselves online and asked: *what if VSSUT's CSE department had something that clean, that functional, that alive?*

This is our answer. A two-part system:

**A public website** that students, parents, and recruiters actually want to use — fast, responsive, animated, and always showing fresh content.

**An admin dashboard** where department staff can update notices, faculty profiles, and announcements without ever touching code. Change something in the admin panel, and it shows up on the live site within seconds.

We also added an **AI-powered chatbot** — something universities like Georgia State, Yale, and UC Irvine have started doing — so visitors can ask natural questions like "What labs does the CSE department have?" or "Who teaches Machine Learning?" and get instant answers, even at 2 AM.

---

## What Makes This Different

Here's what we picked up from studying the best university websites around the world, and how we applied it:

**From Stanford and CMU** — Clean layouts with lots of breathing room. No clutter. Every section has a clear purpose. We used generous spacing, bold typography, and a structured navigation system that gets you where you need to go in one click.

**From IIT Delhi and IIT Bombay** — Dedicated sections for research areas, faculty with their specializations, placement statistics, and course listings organized by semester. We replicated this with filterable faculty cards and semester-wise syllabus views.

**From Yale and Georgia State** — AI chatbot for instant answers. Yale uses one for their summer admissions. Georgia State's "Pounce" chatbot handled over 200,000 messages with less than 1% needing human help. We built a lighter version using the Claude API that answers questions based on department data.

**From Imperial College London** — Bold hero section with a focused menu that keeps things clean. We used a similar approach: full-screen hero with animated text, a sticky nav that collapses on scroll, and smooth page transitions.

**From University of Pennsylvania** — Consistent branding on every single page. Same fonts, same colors, same feel. We enforced this through shared color tokens and typography rules across all components.

---

## All the Pages and Features

### Public Website

**Home Page** — Animated hero with department tagline and quick stats (students, faculty, labs, placements). HOD's message section with photo. Live notice ticker that pulls from the database. Upcoming events countdown. Quick-link cards to all major sections.

**People** — Faculty directory with profile cards showing photo, name, designation, research areas, email, and Google Scholar link. Search and filter by specialization (AI/ML, Networks, Security, etc.). Student directory with batch-wise filtering. Click any card to see the full profile.

**Academics** — B.Tech and M.Tech program structure. Semester-wise course listing with downloadable syllabus PDFs. Academic calendar. Elective course descriptions.

**Resources** — Tech clubs section (coding club, robotics, open source, competitive programming). Fest announcements with countdown timer. Lab infrastructure details. Placement stats with batch-wise data.

**AI Chatbot** — A floating widget on every page. Ask anything about the department in plain language. Powered by Claude API, trained on department data. Works around the clock, answers in seconds. Falls back to "contact the department" for questions it cannot answer.

**Extra Pages** — Alumni spotlight section. Research highlights and publications feed. Photo gallery of department events. Contact page with embedded map and office hours. FAQ section for admissions-related questions.

### Admin Dashboard

Secure login with email and password. Dashboard home with stats (total notices, total faculty, recent activity). Notice manager — add, edit, delete notices with title, body, date, and priority tags. Faculty manager — add, edit, remove profiles with image upload. Announcement manager — schedule announcements with start and end dates. Activity log showing who changed what and when.

---

## How We Keep It Secure

Security was a core concern from day one. Here is how we handled each part:

**Passwords** are hashed using bcrypt with 12 salt rounds. Plain text passwords never touch the database.

**Authentication** uses a two-token system. When an admin logs in, they get a short-lived access token (15 minutes) stored in the app's memory — not in localStorage, not in a regular cookie, not anywhere JavaScript on the page can reach it. For staying logged in, we use a refresh token stored as an httpOnly cookie with Secure and SameSite=Strict flags. This means even if someone finds an XSS hole, they cannot steal the token.

**API protection** — Every admin endpoint checks for a valid JWT before doing anything. The token includes the user's role, so even with a valid token, you cannot access admin routes unless you are actually an admin.

**Rate limiting** — The login endpoint allows 5 attempts per 15 minutes per IP address. After that, it blocks requests. This stops brute-force attacks.

**Input sanitization** — Every piece of data from the user goes through validation before it touches the database. This prevents NoSQL injection and XSS attacks. We've added a custom middleware to strip `$` prefixed keys from all requests, further hardening against NoSQL injection.

---

## Getting Started

### Prerequisites
- Node.js (>= 20.0.0)
- MongoDB (Local or Atlas)
- Cloudinary account (for image uploads)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd Frontend && npm install
   cd ../server && npm install
   ```
3. Set up `.env` in the `server` directory (see `.env.example`)
4. Seed the initial data:
   ```bash
   cd server
   npm run seed        # Creates default admin
   node seedFaculty.js # Seeds CSE faculty data from VSSUT site
   ```
5. Run the development servers:
   - Frontend: `cd Frontend && npm run dev`
   - Backend: `cd server && npm run dev`**Security headers** — We use Helmet.js to set Content-Security-Policy, X-Frame-Options, and HSTS. These prevent clickjacking, script injection, and force HTTPS.

**CORS** — In production, only our frontend domain is allowed to call the API. No wildcard origins.

**Error handling** — In production, error messages are generic ("Something went wrong"). Stack traces and detailed errors only show in development mode. No internal information leaks to the browser.

### Login Flow

```
Admin types email + password
        |
        v
Server finds user by email in MongoDB
        |
        v
bcrypt.compare(typed password, stored hash)
        |
        |-- No match --> "Invalid credentials" (generic message)
        |
        '-- Match
                |
                v
        Generate access token (15 min, in response body)
        Generate refresh token (7 days, httpOnly cookie)
                |
                v
        Frontend stores access token in React state only
        (never localStorage, never sessionStorage)
                |
                v
        Every API call: Authorization: Bearer <token>
        When expired --> silent refresh using the cookie
```

---

## Tech Stack

**Frontend** — React 18, React Router v6, Tailwind CSS, Framer Motion (page transitions and scroll animations), Axios with interceptors for token refresh, React Query for server state and caching, React Hook Form + Zod for validated forms, Lucide React for icons.

**Backend** — Node.js 20, Express.js, MongoDB Atlas (free tier, 512MB), Mongoose for schemas, JWT for auth, bcryptjs for hashing, Helmet for security headers, express-rate-limit, express-validator, CORS, Morgan + Winston for logging, Multer + Cloudinary for image uploads.

**AI** — Claude API (Anthropic) powering the department chatbot. Department data is sent as context with each question so answers are always relevant and grounded.

**Deployment** — Vercel free tier for both frontend and backend (serverless functions). MongoDB Atlas free cluster. Cloudinary free tier for images.

---

## Project Structure

```
cse-vssut/
|
|-- client/                     <-- React frontend
|   |-- src/
|   |   |-- components/         <-- Reusable UI (Navbar, FacultyCard, NoticeTicker...)
|   |   |-- pages/
|   |   |   |-- public/         <-- Home, People, Academics, Resources
|   |   |   '-- admin/          <-- Login, Dashboard, NoticeManager, FacultyManager
|   |   |-- context/            <-- AuthContext (JWT in memory)
|   |   |-- services/           <-- API call functions
|   |   |-- hooks/              <-- useAuth, useApi
|   |   '-- App.jsx             <-- Routes and layout
|   '-- package.json
|
|-- server/                     <-- Node.js backend
|   |-- src/
|   |   |-- config/             <-- DB connection, Cloudinary, CORS
|   |   |-- controllers/        <-- What happens at each endpoint
|   |   |-- middleware/          <-- Auth, rate limiter, error handler, validation
|   |   |-- models/             <-- User, Notice, Faculty, Announcement schemas
|   |   |-- routes/             <-- Endpoint definitions
|   |   '-- utils/              <-- Token helpers, custom error classes, logger
|   |-- vercel.json             <-- Serverless config
|   '-- package.json
|
'-- README.md
```

---

## How to Run Locally

You will need Node.js v20+, a free MongoDB Atlas cluster, a free Cloudinary account, and optionally a Claude API key for the chatbot.

```bash
# Clone
git clone https://github.com/komalmagar17/cse-vssut.git
cd cse-vssut

# Backend
cd server
npm install
# Create .env file (see below)
npm run dev          # runs on port 5000

# Frontend (new terminal)
cd client
npm install
npm run dev          # runs on port 5173
```

### Environment Variables

**server/.env**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cse-vssut
JWT_ACCESS_SECRET=<random-64-byte-hex>
JWT_REFRESH_SECRET=<different-random-64-byte-hex>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
ANTHROPIC_API_KEY=your-claude-key
```

**client/.env**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Generate JWT secrets with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

Never commit .env files. They are in .gitignore.

---

## API Endpoints

**Public (no login needed)**

| Method | Endpoint | What it does |
|--------|----------|-------------|
| GET | /api/public/notices | Get all published notices |
| GET | /api/public/faculty | Get all faculty profiles |
| POST | /api/public/chat | Send a question to the AI chatbot |

**Admin (needs JWT)**

| Method | Endpoint | What it does |
|--------|----------|-------------|
| POST | /api/auth/login | Login and get tokens |
| POST | /api/auth/refresh | Get a new access token |
| POST | /api/auth/logout | Clear refresh cookie |
| POST | /api/notices | Create a notice |
| PUT | /api/notices/:id | Update a notice |
| DELETE | /api/notices/:id | Delete a notice |
| POST | /api/faculty | Add a faculty member |
| PUT | /api/faculty/:id | Update faculty details |
| DELETE | /api/faculty/:id | Remove a faculty member |

---

## Deploying on Vercel (Free)

```bash
# Frontend
cd client && npx vercel --prod

# Backend
cd server && npx vercel --prod
```

After deploying, update environment variables on both sides to use the production URLs instead of localhost. Make sure CORS in the backend points to the actual frontend domain.

---

## What We Would Add With More Time

Email notifications when a new notice goes live. Dark mode toggle. PWA support so it can be installed on phones. Role-based access for HOD vs faculty vs lab staff. Analytics dashboard showing page views and chatbot usage. Google Calendar integration for academic events. Multi-language support — Hindi, Odia, and English.

---

## The Team

| Name | Roll No. | Focus Area | GitHub |
|------|----------|-----------|--------|
| **Komal Magar** | 2502040003 | Frontend and UI/UX | [@komalmagar17](https://github.com/komalmagar17) |
| **Shreeansh Babu** | 2502040004 | Backend and API | [@ShreeanshBabu](https://github.com/ShreeanshBabu) |
| **Deeptimayee Seda** | 2502040046 | Frontend and Content | [@suryansidhal](https://github.com/suryansidhal) |
| **Suryansi Dhal** | 2502040001 | Database and Security | [@suryansidhal](https://github.com/suryansidhal) |

---

<div align="center">

*Built for the Digital Department Challenge — Track 3: Full Stack*

*Department of Computer Science and Engineering, VSSUT Burla*

</div>
