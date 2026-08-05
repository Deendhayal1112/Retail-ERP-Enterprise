/**
 * Favorites.js
 * Retail ERP Enterprise — Reusable Bookmarked Links Panel
 */

"use strict";

export default class Favorites {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-card favorites-card col-span-12";
    el.innerHTML = `
      <h3 class="dashboard-card-title">Bookmarked Shortcuts</h3>
      <div class="favorites-links-flex" style="display:flex; gap:16px; flex-wrap:wrap;">
        <button class="favorite-link-pill" style="height:36px; padding:0 16px; background-color:#F8FAFC; border:1px solid #E9EDF5; border-radius:18px; cursor:pointer; font-size:13px; font-weight:600; color:#111827; display:flex; align-items:center; gap:8px;">
          ⭐️ POS Billing
        </button>
        <button class="favorite-link-pill" style="height:36px; padding:0 16px; background-color:#F8FAFC; border:1px solid #E9EDF5; border-radius:18px; cursor:pointer; font-size:13px; font-weight:600; color:#111827; display:flex; align-items:center; gap:8px;">
          ⭐️ Sales Reports
        </button>
        <button class="favorite-link-pill" style="height:36px; padding:0 16px; background-color:#F8FAFC; border:1px solid #E9EDF5; border-radius:18px; cursor:pointer; font-size:13px; font-weight:600; color:#111827; display:flex; align-items:center; gap:8px;">
          ⭐️ Store Settings
        </button>
      </div>
    `;
    return el;
  }
}
