/**
 * BuildPipelinePanel.js
 * Retail ERP Enterprise — Build pipeline stage progress tracking panel
 */

"use strict";

export default class BuildPipelinePanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card build-pipeline-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Build Pipeline
        </h3>
        <span class="metric-card-badge badge-normal env-badge">Staging</span>
      </div>
      <div class="pipeline-progress-steps" style="display:flex; flex-direction:column; gap:12px; margin-top:8px;"></div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const p = metrics.pipeline;

    this.element.querySelector(".env-badge").textContent = metrics.activeBuildEnv;

    const steps = [
      { name: "Git Code Checkout", status: p.checkoutStatus, progress: 100 },
      { name: "Code Lint Auditing", status: p.lintStatus, progress: 100 },
      { name: "Automated Suite Tests", status: p.testStatus, progress: p.testStatus === "complete" ? 100 : 45 },
      { name: "Electron Executable Bundler", status: p.buildStatus, progress: p.buildStatus === "complete" ? 100 : 0 }
    ];

    const container = this.element.querySelector(".pipeline-progress-steps");
    container.innerHTML = steps.map(step => {
      let color = "#2563EB"; // Blue for running/processing
      if (step.status === "complete") color = "#10B981"; // Green
      else if (step.status === "failed") color = "#EF4444"; // Red
      else if (step.status === "skipped") color = "#64748B"; // Slate

      return `
        <div>
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px; font-weight:600; color:#475569;">
            <span>${step.name}</span>
            <span style="color:${color}; text-transform:uppercase;">${step.status}</span>
          </div>
          <div style="width:100%; height:6px; background:#F1F5F9; border-radius:3px; overflow:hidden;">
            <div style="width:${step.progress}%; height:100%; background:${color}; border-radius:3px; transition:width 0.4s ease;"></div>
          </div>
        </div>`;
    }).join("");
  }
}
