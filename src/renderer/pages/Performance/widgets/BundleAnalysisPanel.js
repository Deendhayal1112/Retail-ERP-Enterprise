/**
 * BundleAnalysisPanel.js
 * Retail ERP Enterprise — Bundle Sizes and Compression Ratio Panel
 */

"use strict";

export default class BundleAnalysisPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card bundle-analysis-panel";
    card.style.gridColumn = "1 / -1"; // Spans full width

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
          Bundle Analysis
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Analyzed</span>
      </div>
      <div class="bundle-size-bars" style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;"></div>
      <div class="bundle-analysis-totals" style="display:flex; gap:24px; border-top:1px solid rgba(0,0,0,0.06); padding-top:12px;">
        <div><span class="stat-label">Total Bundle</span><span class="stat-value val-total-bundle" style="display:block; font-size:20px; font-weight:700; color:#1E293B;">-- MB</span></div>
        <div><span class="stat-label">Source Maps</span><span class="stat-value val-sourcemap" style="display:block; font-size:20px; font-weight:700; color:#475569;">-- MB</span></div>
        <div><span class="stat-label">Compression Ratio</span><span class="stat-value val-compression" style="display:block; font-size:20px; font-weight:700; color:#10B981;">--%</span></div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const b = metrics.bundle;
    const toMb = bytes => (bytes / (1024 * 1024)).toFixed(2);

    this.element.querySelector(".val-total-bundle").textContent = `${toMb(b.totalBundleSizeBytes)} MB`;
    this.element.querySelector(".val-sourcemap").textContent = `${toMb(b.sourceMapSizeBytes)} MB`;
    this.element.querySelector(".val-compression").textContent = `${b.compressionRatioPct}%`;

    const badge = this.element.querySelector(".status-badge");
    if (b.totalBundleSizeBytes > 5 * 1024 * 1024) {
      badge.textContent = "Overweight";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Optimal";
      badge.className = "metric-card-badge badge-normal status-badge";
    }

    // Display proportional size bars for main, vendor, and lazy chunks
    const barsContainer = this.element.querySelector(".bundle-size-bars");
    const chunks = [
      { name: "Main App Entry", bytes: b.mainBundleSizeBytes, color: "#2563EB" },
      { name: "Vendor Dependencies", bytes: b.vendorBundleSizeBytes, color: "#F59E0B" },
      { name: "Lazy Route Chunks", bytes: b.lazyChunksTotalBytes, color: "#10B981" }
    ];

    const maxBytes = b.totalBundleSizeBytes || 1;
    barsContainer.innerHTML = chunks.map(chunk => {
      const pct = (chunk.bytes / maxBytes) * 100;
      return `
        <div>
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px; font-weight:600; color:#475569;">
            <span>${chunk.name}</span>
            <span>${toMb(chunk.bytes)} MB (${pct.toFixed(1)}%)</span>
          </div>
          <div style="width:100%; height:8px; background:#F1F5F9; border-radius:4px; overflow:hidden;">
            <div style="width:${pct.toFixed(1)}%; height:100%; background:${chunk.color}; border-radius:4px; transition:width 0.4s ease;"></div>
          </div>
        </div>`;
    }).join("");
  }
}
