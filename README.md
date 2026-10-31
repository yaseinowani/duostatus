<div align="center">

# DuoStats 🦉✨

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%252B-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![ToS Compliant](https://img.shields.io/badge/ToS-Compliant%20Architecture-emerald)](https://github.com/duolingo)

**A modern, ToS-compliant, privacy-first unofficial learning stats, streak tracker, and rival comparison dashboard for Duolingo.**

[Features](#-key-features) · [Architecture](#-architecture--tos-safeguards) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Disclaimer](#-disclaimer)

</div>

---

## 🌟 Overview

**DuoStats** is a feature-rich, standalone open-source fan project designed for Duolingo learners. It empowers users to track cumulative XP gains, continuous daily streaks, multi-language course breakdowns, and historical activity trends through a clean, Nordic-inspired modern UI.

Unlike unauthorized web scrapers, DuoStats operates strictly under an **on-demand verification model with robust rate-limiting and local caching**, ensuring full respect for Duolingo's servers and user privacy.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **⚔️ Rival Comparison (VS Mode)** | Head-to-head comparison of two Duolingo learners across XP, streaks, weekly gains, and shared courses with visual progress meters. |
| **🟩 GitHub-Style Heatmap** | Yearly/monthly activity calendar grid showing daily XP gains and study consistency with real-time tooltips. |
| **📊 Multi-Language Radar Chart** | Switch between multi-dimensional skill radar charts and proportional donut charts for language mastery. |
| **🔍 Smart Autocomplete & Pinned Favorites** | Floating search suggestions with keyboard navigation (`↑`/`↓`/`Enter`) and one-click bookmarking (`★`). |
| **➕ Manual Safe Mode Logging** | Option to securely log daily XP and streak gains locally without hitting external profile endpoints. |
| **🌙 Dark / Light Modern Theme** | Fully responsive Nord-inspired aesthetic with smooth framer-motion kinetics and tactile Duolingo-like micro-interactions. |

---

## 🛡️ Architecture & ToS Safeguards

DuoStats is engineered with strict ethical constraints to prevent abuse:
- **No Crawlers or Bots**: Zero background background sweepers or automated cron scrapers.
- **15-Minute Cache TTL**: Aggressively caches fetched public profile responses to protect Duolingo API endpoints.
- **Client IP Rate Limiting**: Enforces a strict threshold (max 15 requests per minute per IP) to block spam and automated requests.
- **Immediate Opt-Out**: Built-in data removal tool allowing any user to instantly purge their cached snapshots.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express, TypeScript (`server.ts`)
- **Testing**: Node.js native test runner (`node --test`)
- **Build Tool**: Vite

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/duostats.git
   cd duostats
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**  
   Navigate to `http://localhost:3000`

---

## 🔌 API Reference

The backend provides secure JSON endpoints with built-in rate limiting and fan project headers.

### `GET /api/user/:username`
Fetches the public Duolingo profile and records a differential snapshot.
- **Query Params:** `force=true` (bypasses cache if cooldown permits)
- **Response Example:**
  ```json
  {
    "user": {
      "username": "tanaka_learning",
      "name": "田中 健太",
      "totalXp": 96829,
      "streak": 416,
      "courses": [...]
    },
    "metrics": {
      "weeklyXp": 992,
      "isMeasured": true
    }
  }
  ```

### `POST /api/user/:username/log`
Records a manual study session.
- **Body:** `{ "xp": 150, "streak": 417, "language": "es" }`

### `POST /api/opt-out`
Permanently purges cached user records and snapshots.
- **Body:** `{ "username": "my_username" }`

---

## ⚖️ Legal Disclaimer

> **Unofficial Fan Project**: DuoStats is an independent open-source fan project. It is **not** affiliated with, endorsed, sponsored, or officially connected by Duolingo, Inc.  
> **Trademarks**: "Duolingo" and associated logos/characters are registered trademarks of Duolingo, Inc. All UI designs and analytical algorithms are original creations.

---

## 📜 License

Distributed under the **Apache 2.0 License**. See [LICENSE](LICENSE) for details.
