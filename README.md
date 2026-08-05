# Retail ERP Enterprise

**Version:** 0.2.0
**Platform:** Desktop — Windows · macOS · Linux
**Type:** Commercial · Offline-First · Enterprise Grade
**Module:** Professional Login System & Dashboard Foundations

---

## Overview

**Retail ERP Enterprise** is a commercial, offline-first desktop ERP application for retail business management. The application runs entirely on the local machine — no internet connection required for core operations.

Version **0.2.0** kicks off the development of the **Enterprise Dashboard** and POS integrations.

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Desktop Shell | Electron | 29.x | Cross-platform desktop wrapper |
| Local Server | Express.js | 4.x | Internal REST API |
| Database | SQLite (better-sqlite3) | 13.x | Offline-first local storage |
| UI Structure | HTML5 | — | Semantic markup |
| UI Styling | Tailwind CSS | v4.x | Utility-first design system |
| UI Logic | Vanilla JavaScript | ES2022 | Client-side interactions |
| Password Security | bcryptjs | 2.x | Secure password hashing |
| Session Tokens | jsonwebtoken | 9.x | JWT-based authentication |
| Validation | joi | 17.x | Input schema validation |
| Logging | winston | 3.x | Structured application logs |
| Build & Package | Electron Builder | 24.x | Installer for Win/Mac/Linux |

---

## Architecture

```
Retail ERP Enterprise v0.2.0
│
├── Electron Main Process  (src/main/)
│   ├── main.js            Entry point
│   ├── managers/          Window & lifecycle management
│   ├── preload/           Secure IPC context bridge
│   ├── ipc/               IPC event handlers
│   └── services/          Main-process services
│
├── Express.js Local Server  (src/backend/)
│   ├── routes/            API endpoint definitions
│   ├── controllers/       Request handling logic
│   ├── services/          Business logic layer
│   ├── repositories/      Database access layer
│   ├── middlewares/       Auth, rate-limit, logging
│   └── validators/        Joi input schemas
│
├── SQLite Database  (database/)
│   ├── migrations/        Schema version files
│   ├── schema/            Table definitions
│   └── seed/              Default data (admin user)
│
├── Renderer / Frontend  (src/renderer/)
│   ├── pages/login/       Professional Login UI
│   ├── components/        Reusable UI components
│   ├── styles/            Tailwind CSS v4 + tokens
│   └── utils/             Client-side helpers
│
└── Shared Utilities  (src/shared/)
    ├── constants/         App-wide constants
    ├── errors/            Custom error classes
    ├── helpers/           Pure utility functions
    ├── logger/            Winston logger setup
    ├── security/          Crypto & hashing helpers
    └── validation/        Shared Joi schemas
```

---

## Project Structure

```
Retail-ERP-Enterprise/
├── assets/                    Static assets (icons, images, fonts)
├── build/                     Electron Builder resources
├── database/                  SQLite files (migrations, schema, seed)
├── logs/                      Runtime logs (application, error, security)
├── src/
│   ├── config/                App, auth, database, license configs
│   ├── main/                  Electron main process
│   ├── backend/               Express.js API server
│   ├── renderer/              Frontend (HTML + CSS + JS)
│   └── shared/                Shared utilities
├── tests/                     Test suites
├── .env.example               Environment variable template
├── electron-builder.yml       Build & packaging configuration
├── package.json               Project manifest
└── README.md                  This file
```

---

## Getting Started

### Prerequisites

| Requirement | Version |
|------------|---------|
| Node.js | >= 18.0.0 |
| npm | >= 9.0.0 |
| macOS / Windows / Linux | Latest stable |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Deendhayal1112/Retail-ERP-Enterprise.git
cd Retail-ERP-Enterprise

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env and set your SESSION_SECRET and JWT_SECRET

# 4. Start in development mode
npm run dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Electron + CSS watcher in parallel |
| `npm start` | Start Electron (production mode) |
| `npm run css:build` | Compile Tailwind CSS (minified) |
| `npm run css:watch` | Watch and compile Tailwind CSS |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run build` | Build production installer |
| `npm run build:win` | Build Windows installer (NSIS) |
| `npm run build:mac` | Build macOS installer (DMG) |
| `npm run build:linux` | Build Linux installer (AppImage) |
| `npm run clean` | Remove dist/out/release directories |

---

## Environment Variables

See [.env.example](.env.example) for all required variables.

| Variable | Description |
|----------|-------------|
| `APP_ENV` | `development` or `production` |
| `SERVER_PORT` | Local Express server port (default: 3721) |
| `DB_NAME` | SQLite database filename |
| `SESSION_SECRET` | Session signing secret (min 64 chars) |
| `JWT_SECRET` | JWT signing secret (min 64 chars) |
| `BCRYPT_ROUNDS` | Password hashing rounds (default: 12) |
| `LOG_LEVEL` | Logging verbosity (debug/info/warn/error) |

---

## Development Roadmap

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 0** | Project Initialization | ✅ Completed |
| **Phase 1** | Electron Foundation | ✅ Completed |
| **Phase 2** | Enterprise UI Design System | ✅ Completed |
| **Phase 3** | Login Module UI | ✅ Completed |
| **Phase 4** | Database Layer | ✅ Completed |
| **Phase 5** | Authentication Services | ✅ Completed |
| **Phase 6** | Quality Assurance & Testing | ✅ Completed |
| **Phase 7** | Packaging & Release | ✅ Completed |

See [RELEASE_NOTES.md](RELEASE_NOTES.md) and [CHANGELOG.md](CHANGELOG.md) for version release details.

---

## Security Notes

- Passwords hashed with bcryptjs (12 rounds minimum)
- JWT tokens used for session management
- Login endpoint rate-limited (5 attempts per 15 minutes)
- All HTTP headers secured via helmet
- SQLite database runs in WAL mode for reliability
- Never commit `.env` to version control

---

## License

MIT © 2026 Retail ERP Enterprise Team — See [LICENSE](LICENSE)

