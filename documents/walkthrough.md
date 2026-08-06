# Walkthrough - Enterprise Plugin Framework (Phase 10, Step 1)

This walkthrough documents the complete implementation of the **Enterprise Plugin Framework** architecture, user panels, permissions management, and developer tools.

---

## 1. Main Process Subsystems (`src/main/plugins/`)
We created the core backend coordinator modules that simulate sandboxed plugin management:
*   **[PluginRegistry.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/plugins/PluginRegistry.js)**: Declares lists of installed and available plugins with compatibility selectors, versions, ratings, and permission scopes database.
*   **[PluginPermissionManager.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/plugins/PluginPermissionManager.js)**: Controls access checks (DB read/write, filesystem write, outgoing network, and UI modifications).
*   **[PluginManifestValidator.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/plugins/PluginManifestValidator.js)**: Checks object manifest structures for required metadata fields.
*   **[PluginLoader.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/plugins/PluginLoader.js)**: Governs mock startup discovery, loading maps, and unloading hooks.
*   **[PluginManager.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/plugins/PluginManager.js)**: Orchestrates registries, loaders, permissions, and diagnostic telemetry reports.

---

## 2. IPC Bindings & Bridge whitelists
*   **[plugins.ipc.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/ipc/plugins.ipc.js)**: Registers whitelisted handlers to communicate safe calls over `plugins:get-installed`, `plugins:get-available`, `plugins:install`, `plugins:toggle`, `plugins:update-permissions`, and `plugins:get-diagnostics`.
*   **[preload.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/main/preload/preload.js)**: Exposes these secure invoking methods in the context bridge layer.

---

## 3. Renderer Dashboards UI Panels (`src/renderer/pages/Plugins/`)
We created a beautiful tabbed view for users and creators:
*   **[PluginCenter.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/renderer/pages/Plugins/PluginCenter.js)**: Mounts the main container and controls navigation switches.
*   **[InstalledPluginsPanel.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/renderer/pages/Plugins/InstalledPluginsPanel.js)**: Renders lists of installed plugins with active toggles.
*   **[PluginRegistryPanel.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/renderer/pages/Plugins/PluginRegistryPanel.js)**: Simulates downloads of store items.
*   **[PluginPermissionsPanel.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/renderer/pages/Plugins/PluginPermissionsPanel.js)**: Offers checklists to customize security API boundaries.
*   **[DeveloperToolsPanel.js](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/renderer/pages/Plugins/DeveloperToolsPanel.js)**: Hosts manifest documentation, zip scaffolding generation, and a live input JSON format validator.
*   **[PluginCenter.css](file:///Users/deendhayalrr/Documents/Retail%20ERP%20Enterprise/src/renderer/pages/Plugins/PluginCenter.css)**: Links design tokens styling.

---

## 4. Verification and Push
*   **Compilation:** Styles compiled successfully through Tailwind `npm run css:build`.
*   **Repository status:** Staged and pushed to GitHub main branch.
