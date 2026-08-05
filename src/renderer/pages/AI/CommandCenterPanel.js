/**
 * CommandCenterPanel.js
 * Retail ERP Enterprise — AI command shortcuts console
 */

"use strict";

export default class CommandCenterPanel {
  constructor(options = {}) {
    this.options = options;
    this.commands = options.commands || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "ai-center-card col-span-12";
    card.innerHTML = `
      <h3 class="ai-center-card-title">Console Command Center</h3>
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="padding:12px; border:1px solid #E9EDF5; border-radius:8px; background-color:#F8FAFC; font-size:12px; color:#6B7280;">
          <strong>Quick Action:</strong> Enter triggers starting with <code>/</code> to execute fast database routing commands checks.
        </div>
        ${this.commands.map(cmd => `
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:12px;">
            <div>
              <code style="font-size:13px; font-weight:700; color:#5B3DF5;">${cmd.trigger}</code>
              <span style="font-size:12px; color:#6B7280; margin-left:12px;">${cmd.description}</span>
            </div>
            <button class="run-cmd-btn" data-trigger="${cmd.trigger}" style="height:32px; padding:0 12px; border:1px solid #E9EDF5; background:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; color:#1E293B;">
              Run Command
            </button>
          </div>
        `).join("")}
      </div>
    `;

    card.querySelectorAll(".run-cmd-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const trigger = btn.getAttribute("data-trigger");
        this.runCmd(trigger);
      });
    });

    return card;
  }

  async runCmd(trigger) {
    if (this.options.onRunCommand) {
      await this.options.onRunCommand(trigger);
    }
  }
}
