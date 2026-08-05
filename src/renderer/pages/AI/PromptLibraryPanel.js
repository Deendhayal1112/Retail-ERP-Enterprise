/**
 * PromptLibraryPanel.js
 * Retail ERP Enterprise — AI Prompt Libraries Catalog Panel
 */

"use strict";

export default class PromptLibraryPanel {
  constructor(options = {}) {
    this.options = options;
    this.library = options.library || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "ai-center-card col-span-12";
    card.innerHTML = `
      <h3 class="ai-center-card-title">Prompt Template Libraries</h3>
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${this.library.map(p => `
          <div style="border:1px solid #E9EDF5; border-radius:12px; padding:16px; background-color:#F8FAFC;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong style="font-size:14px; color:#1E293B;">${p.title}</strong>
              <button class="use-prompt-btn" data-template="${p.template}" style="height:28px; padding:0 12px; border:1px solid #E0E7FF; background-color:#FFFFFF; color:#5B3DF5; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer;">
                Use Template
              </button>
            </div>
            <p style="margin:4px 0 10px 0; font-size:12px; color:#6B7280;">${p.description}</p>
            <code style="display:block; padding:10px; background-color:#FFFFFF; border:1px solid #E9EDF5; border-radius:6px; font-size:12px; color:#4B5563; overflow-x:auto;">
              ${p.template}
            </code>
          </div>
        `).join("")}
      </div>
    `;

    card.querySelectorAll(".use-prompt-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const temp = btn.getAttribute("data-template");
        if (this.options.onUseTemplate) {
          this.options.onUseTemplate(temp);
        }
      });
    });

    return card;
  }
}
