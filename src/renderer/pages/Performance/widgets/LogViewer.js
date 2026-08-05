/**
 * LogViewer.js
 * Retail ERP Enterprise — Structured diagnostics search viewer
 */

"use strict";

export default class LogViewer {
  constructor() {
    this.element = null;
    this.logs = [];
    this.activeFilter = "all";
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-logs-panel log-viewer";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "12px";

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <h3 style="margin:0; font-size:15px; font-weight:700; color:#1E293B; display:flex; align-items:center; gap:8px;">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Structured Diagnostic Logs
        </h3>
        <div class="log-filter-buttons" style="display:flex; gap:6px;">
          <button class="filter-btn active" data-filter="all" style="font-size:11px; padding:3px 8px; border-radius:4px; border:1px solid rgba(0,0,0,0.08); background:#FFF; font-weight:600; cursor:pointer;">All</button>
          <button class="filter-btn" data-filter="app" style="font-size:11px; padding:3px 8px; border-radius:4px; border:1px solid rgba(0,0,0,0.08); background:#FFF; font-weight:600; cursor:pointer;">App</button>
          <button class="filter-btn" data-filter="database" style="font-size:11px; padding:3px 8px; border-radius:4px; border:1px solid rgba(0,0,0,0.08); background:#FFF; font-weight:600; cursor:pointer;">DB</button>
          <button class="filter-btn" data-filter="performance" style="font-size:11px; padding:3px 8px; border-radius:4px; border:1px solid rgba(0,0,0,0.08); background:#FFF; font-weight:600; cursor:pointer;">Perf</button>
          <button class="filter-btn" data-filter="error" style="font-size:11px; padding:3px 8px; border-radius:4px; border:1px solid rgba(0,0,0,0.08); background:#FFF; font-weight:600; cursor:pointer; color:#EF4444;">Errors</button>
        </div>
      </div>
      <div class="logs-list-wrapper logs-container" style="max-height:220px; overflow-y:auto; border-radius:8px; border:1px solid rgba(0,0,0,0.06); padding:8px; display:flex; flex-direction:column; gap:4px;"></div>
    `;

    this.element = card;

    // Bind filter listeners
    const buttons = card.querySelectorAll(".filter-btn");
    buttons.forEach(btn => {
      btn.style.transition = "all 0.2s ease";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        buttons.forEach(b => {
          b.classList.remove("active");
          b.style.background = "#FFF";
          b.style.color = b.getAttribute("data-filter") === "error" ? "#EF4444" : "#475569";
        });
        btn.classList.add("active");
        btn.style.background = "var(--primary-600, #2563EB)";
        btn.style.color = "#FFF";

        this.activeFilter = btn.getAttribute("data-filter");
        this.renderLogs();
      });
    });

    return card;
  }

  update(logs) {
    this.logs = logs || [];
    this.renderLogs();
  }

  renderLogs() {
    if (!this.element) return;
    const container = this.element.querySelector(".logs-container");
    if (!container) return;

    const filtered = this.activeFilter === "all"
      ? this.logs
      : this.logs.filter(l => l.type === this.activeFilter);

    if (filtered.length === 0) {
      container.innerHTML = `<div style="color:var(--neutral-500); font-size:13px; text-align:center; padding:16px;">No log entries found.</div>`;
      return;
    }

    const typeColors = {
      app: { bg: "rgba(37, 99, 235, 0.04)", color: "var(--primary-600)" },
      database: { bg: "rgba(16, 185, 129, 0.04)", color: "var(--success-500)" },
      performance: { bg: "rgba(139, 92, 246, 0.04)", color: "#7c3aed" },
      error: { bg: "rgba(239, 68, 68, 0.04)", color: "#ef4444" }
    };

    container.innerHTML = filtered.map(log => {
      const colors = typeColors[log.type] || typeColors.app;
      return `
        <div class="log-item-row" style="background:${colors.bg}; border-bottom:1px solid rgba(0,0,0,0.02); padding:6px; font-size:12px; display:flex; align-items:center; gap:8px;">
          <span style="color:#64748B; font-weight:700;">[${log.timestamp}]</span>
          <span style="color:${colors.color}; font-weight:700; text-transform:uppercase;">[${log.type}]</span>
          <span style="color:#334155; font-weight:500;">${log.message}</span>
        </div>`;
    }).join("");
  }
}
