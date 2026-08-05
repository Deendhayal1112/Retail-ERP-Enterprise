/**
 * EnterpriseAICenter.js
 * Retail ERP Enterprise — AI Assistant portal coordinator
 */

"use strict";

import AssistantPanel      from "./AssistantPanel.js";
import PromptLibraryPanel  from "./PromptLibraryPanel.js";
import CommandCenterPanel  from "./CommandCenterPanel.js";
import InsightsPanel       from "./InsightsPanel.js";

export default class EnterpriseAICenter {
  constructor(options = {}) {
    this.options = options;
    this.activeTab = "chat";
    this.history = [];
    this.library = [];
    this.commands = [];
    this.context = {};
    this.providers = [];
    this.element = null;
  }

  async loadInitialData() {
    try {
      this.history = await window.api.ipc.invoke("ai:get-chat-history");
      this.library = await window.api.ipc.invoke("ai:get-prompt-library");
      this.commands = await window.api.ipc.invoke("ai:get-commands");
      this.context = await window.api.ipc.invoke("ai:get-context");
      this.providers = await window.api.ipc.invoke("ai:get-providers");
    } catch (err) {
      console.error("Failed to load AI platform datasets:", err);
    }
  }

  async render() {
    const container = document.createElement("div");
    container.className = "ai-center-layout";

    await this.loadInitialData();

    // 1. Header
    const header = document.createElement("header");
    header.className = "ai-center-header";
    header.innerHTML = `
      <div>
        <h1 class="ai-center-title">Enterprise AI Center</h1>
        <p class="ai-center-subtitle">Query suggested business insights, copy prompts templates, and configure LLM cognitive provider API scopes.</p>
      </div>
    `;
    container.appendChild(header);

    // 2. Tabs toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "ai-center-tabs-toolbar";
    toolbar.innerHTML = `
      <button class="ai-center-tab-btn ${this.activeTab === "chat" ? "active" : ""}" data-tab="chat">AI Assistant</button>
      <button class="ai-center-tab-btn ${this.activeTab === "commands" ? "active" : ""}" data-tab="commands">Command Center</button>
      <button class="ai-center-tab-btn ${this.activeTab === "library" ? "active" : ""}" data-tab="library">Prompt Library</button>
      <button class="ai-center-tab-btn ${this.activeTab === "insights" ? "active" : ""}" data-tab="insights">Providers & Context</button>
    `;

    toolbar.querySelectorAll(".ai-center-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.updateActiveTabContent();
      });
    });
    container.appendChild(toolbar);

    // 3. Content workspace grid
    const mainGrid = document.createElement("div");
    mainGrid.className = "ai-center-content-grid";
    container.appendChild(mainGrid);

    this.element = container;
    this.updateActiveTabContent();

    return container;
  }

  async updateActiveTabContent() {
    const mainGrid = this.element.querySelector(".ai-center-content-grid");
    if (!mainGrid) return;
    
    mainGrid.innerHTML = "";

    this.element.querySelectorAll(".ai-center-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === this.activeTab);
    });

    if (this.activeTab === "chat") {
      const panel = new AssistantPanel({
        history: this.history,
        onSubmit: async (prompt) => {
          const result = await window.api.ipc.invoke("ai:query-chat", prompt);
          if (result && result.success) {
            this.history = result.history;
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "library") {
      const panel = new PromptLibraryPanel({
        library: this.library,
        onUseTemplate: (template) => {
          this.activeTab = "chat";
          this.updateActiveTabContent().then(() => {
            const input = this.element.querySelector(".chat-input-box");
            if (input) {
              input.value = template;
              input.focus();
            }
          });
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "commands") {
      const panel = new CommandCenterPanel({
        commands: this.commands,
        onRunCommand: async (trigger) => {
          const result = await window.api.ipc.invoke("ai:run-command", trigger, "demo");
          if (result && result.success) {
            alert(result.message);
          }
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "insights") {
      const panel = new InsightsPanel({
        context: this.context,
        providers: this.providers,
        onToggleProvider: async (id) => {
          const result = await window.api.ipc.invoke("ai:toggle-provider", id);
          if (result && result.success) {
            this.providers = result.providers;
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    }
  }
}
