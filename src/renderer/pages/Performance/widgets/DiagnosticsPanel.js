/**
 * DiagnosticsPanel.js
 * Retail ERP Enterprise — Health score radial chart and diagnostic details panel
 */

"use strict";

export default class DiagnosticsPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card diagnostics-panel";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.alignItems = "center";
    card.style.justifyContent = "center";
    card.style.gap = "16px";

    card.innerHTML = `
      <h3 style="margin:0; font-size:14px; font-weight:700; color:#1E293B; align-self:flex-start;">Overall Health Score</h3>
      <div style="position:relative; width:120px; height:120px;">
        <svg viewBox="0 0 36 36" style="width:100%; height:100%; transform: rotate(-90deg);">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E2E8F0" stroke-width="3" />
          <path class="score-path" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10B981" stroke-dasharray="98, 100" stroke-width="3.2" stroke-linecap="round" style="transition: stroke-dasharray 0.4s ease;" />
        </svg>
        <div class="score-value" style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:800; color:#1E293B;">98</div>
      </div>
      <div style="display:flex; gap:16px; width:100%; justify-content:space-around; border-top:1px solid rgba(0,0,0,0.06); padding-top:12px; margin-top:8px;">
        <div style="text-align:center;"><span style="font-size:11px; color:#64748B; font-weight:600;">Slow Ops</span><span class="val-slow" style="display:block; font-size:16px; font-weight:800; color:#475569;">0</span></div>
        <div style="text-align:center;"><span style="font-size:11px; color:#64748B; font-weight:600;">Warnings</span><span class="val-warnings" style="display:block; font-size:16px; font-weight:800; color:#F59E0B;">0</span></div>
        <div style="text-align:center;"><span style="font-size:11px; color:#64748B; font-weight:600;">Crashes</span><span class="val-crashes" style="display:block; font-size:16px; font-weight:800; color:#EF4444;">0</span></div>
      </div>
    `;
    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const d = metrics.diagnostics;

    this.element.querySelector(".score-value").textContent = metrics.healthScore;
    this.element.querySelector(".score-path").setAttribute("stroke-dasharray", `${metrics.healthScore}, 100`);

    const path = this.element.querySelector(".score-path");
    if (metrics.healthScore < 60) path.setAttribute("stroke", "#EF4444");
    else if (metrics.healthScore < 85) path.setAttribute("stroke", "#F59E0B");
    else path.setAttribute("stroke", "#10B981");

    this.element.querySelector(".val-slow").textContent = d.slowOperationsCount;
    this.element.querySelector(".val-warnings").textContent = d.warningCount;
    this.element.querySelector(".val-crashes").textContent = d.crashReportsCount;
  }
}
