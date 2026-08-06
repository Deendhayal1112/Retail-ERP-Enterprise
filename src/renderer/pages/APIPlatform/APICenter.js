/**
 * APICenter.js
 * Retail ERP Enterprise — Enterprise API Center Master View
 *
 * Coordinates tab toolbar navigation, loads IPC data from the main process,
 * and mounts sub-panels for Overview, Modules Explorer, Security, and Developer Platform.
 */

"use strict";

import APIOverviewPanel       from "./APIOverviewPanel.js";
import APIModulesPanel        from "./APIModulesPanel.js";
import APISecurityPanel       from "./APISecurityPanel.js";
import DeveloperPlatformPanel from "./DeveloperPlatformPanel.js";

export default class APICenter {
  constructor(options = {}) {
    this.options     = options;
    this.activeTab   = "overview";
    this.element     = null;

    // Data loaded from main process via IPC
    this.diagnostics  = {};
    this.endpoints    = [];
    this.modules      = [];
    this.apiKeys      = [];
    this.scopes       = [];
    this.auditLogs    = [];
    this.openAPISpec  = {};
    this.sdkInfo      = {};
    this.webhooks     = [];
    this.webhookEvents= [];
    this.deliveryLogs = [];
  }

  /**
   * Loads all required data from the main process via IPC.
   */
  async loadData() {
    try {
      const [
        diagnostics, endpoints, modules, apiKeys, scopes,
        auditLogs, openAPISpec, sdkInfo, webhooks, webhookEvents, deliveryLogs
      ] = await Promise.all([
        window.api.ipc.invoke("api-platform:get-diagnostics"),
        window.api.ipc.invoke("api-platform:get-endpoints"),
        window.api.ipc.invoke("api-platform:get-modules"),
        window.api.ipc.invoke("api-platform:get-keys"),
        window.api.ipc.invoke("api-platform:get-scopes"),
        window.api.ipc.invoke("api-platform:get-audit-logs"),
        window.api.ipc.invoke("api-platform:get-openapi-spec"),
        window.api.ipc.invoke("api-platform:get-sdk-info"),
        window.api.ipc.invoke("api-platform:get-webhooks"),
        window.api.ipc.invoke("api-platform:get-webhook-events"),
        window.api.ipc.invoke("api-platform:get-webhook-logs")
      ]);

      this.diagnostics   = diagnostics   || {};
      this.endpoints     = endpoints     || [];
      this.modules       = modules       || [];
      this.apiKeys       = apiKeys       || [];
      this.scopes        = scopes        || [];
      this.auditLogs     = auditLogs     || [];
      this.openAPISpec   = openAPISpec   || {};
      this.sdkInfo       = sdkInfo       || {};
      this.webhooks      = webhooks      || [];
      this.webhookEvents = webhookEvents || [];
      this.deliveryLogs  = deliveryLogs  || [];
    } catch (err) {
      console.error("[APICenter] Failed to load platform data:", err);
    }
  }

  async render() {
    const container = document.createElement("div");
    container.className = "api-center-container";

    await this.loadData();

    // ─── Header ──────────────────────────────────────────────────────────────
    const header = document.createElement("header");
    header.className = "api-center-header";
    header.innerHTML = `
      <div class="header-title-block">
        <h1 class="api-center-title">Enterprise API &amp; Developer Platform</h1>
        <p class="api-center-subtitle">
          Manage internal REST API registries, generate and rotate API keys, subscribe to event webhooks,
          explore endpoint specifications, and integrate using the Enterprise SDK.
        </p>
      </div>
      <div class="header-status-chips">
        <div class="status-chip status-chip-green">
          <span class="chip-dot"></span> API ${this.diagnostics.status === "operational" ? "Operational" : "Check Status"}
        </div>
        <div class="status-chip">
          <span>${this.diagnostics.totalEndpoints || 0} Endpoints</span>
        </div>
        <div class="status-chip">
          <span>${this.diagnostics.activeAPIKeys || 0} Active Keys</span>
        </div>
      </div>
    `;
    container.appendChild(header);

    // ─── Tab Toolbar ─────────────────────────────────────────────────────────
    const toolbar = document.createElement("div");
    toolbar.className = "api-center-tab-toolbar";
    const tabs = [
      { key: "overview",   label: "Overview" },
      { key: "modules",    label: "API Explorer" },
      { key: "security",   label: "Security & Keys" },
      { key: "developer",  label: "Developer Platform" }
    ];
    tabs.forEach(t => {
      const btn = document.createElement("button");
      btn.className = `tab-btn ${this.activeTab === t.key ? "active" : ""}`;
      btn.setAttribute("data-tab", t.key);
      btn.textContent = t.label;
      btn.addEventListener("click", () => {
        this.activeTab = t.key;
        this._updateTabContent();
      });
      toolbar.appendChild(btn);
    });
    container.appendChild(toolbar);

    // ─── Content Area ─────────────────────────────────────────────────────────
    const contentArea = document.createElement("div");
    contentArea.className = "api-center-content-area";
    container.appendChild(contentArea);

    this.element = container;
    this._updateTabContent();

    return container;
  }

  _updateTabContent() {
    const contentArea = this.element.querySelector(".api-center-content-area");
    if (!contentArea) return;
    contentArea.innerHTML = "";

    // Sync tab button states
    this.element.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === this.activeTab);
    });

    if (this.activeTab === "overview") {
      const panel = new APIOverviewPanel({ diagnostics: this.diagnostics });
      contentArea.appendChild(panel.render());

    } else if (this.activeTab === "modules") {
      const panel = new APIModulesPanel({
        endpoints: this.endpoints,
        modules:   this.modules,
        getSample: async (endpointId, language) => {
          return await window.api.ipc.invoke("api-platform:get-sample-code", { endpointId, language });
        }
      });
      contentArea.appendChild(panel.render());

    } else if (this.activeTab === "security") {
      const panel = new APISecurityPanel({
        apiKeys:   this.apiKeys,
        scopes:    this.scopes,
        auditLogs: this.auditLogs,
        onGenerate: async (data) => {
          const result = await window.api.ipc.invoke("api-platform:generate-key", data);
          await this.loadData();
          this._updateTabContent();
          return result;
        },
        onRevoke: async (id) => {
          await window.api.ipc.invoke("api-platform:revoke-key", id);
          window.Toast?.show("API key revoked successfully.", "success", 3000);
          await this.loadData();
          this._updateTabContent();
        }
      });
      contentArea.appendChild(panel.render());

    } else if (this.activeTab === "developer") {
      const panel = new DeveloperPlatformPanel({
        webhooks:      this.webhooks,
        webhookEvents: this.webhookEvents,
        deliveryLogs:  this.deliveryLogs,
        openAPISpec:   this.openAPISpec,
        sdkInfo:       this.sdkInfo,
        onRegisterWebhook: async (data) => {
          const res = await window.api.ipc.invoke("api-platform:register-webhook", data);
          if (res?.success) {
            window.Toast?.show("Webhook registered successfully.", "success", 3000);
            await this.loadData();
            this._updateTabContent();
          }
        },
        onDeleteWebhook: async (id) => {
          await window.api.ipc.invoke("api-platform:delete-webhook", id);
          window.Toast?.show("Webhook subscription deleted.", "success", 3000);
          await this.loadData();
          this._updateTabContent();
        },
        onSimulate: async ({ id, event }) => {
          const res = await window.api.ipc.invoke("api-platform:simulate-webhook", { id, event });
          await this.loadData();
          return res;
        }
      });
      contentArea.appendChild(panel.render());
    }
  }
}
