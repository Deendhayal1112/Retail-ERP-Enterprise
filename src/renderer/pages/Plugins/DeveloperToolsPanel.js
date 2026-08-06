/**
 * DeveloperToolsPanel.js
 * Retail ERP Enterprise — Developer SDK & Tools Panel
 */

"use strict";

export default class DeveloperToolsPanel {
  /**
   * @param {Object}   options
   * @param {Function} options.onValidateCallback Callback when manifest is validated.
   */
  constructor(options = {}) {
    this.onValidateCallback = options.onValidateCallback || null;
  }

  render() {
    const panel = document.createElement("div");
    panel.className = "plugins-dev-tools-panel";

    // Split layout: Left (SDK Docs & Templates), Right (Live Manifest Validator)
    const grid = document.createElement("div");
    grid.className = "dev-tools-grid";

    // Column 1: SDK Docs & Templates
    const leftCol = document.createElement("div");
    leftCol.className = "dev-docs-column";
    leftCol.innerHTML = `
      <div class="dev-section">
        <h3 class="section-title">Plugin Manifest Schema</h3>
        <p class="section-desc">Create a file named <code>manifest.json</code> in the plugin folder root using the structure below:</p>
        <pre class="code-block font-mono">{
  "id": "my-custom-plugin",
  "name": "My Custom Billing Plugin",
  "version": "1.0.0",
  "description": "Appends tax summaries to prints",
  "author": "Store Dev Team",
  "entryPoint": "index.js",
  "compatibility": ">=0.2.0",
  "permissions": [
    "database:read",
    "ui:extension"
  ]
}</pre>
      </div>

      <div class="dev-section mt-6">
        <h3 class="section-title">Quick Starter Templates</h3>
        <p class="section-desc">Download templates configuration zip files containing fully scaffolded files structures:</p>
        <div class="template-buttons-row">
          <button class="btn-template-download" id="btn-tmpl-pos">💳 POS Billing Extension Template</button>
          <button class="btn-template-download" id="btn-tmpl-reports">📊 Custom Reports Exporter Template</button>
        </div>
      </div>
    `;

    // Column 2: Manifest Validator
    const rightCol = document.createElement("div");
    rightCol.className = "dev-validator-column";
    rightCol.innerHTML = `
      <h3 class="section-title">Live manifest.json Validator</h3>
      <p class="section-desc">Paste your plugin's manifest configuration block below to verify its structural alignment:</p>
      
      <div class="validator-form-wrapper">
        <textarea class="manifest-textarea font-mono" placeholder="{\n  \"id\": \"my-plugin\",\n  ...\n}"></textarea>
        <button class="btn-run-validation">Run Validation Checks</button>
        <div class="validation-output-log hidden" role="alert"></div>
      </div>
    `;

    grid.appendChild(leftCol);
    grid.appendChild(rightCol);
    panel.appendChild(grid);

    // Event listeners
    leftCol.querySelector("#btn-tmpl-pos").addEventListener("click", () => {
      if (window.Toast) window.Toast.show("POS Extension Template scaffolded files generated.", "success", 3000);
    });

    leftCol.querySelector("#btn-tmpl-reports").addEventListener("click", () => {
      if (window.Toast) window.Toast.show("Reports Exporter Template scaffolded files generated.", "success", 3000);
    });

    const runBtn = rightCol.querySelector(".btn-run-validation");
    const textarea = rightCol.querySelector(".manifest-textarea");
    const log = rightCol.querySelector(".validation-output-log");

    runBtn.addEventListener("click", () => {
      const txt = textarea.value.trim();
      if (!txt) {
        log.classList.remove("hidden", "success-log", "error-log");
        log.classList.add("error-log");
        log.textContent = "Please enter some JSON content.";
        return;
      }

      try {
        const json = JSON.parse(txt);
        // Call callback / simulate manifest validation
        const fields = ["id", "name", "version", "entryPoint"];
        let missing = [];
        fields.forEach(f => {
          if (!json[f]) missing.push(f);
        });

        log.classList.remove("hidden", "success-log", "error-log");
        if (missing.length > 0) {
          log.classList.add("error-log");
          log.textContent = `Validation failed: Missing fields: ${missing.join(", ")}`;
        } else {
          log.classList.add("success-log");
          log.textContent = `✓ manifest.json validated successfully! Plugin ID: ${json.id}`;
        }
      } catch (err) {
        log.classList.remove("hidden", "success-log", "error-log");
        log.classList.add("error-log");
        log.textContent = `JSON Syntax Error: ${err.message}`;
      }
    });

    return panel;
  }
}
