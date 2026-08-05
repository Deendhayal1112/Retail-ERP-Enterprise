/**
 * StartupTimelinePanel.js
 * Retail ERP Enterprise — Boot Stage Timeline Visualization Panel
 */

"use strict";

const STAGE_ICONS = [
  `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
  `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`,
  `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>`,
  `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
];

export default class StartupTimelinePanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card startup-timeline-panel";
    card.style.gridColumn = "1 / -1"; // Span full width

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
          Startup Timeline
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Complete</span>
      </div>
      <div class="startup-timeline-stages"></div>
      <div class="startup-timeline-totals" style="display:flex;gap:24px;margin-top:16px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.06);">
        <div><span class="stat-label">Total Boot</span><span class="stat-value val-total-boot" style="display:block;font-size:20px;font-weight:700;color:#1E293B;">-- ms</span></div>
        <div><span class="stat-label">First Paint</span><span class="stat-value val-first-paint" style="display:block;font-size:20px;font-weight:700;color:#2563EB;">-- ms</span></div>
        <div><span class="stat-label">Splash Duration</span><span class="stat-value val-splash" style="display:block;font-size:20px;font-weight:700;color:#7C3AED;">-- ms</span></div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const t = metrics.timeline;

    // Totals
    this.element.querySelector(".val-total-boot").textContent = `${t.totalBootMs} ms`;
    this.element.querySelector(".val-first-paint").textContent = `${t.firstPaintMs} ms`;
    this.element.querySelector(".val-splash").textContent = `${t.splashDurationMs} ms`;

    // Status badge
    const badge = this.element.querySelector(".status-badge");
    if (t.totalBootMs > 5000) {
      badge.textContent = "Slow";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Complete";
      badge.className = "metric-card-badge badge-normal status-badge";
    }

    // Stage bars
    const stagesContainer = this.element.querySelector(".startup-timeline-stages");
    const maxMs = t.stages.reduce((mx, s) => Math.max(mx, s.durationMs), 0) || 1;

    stagesContainer.innerHTML = t.stages.map((stage, i) => {
      const widthPct = Math.max(5, (stage.durationMs / maxMs) * 100);
      const isWarn = stage.durationMs > 450;
      const barColor = isWarn ? "var(--warning-500, #F59E0B)" : "var(--primary-500, #3B82F6)";

      return `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <div style="width:18px;color:${barColor};flex-shrink:0;">${STAGE_ICONS[i] || ""}</div>
          <span style="width:160px;flex-shrink:0;font-size:12px;font-weight:600;color:#475569;">${stage.name}</span>
          <div style="flex:1;height:8px;background:#F1F5F9;border-radius:4px;overflow:hidden;">
            <div style="width:${widthPct.toFixed(1)}%;height:100%;background:${barColor};border-radius:4px;transition:width 0.4s ease;"></div>
          </div>
          <span style="width:56px;text-align:right;font-size:12px;font-weight:700;color:${isWarn ? "#B45309" : "#1E293B"};">${stage.durationMs} ms</span>
        </div>`;
    }).join("");
  }
}
