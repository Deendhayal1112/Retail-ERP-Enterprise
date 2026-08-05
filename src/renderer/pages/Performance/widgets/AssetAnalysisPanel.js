/**
 * AssetAnalysisPanel.js
 * Retail ERP Enterprise — Static Asset Inventory & CDN Analysis Panel
 */

"use strict";

export default class AssetAnalysisPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card asset-analysis-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          Asset Analysis
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Optimized</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row"><span class="stat-label">Image Assets</span><span class="stat-value val-images">-- MB</span></div>
        <div class="metric-stat-row"><span class="stat-label">Font Assets</span><span class="stat-value val-fonts">-- KB</span></div>
        <div class="metric-stat-row"><span class="stat-label">Icon Sprites</span><span class="stat-value val-icons">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Static Files</span><span class="stat-value val-static">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Asset Cache Hit</span><span class="stat-value val-cache">--%</span></div>
        <div class="metric-stat-row"><span class="stat-label">CDN Readiness</span><span class="stat-value val-cdn">--</span></div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const a = metrics.assets;

    const imgMb = (a.imagesSizeBytes / (1024 * 1024)).toFixed(2);
    const fontKb = (a.fontsSizeBytes / 1024).toFixed(0);

    this.element.querySelector(".val-images").textContent = `${a.imagesCount} (${imgMb} MB)`;
    this.element.querySelector(".val-fonts").textContent = `${a.fontsCount} (${fontKb} KB)`;
    this.element.querySelector(".val-icons").textContent = a.iconsCount;
    this.element.querySelector(".val-static").textContent = a.staticAssetsCount;
    this.element.querySelector(".val-cache").textContent = `${a.assetCacheHitPct}%`;
    this.element.querySelector(".val-cdn").textContent = a.cdnReadiness;

    const badge = this.element.querySelector(".status-badge");
    if (a.assetCacheHitPct < 75) {
      badge.textContent = "Review";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Optimized";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
