<<<<<<< HEAD
# LearnByHack

A cybersecurity learning & CTF platform — structured roadmaps, hands-on labs,
live events, writeups, and a leaderboard, built on React + TypeScript +
Firebase.

This is a full rebuild of the previous demo: new stack (TypeScript, Tailwind,
Framer Motion), new visual design (light SaaS theme, not the terminal/amber
theme from the old demo), and a real security model for flag submission.

## Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide icons
- **Backend:** Firebase Authentication, Firestore, Cloud Functions, Storage
- **Hosting:** Firebase Hosting

## Project structure

```
learnbyhack/
├── client/               # React app
│   └── src/
│       ├── components/
│       │   ├── ui/       # Design-system primitives (Button, Card, Input…)
│       │   ├── layout/   # Navbar, Footer, AppShell
│       │   └── shared/   # PageHeader, GlobalSearch, Countdown, TerminalHero…
│       ├── pages/        # One file per route
│       ├── contexts/     # AuthContext
│       ├── services/     # Firestore/Functions calls
│       ├── data/         # Seed content for roadmap, labs, events, courses, writeups
│       ├── firebase/      # Firebase SDK init
│       └── types/        # Shared TypeScript types
├── functions/            # Cloud Functions (flag verification)
│   ├── src/submitFlag.js # The only code that can read flag hashes
│   └── seed/              # Script to seed lab flags into Firestore
├── firestore.rules
├── storage.rules
└── firebase.json
```

## Getting started

```bash
cd client
npm install
npm run dev
```

The `.env` file already contains the Firebase Web SDK config for this
project (`learnbyhack-a6524`) — those values are public/client-safe by
design, so the app works immediately. If you ever repoint this at a
different Firebase project, copy `.env.example` to `.env` and fill in your
own project's config.

## How content is organized

**Static/browsable content** — the roadmap, lab descriptions, courses,
events, and writeups — lives in `client/src/data/*.ts`. This keeps the site
fast (no loading spinners on every page) and easy for you to edit directly:
add a lab, add a roadmap topic, add a writeup, all by editing plain
TypeScript arrays with full type-checking.

**Live/personal data** — user accounts, XP, coins, achievements, completed
labs, and the leaderboard — is backed by real Firestore documents. This is
what actually changes as people use the platform.

## Flag submission security

Per the brief: **flags are never sent to the browser.** The flag values live
only in the `labFlags/{labId}` collection, which Firestore security rules
block from every client read (`allow read: if false`). The only thing that
can read that collection is the `submitFlag` Cloud Function, which:

1. Hashes the submitted guess and compares it to the stored hash
2. If correct and not already solved, awards XP/coins, updates the user's
   level, and unlocks any lab-count achievements
3. Logs the attempt to `submissions/` either way

To wire this up for real labs:

```bash
cd functions
npm install
firebase deploy --only functions
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json node seed/seedLabFlags.js
```

Edit the `LABS` array in `functions/seed/seedLabFlags.js` to match whatever
flags your actual lab environments issue.

## Deploying

```bash
cd client && npm run build && cd ..
firebase deploy
```

This deploys hosting, Firestore rules, storage rules, and Cloud Functions
together.

## What's still a stub

- **Lab environments** — the "Launch environment" button and connection
  panel are UI-complete but not wired to a real container orchestrator.
  Plugging in a provisioning backend (Docker/Kubernetes-based) is the next
  step to make labs fully live rather than static challenge descriptions.
- **Weekly/monthly leaderboard windows** — the leaderboard currently ranks
  by all-time XP; a Cloud Function scheduled job that snapshots XP deltas
  per week/month would be needed for true time-windowed rankings.
- **Admin console** — labs/events/writeups are seeded via script or the
  Firebase console directly; there's no in-app admin UI yet.
=======
## Hi there 👋

<!--
**learnbyhack/learnbyhack** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
-->
>>>>>>> 75ee094dd8997e332cad99e5b3bb77286b9ac847
