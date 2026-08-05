/**
 * TopProducts.js
 * Retail ERP Enterprise — Reusable Top Selling Products Card
 */

"use strict";

export default class TopProducts {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-card top-selling-products-card col-span-6";
    el.innerHTML = `
      <h3 class="dashboard-card-title">Top Products</h3>
      <ul class="top-selling-products-list" style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:16px;">
        <li style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #E9EDF5; padding-bottom:10px;">
          <div>
            <span style="font-size:14px; font-weight:600; color:#111827; display:block;">Leather Oxford Shoes</span>
            <span style="font-size:12px; color:#6B7280;">SKU: SHOE-LO-01</span>
          </div>
          <span style="font-size:14px; font-weight:600; color:#111827;">$12,450.00</span>
        </li>
        <li style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #E9EDF5; padding-bottom:10px;">
          <div>
            <span style="font-size:14px; font-weight:600; color:#111827; display:block;">Cotton Casual Shirt</span>
            <span style="font-size:12px; color:#6B7280;">SKU: CLTH-CS-02</span>
          </div>
          <span style="font-size:14px; font-weight:600; color:#111827;">$8,240.00</span>
        </li>
      </ul>
    `;
    return el;
  }
}
