# Release Notes — Retail ERP Enterprise v0.2.0

**Release Title:** Version 0.2.0 Preparation & Metadata Alignment  
**Release Date:** August 5, 2026  
**Version:** v0.2.0  
**License:** MIT  

---

## Version 0.2.0 Objectives & Roadmap

Version `v0.2.0` kicks off the development of the **Enterprise Dashboard & Billing POS Foundations**.

### Key Objectives
1. **Interactive Dashboard**: Build the post-login summary metrics panel for administrators, managers, and cashiers.
2. **Sales Register & POS Layout**: Prototype billing page structures, receipt styling, and local sales logs.
3. **Roles & Permission Control UI**: Enable editing user accessibility constraints in real-time.

---

## Release History

### [v0.1.0] - Official Secure Authentication System Release (August 4, 2026)

Version `v0.1.0` represents the first official stable release of **Retail ERP Enterprise**. This release delivers the **Enterprise Authentication System**—a hardened, offline-first login module designed to secure local retail terminals.

The application shell runs entirely locally in a secure, sandbox-isolated Electron window, utilizing an internal Express API server and a high-performance SQLite database layer.

---

## Key Features

* **Outlined Floating Label UI**: Premium visual hierarchy built on Stripe Design System principles, featuring custom dark/light color match themes and high-contrast accessibility.
* **Electron Preload Sandbox Isolation**: Fully sandboxed renderer process interacting with the main process exclusively via a whitelisted preload bridge.
* **Strict IPC Origin Audits**: Active origin frame verification (`event.senderFrame` validations) preventing cross-scripting IPC injections.
* **Brute-Force Lockout Defense**: In-memory failed login tracking that blocks users for 15 minutes after 5 consecutive failures.
* **High-Performance SQLite Core**: SQLite WAL (Write-Ahead Logging) database engine with customized synchronous normal pragmas for concurrent transactions.
* **Centralized Configuration Scheme**: Single JSON-Schema validated config validator protecting the system from boot anomalies.
* **Auto-Close Connection Lifecycle**: Integrated SQLite release hooks bound to Electron process shutdown and quit sequences.

---

## System Requirements

| Specification | Minimum Requirement | Recommended |
|---------------|---------------------|-------------|
| **Operating System** | macOS 11+, Windows 10+, Ubuntu 20.04+ | Latest OS release |
| **Node.js runtime** | `>= 18.0.0` | `20.x LTS` |
| **Memory** | 4 GB RAM | 8 GB RAM |
| **Disk Space** | 200 MB | 500 MB (for local store DB grow) |

---

## Installation Guide

### From Installer Packages
1. **macOS**: Double-click `Retail ERP Enterprise-0.1.0-arm64-mac.dmg` or `x64-mac.dmg`. Drag **Retail ERP Enterprise** to the **Applications** folder.
2. **Windows**: Double-click `Retail ERP Enterprise-Setup-0.1.0-x64.exe` to run the installer, or execute the portable binary.
3. **Linux**: Make the `Retail ERP Enterprise-0.1.0-x64.AppImage` executable and run:
   ```bash
   chmod +x "Retail ERP Enterprise-0.1.0-x64.AppImage"
   ./"Retail ERP Enterprise-0.1.0-x64.AppImage"
   ```

### From Source Code
```bash
# Install dependencies
npm install

# Rebuild native modules for Electron ABI compatibility
npx --yes @electron/rebuild

# Create environment config
cp .env.example .env

# Launch development environment
npm run dev
```

---

## First Login Instructions

### Default Admin Credentials
When launching the application on a clean terminal, the database automatically provisions a default administrator profile:
* **Username**: `admin`
* **Password**: `admin123`

> [!IMPORTANT]
> Change the default admin password immediately inside your application dashboard or database parameters after the first launch.

---

## Security Notes

1. **Password Encryption**: Stored passwords are salted and hashed using `bcryptjs` (12 work factors).
2. **Session Persistence**: Sessions use JSON Web Tokens (JWT) signed by a 64-character server key.
3. **Connection Security**: The Electron environment executes with disabled `remoteModule` and forced `webSecurity` features. Inline scripts are completely blocked using standard CSP tags.

---

## Troubleshooting Guide

### 1. Segmentation Fault (SIGSEGV) on Launch
* **Cause**: Node-Electron ABI module mismatch for native modules (`better-sqlite3` or `bcrypt`).
* **Fix**: Run `npx @electron/rebuild` to recompile native addons.

### 2. SQLite Database File Locks
* **Cause**: Unclean shutdowns leaving active transaction files.
* **Fix**: Close all instances. The database lifecycle hooks will automatically checkpoint and clean up WAL structures.

---

## Future Roadmap

* **Phase 8**: Billing & POS Checkout Module
* **Phase 9**: Real-time Inventory & Stock Tracking
* **Phase 10**: Advanced Enterprise Analytics & Reporting Engine
