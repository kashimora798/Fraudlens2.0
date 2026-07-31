# FraudLens — Scam Defense Simulator

> **🏆 Hackathon-Ready Full-Stack Web Application**
> 
> A cyber-defense training platform where students learn to spot scams through **immersive simulations** of WhatsApp chats, Instagram DMs, phone calls, and SMS messages — all with realistic UIs and real audio.

## 🚀 Live Demo

**[Try FraudLens Now](https://3000-ii25s7zslx2x1jizcp9mk.e2b.app)**

---

## 🎯 The Problem

India loses **₹1,500+ crores annually** to cyber fraud targeting students — fake KYC threats, "friend in trouble" WhatsApp scams, UPI payment traps, and "digital arrest" phone calls. **No safe, realistic training tool exists** that lets students practice spotting these scams before they happen in real life.

## ✨ The Solution

FraudLens is a **gamified cyber-defense trainer** with:

| Feature | Description |
|---------|-------------|
| 🎯 **Immersive Simulations** | Step inside realistic WhatsApp chats, Instagram DMs, phone calls with audio, and SMS notifications |
| 📱 **Pixel-Perfect App UIs** | Exact replicas of WhatsApp, Instagram, iPhone call screens |
| 🔊 **Real Audio** | Browser-based text-to-speech creates authentic Indian-English voices for scam calls |
| 🧠 **Branching Dialogue** | Your choices determine if you catch the scam or fall for it |
| 📊 **Message Scanner** | Paste any message and our 17-rule engine flags red flags instantly |
| 🏆 **Leaderboard** | Compete globally with XP, accuracy, and rank tracking |
| 🎓 **Academy** | 8 short lessons on OTP discipline, phishing, UPI safety, recovery |
| 🏅 **Badges & Levels** | Earn badges from "First Catch" to "Cyber Scholar" as you train |
| 📈 **Database** | 24 realistic case files + 6 immersive scenarios, all searchable and filterable |
| 💾 **Progress Tracking** | Your XP, streaks, and achievements persist across sessions |

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 16** with App Router
- **React 19** with Server Components
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **Web Speech API** for real audio calls (no API keys needed!)
- **Web Audio API** for sound effects
- **Framer Motion-inspired** animations with pure CSS

### Backend
- **PostgreSQL** database
- **Drizzle ORM** for type-safe database operations
- **6 API Routes** for cases, scans, verdicts, lessons, leaderboard, and simulation sessions

### Data
- **24 realistic scam case files** across 6 channels (SMS, WhatsApp, Email, Website, Call, UPI)
- **6 immersive simulation scenarios** with branching dialogue trees
- **8 academy lessons** covering all major scam categories

---

## 🎮 Features Deep Dive

### 1. Immersive Simulator (`/simulator`)

**Experience real scams in a safe environment:**

```
📱 WhatsApp: "Bro, I'm stuck at Dubai airport..."
   → Typing indicators, progressive messages
   → Choose: Send money or verify with a call

📞 Phone Call: "This is Inspector Sharma from CBI..."
   → Real voice synthesis (Indian English)
   → Caller ID spoofing simulation
   → Choose: Answer or hang up

💬 Instagram DM: "You won an iPhone 16!"
   → Gradient chat bubbles
   → Fake verified account UI
   → Choose: Claim prize or report

📧 SMS: "Your electricity will be cut TODAY"
   → System notification overlay
   → Choose: Open, dismiss, or report
```

**Each scenario features:**
- Realistic delays between messages (500ms–5000ms)
- Typing indicators (bouncing dots)
- Adaptive dialogue based on your choices
- Dramatic debrief with red flag analysis
- XP rewards based on performance

### 2. Classic Verdict Mode (`/simulator-classic`)

The original judge-the-message experience:
- Random case files from the database
- Filter by channel (SMS, WhatsApp, Email, etc.) and difficulty
- Analyze red flags using the checklist
- Stamp verdict: SCAM or LEGIT
- Instant feedback with explanation

### 3. Message Scanner (`/scanner`)

**17-rule fraud detection engine:**

```
✓ Panic & urgency pressure
✓ Credential requests (OTP, PIN, password)
✓ Money bait (prizes, refunds, rewards)
✓ Pay-to-claim traps
✓ Link shorteners & fake domains
✓ HTTP links (not HTTPS)
✓ Fake authority impersonation
✓ KYC/update pressure
✓ Too-good-to-be-true offers
✓ Remote access app requests
✓ QR code traps
✓ Bitcoin/crypto demands
✓ Personal mobile numbers
✓ ALL CAPS shouting
✓ Leetspeak obfuscation
✓ Secrecy & isolation pressure
✓ Blackmail threats
```

**Features:**
- Real-time analysis with animated scan beam
- Severity-based flag highlighting (Critical/High/Medium/Low)
- Annotated message preview
- Risk score (0-100) with verdict gauge

### 4. Scam Database (`/database`)

**Full evidence vault with:**
- Search across all case files
- Filter by channel, category, risk level, nature (scam/legit)
- Expandable case files with full debrief
- Live "caught by trainees" statistics
- Community accuracy tracking

### 5. Defense Academy (`/academy`)

**8 bite-sized lessons (2-4 minutes each):**

1. **Anatomy of a Scam** — The 4 bricks every scam is built from
2. **OTP, PIN & Passwords** — Why you NEVER share them
3. **Phishing Links & Fake Websites** — How to read domains right-to-left
4. **UPI & Payment Safety** — The 6 rules that save your money
5. **Impersonation & Hacked Friends** — The "stuck abroad" scam exposed
6. **Apps, APKs & Permissions** — Why that "safe" app is dangerous
7. **You Got Scammed. Now What?** — The golden-hour recovery drill
8. **Your Digital Footprint** — How scammers research you

### 6. Agent Dashboard (`/dashboard`)

**Your personal dossier:**
- Editable agent name
- Rank progression (Recruit → Legend)
- XP tracking with level progress bar
- Accuracy by attack category
- 8 earnable badges
- Full verdict history

### 7. Global Leaderboard (`/leaderboard`)

**Compete with the best:**
- Real-time rankings
- XP, simulations, accuracy, streak tracking
- Podium display for top 3
- XP milestones visualization
- Quick access to start training

---

## 🎨 Design Highlights

### Visual Polish
- **Neon cyberpunk aesthetic** with deep blues and mints
- **Glassmorphism** effects on cards and modals
- **Smooth animations** throughout (reveal, fade, bounce, slide)
- **Phone frame simulation** with accurate iPhone-style UI
- **Radar visualization** on the homepage
- **Live intercept feed** cycling through recent cases

### Sound Design
- **Web Audio API** for lightweight sound effects
- **WhatsApp message tones** (received/sent)
- **iPhone ringtone** for call simulations
- **Call connected/disconnected** tones
- **Victory/failure** sounds for debrief
- **XP earned** sparkle sound

### Accessibility
- **Keyboard navigation** throughout
- **Screen reader** friendly labels
- **High contrast** color scheme
- **Responsive design** (mobile-first)

---

## 📁 Project Structure

```
fraudlens/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── case/               # Random case fetch
│   │   │   ├── health/             # Health check
│   │   │   ├── leaderboard/        # Global rankings
│   │   │   ├── learner/            # Agent profile
│   │   │   ├── lesson/             # Academy progress
│   │   │   ├── scan/               # Message scanner
│   │   │   ├── sim-session/        # Simulation results
│   │   │   └── verdict/            # Case verdicts
│   │   ├── simulator/              # Immersive simulator
│   │   │   └── simulator-client.tsx # Client-side logic
│   │   ├── simulator-classic/      # Original verdict mode
│   │   ├── scanner/               # Message scanner
│   │   ├── database/              # Case database
│   │   ├── academy/               # Learning lessons
│   │   ├── dashboard/             # Agent dashboard
│   │   ├── leaderboard/           # Global rankings
│   │   ├── globals.css            # Design system
│   │   └── layout.tsx             # Root layout
│   ├── components/
│   │   ├── social-sims/           # Immersive simulation UIs
│   │   │   ├── chat-sims.tsx      # WhatsApp/Instagram/Call/SMS
│   │   │   └── debrief.tsx        # Scenario debrief modal
│   │   ├── casemock.tsx           # Case mockup renderer
│   │   ├── radar.tsx              # Animated radar
│   │   ├── nav.tsx                # Navigation
│   │   ├── feed.tsx               # Live intercept feed
│   │   ├── ui.tsx                 # UI primitives
│   │   ├── icons.tsx              # Icon library
│   │   ├── tutorial.tsx           # Onboarding tutorial
│   │   ├── whats-new.tsx           # Feature highlights
│   │   ├── share.tsx              # Share functionality
│   │   └── notifications.tsx      # Notification system
│   ├── lib/
│   │   ├── types.ts              # TypeScript types
│   │   ├── meta.ts                # Levels, badges, constants
│   │   ├── scanner.ts             # Fraud detection engine
│   │   ├── lessons.ts             # Academy content
│   │   ├── server.ts              # Server helpers
│   │   └── sounds.ts              # Audio effects
│   └── db/
│       ├── index.ts               # Database connection
│       ├── schema.ts              # Database schema
│       ├── seed.ts                # Case file seeder
│       └── seed-sims.ts           # Simulation seeder
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm / pnpm / yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fraudlens

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Apply database schema
npx drizzle-kit push

# Seed the database
npx tsx src/db/seed.ts
npx tsx src/db/seed-sims.ts

# Start the development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## 🔧 Configuration

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/fraudlens
```

No API keys required! The app uses:
- **Web Speech API** for audio (built into modern browsers)
- **Web Audio API** for sound effects (built into modern browsers)
- **Local Storage** for agent ID persistence

---

## 📊 Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `learners` | Agent profiles (XP, name, streaks) |
| `scams` | 24 case files for classic mode |
| `attempts` | Verdict history for classic mode |
| `lesson_progress` | Academy completion tracking |
| `sim_scenarios` | 6 immersive simulation scenarios |
| `sim_sessions` | Simulation results and XP tracking |

### Key Relationships

```
learners → attempts (1:N)
learners → lesson_progress (1:N)
learners → sim_sessions (1:N)
scams → attempts (1:N)
sim_scenarios → sim_sessions (1:N)
```

---

## 🎯 Hackathon Judging Criteria

| Criteria | How FraudLens Excels |
|----------|---------------------|
| **Innovation** | First immersive scam simulator with real audio and pixel-perfect app UIs |
| **Impact** | Directly addresses ₹1,500+ crore annual student fraud problem in India |
| **Technical Depth** | Full-stack TypeScript, PostgreSQL, Drizzle ORM, Web APIs |
| **Design** | Professional cyberpunk aesthetic with smooth animations |
| **Completeness** | 8 pages, 6 API routes, 24 cases, 6 scenarios, 8 lessons |
| **User Experience** | Intuitive, gamified, educational, and engaging |
| **Scalability** | Modular architecture, easy to add new scenarios and features |
| **Presentation** | Clean, professional, hackathon-ready demo |

---

## 🏅 Achievement System

### Levels
| Level | XP Required | Badge |
|-------|-------------|-------|
| Recruit | 0 XP | 🎖️ |
| Cadet | 100 XP | 🎖️ |
| Analyst | 250 XP | 🎖️ |
| Hunter | 500 XP | 🎖️ |
| Sentinel | 900 XP | 🎖️ |
| Legend | 1500 XP | 🏆 |

### Badges
1. **First Catch** — Correctly flag your first scam
2. **Eagle Eye** — 10 correct verdicts
3. **Streak Machine** — Reach a 5-verdict streak
4. **Sharpshooter** — 80%+ accuracy across 15+ cases
5. **Case Closer** — Judge 25 simulator cases
6. **Signal Scanner** — Run the message scanner 3 times
7. **Academy Graduate** — Complete 4 academy lessons
8. **Cyber Scholar** — Complete all 8 academy lessons

---

## 🌟 Scam Categories Covered

| Category | Examples |
|----------|----------|
| **Banking & KYC** | SBI account blocked, HDFC KYC update |
| **Freebies & Rewards** | Free iPhone, Netflix refund, lucky draw |
| **Phishing Links** | Fake Instagram, SBI portal, tax refund |
| **Jobs & Internships** | Wipro offer, work-from-home tasks |
| **Delivery & Bills** | Electricity cut-off, customs duty |
| **Impersonation** | Hacked friend, CBI officer call |
| **Investment Fraud** | Guaranteed 20% returns, trading group |
| **Romance / Sugar Scam** | Sugar momma, easy money |
| **Blackmail** | Sextortion, video threats |

---

## 📱 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Web Speech API | ✅ | ✅ | ✅ | ✅ |
| Web Audio API | ✅ | ✅ | ✅ | ✅ |
| CSS Animations | ✅ | ✅ | ✅ | ✅ |
| Responsive Design | ✅ | ✅ | ✅ | ✅ |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Adding New Scenarios

1. Add to `src/db/seed-sims.ts`:
```typescript
{
  slug: "new-scenario",
  title: "Scenario Title",
  platform: "whatsapp",
  scammerName: "Scammer Name",
  scammerAvatar: "A",
  phases: [...],
  redFlags: [...],
  debriefTitle: "...",
  debriefBody: "...",
  debriefTip: "...",
  xpReward: 50,
}
```

2. Run `npx tsx src/db/seed-sims.ts`

### Adding New Case Files

1. Add to `src/db/seed.ts`:
```typescript
{
  caseCode: "FL-025",
  title: "...",
  channel: "whatsapp",
  category: "Phishing",
  isScam: true,
  // ... other fields
}
```

2. Run `npx tsx src/db/seed.ts`

---

## 📜 License

MIT License — Feel free to use this for educational purposes, hackathons, or to protect your community from scams.

---

## 🙏 Acknowledgments

- Inspired by real scam patterns documented by Indian cybercrime authorities
- Built with love for the student community
- No brands, companies, or individuals are associated with or endorsed by this project
- All case files are fictional reconstructions for educational purposes

---

## 📞 Contact & Support

- **Report a Bug:** Open an issue on GitHub
- **Feature Request:** Open an issue on GitHub
- **Questions:** Check the [Academy](/academy) or [Database](/database)

---

**Built to make students un-phishable. 🛡️**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql&logoColor=white)](https://postgresql.org)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-orange?logo=drizzle&logoColor=white)](https://orm.drizzle.team)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.17-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
