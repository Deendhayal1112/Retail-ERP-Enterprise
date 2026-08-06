/**
 * PluginPermissionsPanel.js
 * Retail ERP Enterprise — Plugin Permissions Scopes Panel
 */

"use strict";

export default class PluginPermissionsPanel {
  /**
   * @param {Object}   options
   * @param {Array}    options.plugins     List of installed plugins.
   * @param {Array}    options.scopes      List of all supported capability permissions scopes.
   * @param {Function} options.onSavePerms Callback when permissions are updated.
   */
  constructor(options = {}) {
    this.plugins = options.plugins || [];
    this.scopes = options.scopes || [];
    this.onSavePerms = options.onSavePerms || null;
    this.selectedPluginId = this.plugins[0]?.id || "";
  }

  render() {
    const panel = document.createElement("div");
    panel.className = "plugins-permissions-panel";

    if (this.plugins.length === 0) {
      panel.innerHTML = `<div class="empty-state">No installed plugins available to configure capabilities.</div>`;
      return panel;
    }

    // Split layout: Left (Plugins select list), Right (Scopes checklist)
    const container = document.createElement("div");
    container.className = "permissions-layout-grid";

    // Left List Column
    const leftListCol = document.createElement("div");
    leftListCol.className = "permissions-selector-column";
    
    const selectorTitle = document.createElement("h3");
    selectorTitle.className = "selector-column-title";
    selectorTitle.textContent = "Select Plugin";
    leftListCol.appendChild(selectorTitle);

    const listUl = document.createElement("ul");
    listUl.className = "permissions-plugins-list";
    leftListCol.appendChild(listUl);

    // Right Form Column
    const rightFormCol = document.createElement("div");
    rightFormCol.className = "permissions-form-column";

    container.appendChild(leftListCol);
    container.appendChild(rightFormCol);
    panel.appendChild(container);

    const renderList = () => {
      listUl.innerHTML = "";
      this.plugins.forEach(p => {
        const li = document.createElement("li");
        li.className = `plugin-select-item ${p.id === this.selectedPluginId ? "selected" : ""}`;
        li.innerHTML = `
          <div class="select-item-title">${p.name}</div>
          <span class="select-item-meta font-mono">${p.id}</span>
        `;
        li.addEventListener("click", () => {
          this.selectedPluginId = p.id;
          renderList();
          renderForm();
        });
        listUl.appendChild(li);
      });
    };

    const renderForm = () => {
      const activePlugin = this.plugins.find(x => x.id === this.selectedPluginId);
      if (!activePlugin) {
        rightFormCol.innerHTML = `<div class="empty-state-inner">Please select a plugin from the list.</div>`;
        return;
      }

      rightFormCol.innerHTML = `
        <div class="form-header-row">
          <h3 class="form-title">Capability Scopes for ${activePlugin.name}</h3>
          <p class="form-subtitle font-mono">ID: ${activePlugin.id}</p>
        </div>
        <form class="permissions-checklist-form">
          <div class="scopes-checklist-container">
            <!-- Checklist items go here -->
          </div>
          <button type="submit" class="btn-save-permissions">Save Capabilities</button>
        </form>
      `;

      const checklistContainer = rightFormCol.querySelector(".scopes-checklist-container");
      this.scopes.forEach(scope => {
        const item = document.createElement("div");
        item.className = "scope-checklist-item";
        
        const hasScope = activePlugin.permissions && activePlugin.permissions.includes(scope.key);
        
        item.innerHTML = `
          <label class="scope-label-wrapper">
            <input type="checkbox" name="scope-key" value="${scope.key}" ${hasScope ? "checked" : ""} />
            <div class="scope-text">
              <span class="scope-title">${scope.label} <code class="font-mono text-muted">${scope.key}</code></span>
              <span class="scope-desc">${scope.description}</span>
            </div>
          </label>
        `;
        checklistContainer.appendChild(item);
      });

      // Submit listener
      const form = rightFormCol.querySelector(".permissions-checklist-form");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkboxes = form.querySelectorAll("input[name='scope-key']:checked");
        const list = Array.from(checkboxes).map(x => x.value);
        
        if (this.onSavePerms) {
          this.onSavePerms(activePlugin.id, list);
        }
      });
    };

    renderList();
    renderForm();

    return panel;
  }
}
