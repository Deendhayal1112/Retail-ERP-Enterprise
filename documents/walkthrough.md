# Walkthrough - Enterprise Multi-Company Architecture (Phase 10, Step 2)

This walkthrough documents the complete implementation of the **Enterprise Multi-Company Support Architecture**, workspace context switching selectors, role access permission matrices, and isolated settings configs.

---

## 1. Main Process Subsystems (`src/main/companies/`)
We created the core backend coordinator modules that simulate multi-company partition configurations:
*   **[CompanyRegistry.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/companies/CompanyRegistry.js)**: Declares registered company entities (ABC Textiles New Delhi, ABC Textiles Chennai, ABC Global Exports) with base currencies, GSTINs, and default flags.
*   **[CompanyContextManager.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/companies/CompanyContextManager.js)**: Holds workspace context parameters (cash balance indices, transaction records).
*   **[CompanyPermissionManager.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/companies/CompanyPermissionManager.js)**: Configures roles matrices (Admin, Manager, Employee scopes) for each workspace.
*   **[CompanySwitcher.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/companies/CompanySwitcher.js)**: Governs active company pointer, triggers cache invalidations, and context updates.
*   **[CompanyManager.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/companies/CompanyManager.js)**: Central coordinator bootstrapping the multi-company subsystem.

---

## 2. IPC Bindings & Bridge whitelists
*   **[companies.ipc.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/ipc/companies.ipc.js)**: Registers whitelisted handlers to communicate safe calls over `companies:get-all`, `companies:get-active`, `companies:register`, `companies:update`, `companies:switch`, `companies:get-matrix`, and `companies:update-role-perms`.
*   **[preload.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/preload/preload.js)**: Exposes these secure invoking methods in the context bridge layer.

---

## 3. Renderer Dashboards UI Panels (`src/renderer/pages/Companies/`)
We created a beautiful tabbed view for corporate settings and switches:
*   **[CompanyManagementCenter.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/renderer/pages/Companies/CompanyManagementCenter.js)**: Mounts the main container and controls navigation switches.
*   **[CompanyOverviewPanel.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/renderer/pages/Companies/CompanyOverviewPanel.js)**: Renders lists of registered corporate profiles.
*   **[CompanySwitcherPanel.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/renderer/pages/Companies/CompanySwitcherPanel.js)**: Simulates active company swaps with progress checklist notifications.
*   **[CompanySettingsPanel.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/renderer/pages/Companies/CompanySettingsPanel.js)**: Form edit views to change address details, base currencies, and GST numbers.
*   **[CompanyPermissionsPanel.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/renderer/pages/Companies/CompanyPermissionsPanel.js)**: Interactive permissions table matrix mapping roles checkboxes.
*   **[CompanyManagementCenter.css](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/renderer/pages/Companies/CompanyManagementCenter.css)**: Links design tokens styling.

---

## 4. Verification and Push
*   **Compilation:** Styles compiled successfully through Tailwind `npm run css:build`.
*   **Repository status:** Staged and pushed to GitHub main branch.
