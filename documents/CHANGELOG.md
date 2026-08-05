# Changelog — Retail ERP Enterprise

All notable changes to the **Retail ERP Enterprise** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] - 2026-08-05
 
### Added
- **Version 0.2.0 Initialization**: Updated version configuration, environment variables, documentation templates, and configuration test parameters to target 0.2.0 development.

## [0.1.0] - 2026-08-04

### Added
- **Phase 0 (Project Initialization)**: Established project workspace layout, configurations, pre-commit pipelines, and test harnesses.
- **Phase 1 (Electron Foundation)**: Integrated secure main window configurations, sandboxed preload IPC bridges, custom window titlebars, and logging utilities.
- **Phase 2 (Enterprise Design System)**: Designed HSL responsive design systems and unified components (Outlined Floating Input fields, buttons, loaders) following Stripe/Apple guidelines.
- **Phase 3 (Login Module UI)**: Integrated the client-side login forms, validation schemas, loading covers, and offline status overlays.
- **Phase 4 (Database Layer)**: Configured SQLite structure schemas (`roles`, `permissions`, `users`, `company`, `settings`) and provisioned default admin profiles.
- **Phase 5 (Authentication Integration)**: Bridged renderer login inputs to the service controllers via whitelisted IPC handlers. Added session verification hooks.
- **Phase 6 (Testing & Hardening)**: 
  - Integrated 404/404 unit, integration, and E2E test scripts.
  - Implemented 15-minute brute-force locking guards.
  - Resolved Electron style-src CSP blockages.
  - Rebuilt binary dependencies (`better-sqlite3`, `bcrypt`) for native Electron ABI.
- **Phase 7 (Release Configuration)**:
  - Designed `electron-builder.yml` to package installers.
  - Added file association for `.reep` workspaces.
  - Created high-res shopping bag and lock shield flat vector icons in PNG and ICNS formats.
  - Completed production compiler package runs.

### Fixed
- Fixed stacked username and password borders layout clipping.
- Fixed floating label clipping cutouts in dark mode.
- Fixed style-src inline styling warnings inside `index.html`.
- Fixed main process SIGSEGV crashes caused by native module ABI mismatch.
- Added database connection graceful release hooks in `graceful-shutdown` and `will-quit` Electron events.
