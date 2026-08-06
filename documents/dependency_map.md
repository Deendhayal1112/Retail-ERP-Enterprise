# Dependency Map - Retail ERP Enterprise v0.2

This document maps out the system dependencies, IPC communications, database connections, and component structure for Retail ERP Enterprise v0.2.

---

## 1. Directory Structure & Layer Map

The project implements a split-architecture with a desktop process shell, local internal Express server, local SQLite database, and vanilla DOM component renderer layer.

```
+-----------------------------------------------------------------------------+
|                                ELECTRON SHELL                               |
|                     (src/main/main.js & preload/preload.js)                 |
+----------------------+------------------------------+-----------------------+
                       |                              |
                       v                              v
+-----------------------------------+   +-------------------------------------+
|      EXPRESS LOCAL SERVER         |   |            VANILLA FRONTEND         |
|         (src/backend/)            |   |             (src/renderer/)         |
+----------------------+------------+   +----------------------+--------------+
                       |                                       |
                       v                                       v
+-----------------------------------+                  [ IPC Secure Bridge ]
|         SQLITE DATABASE           |                          |
|         (database/retail_erp.db)  |                          v
+-----------------------------------+                  [ IPC Main Handlers ]
```

---

## 2. Main Process Components (`src/main/`)
Responsible for window lifecycle, desktop integrations, system menus, background updates, and IPC routing.

- **[main.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/main.js)**: System bootstrap coordinator. Loads configs, initializes sqlite database connection pools, initializes background services, binds IPC channels, and creates the window wrapper.
- **[windowManager.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/managers/windowManager.js)**: Window creation constraints (minimum size, title bar customizations, devtools activation).
- **[preload.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/preload/preload.js)**: Exposes secure APIs to `window.api` for the renderer process. Ensures full context isolation.
- **Subsystem Managers**:
  - `background/` (BackgroundTaskManager, TaskExecutor)
  - `backup/` (BackupManager)
  - `security/` (SecurityManager, ComplianceManager)
  - `release/` (DistributionManager)
  - `rc/` (ReleaseCandidateManager)
  - `qa/` (UATManager, DefectManager)
  - `ai/` (AIManager, PromptManager)
  - `analytics/` (AnalyticsManager, KPIManager)

---

## 3. Express Internal Backend (`src/backend/`)
Serves as local microservices layer. Binds to `http://localhost:3721`.

- **[database.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/backend/database.js)**: Connects to `better-sqlite3`, enforces WAL mode, and triggers initial seeders.
- **Repositories (`src/backend/repositories/`)**:
  - `user.repository.js` -> Query `users` database table.
  - `company.repository.js` -> Query `companies` database table.
  - `settings.repository.js` -> Query `settings` database table.
  - `role.repository.js` -> Manage RBAC credentials.
- **Services (`src/backend/services/`)**:
  - `auth.service.js` -> Validate credentials, hash passwords via bcrypt, sign JWT tokens.
  - `session.service.js` -> Session validation and timeout.

---

## 4. Preload Context Bridge API (`preload.js`)
Exposes secure hooks to the renderer window environment:

```javascript
window.api = {
  auth: {
    login: (username, password) => ipcRenderer.invoke("auth:login", { username, password }),
    logout: () => ipcRenderer.invoke("auth:logout"),
    getSession: () => ipcRenderer.invoke("auth:get-session")
  },
  ipc: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
  }
}
```

---

## 5. Renderer Pages & Layout Navigation (`src/renderer/`)
Vanilla DOM modular interface coordinates route swaps and telemetry feeds.

- **[home.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/renderer/pages/home/home.js)**: Root listener executing routing logic. Maps routes (`dashboard`, `settings`, `security`, `deploy-center`, `performance`, `enterprise-qa`, `rc-center`, `ai-center`, `smart-analytics`) to modular view classes.
- **[DashboardLayout.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/renderer/layouts/DashboardLayout/DashboardLayout.js)**: Master shell containing sidebar, header, and 12-column grid layout wrapper.
- **[Sidebar.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/renderer/components/Sidebar/Sidebar.js)**: Left navigation, links route click actions to view coordinators.
- **[login.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/renderer/pages/login/login.js)**: Authenticaton form page handlers.
