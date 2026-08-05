/**
 * QuickActions.js
 * Retail ERP Enterprise — Reusable Quick Actions Panel
 */

"use strict";

export default class QuickActions {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-card quick-actions-card col-span-4";
    el.innerHTML = `
      <h3 class="dashboard-card-title">Quick Actions</h3>
      <div class="quick-actions-buttons-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <button class="quick-action-btn" style="height:88px; background-color:#F8FAFC; border:1px solid #E9EDF5; border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; cursor:pointer; font-weight:600; color:#111827;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#5B3DF5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          New Sale
        </button>
        <button class="quick-action-btn" style="height:88px; background-color:#F8FAFC; border:1px solid #E9EDF5; border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; cursor:pointer; font-weight:600; color:#111827;">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#5B3DF5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Add Customer
        </button>
      </div>
    `;
    return el;
  }
}
