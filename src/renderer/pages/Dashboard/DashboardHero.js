/**
 * DashboardHero.js
 * Retail ERP Enterprise — Welcome Banner and Status Row
 */

"use strict";

export default class DashboardHero {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-hero-banner";
    el.innerHTML = `
      <div class="hero-welcome-text">
        <h2 class="hero-title">Welcome Back, Operator</h2>
        <p class="hero-subtitle">System synchronization state is stable. Store operations are running normally.</p>
      </div>
    `;
    return el;
  }
}
