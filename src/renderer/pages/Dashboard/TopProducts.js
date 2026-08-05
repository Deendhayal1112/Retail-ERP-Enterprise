/**
 * TopProducts.js
 * Retail ERP Enterprise — Top Selling Products List Card
 */

"use strict";

export default class TopProducts {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-card top-selling-products-card col-span-4";
    el.style.display = "flex";
    el.style.flexDirection = "column";

    el.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
        <h3 class="dashboard-card-title" style="margin:0; font-size:16px; font-weight:700; color:#1E293B;">Top Selling Products</h3>
        <a href="#" style="font-size:13px; font-weight:600; color:#5B3DF5; text-decoration:none;">View All</a>
      </div>

      <div class="top-selling-products-list" style="display:flex; flex-direction:column; gap:12px; flex:1;">
        <!-- Item 1 -->
        <div style="display:flex; align-items:center; gap:12px; border-bottom:1px solid #F1F5F9; padding-bottom:8px;">
          <span style="font-size:14px; font-weight:700; color:#94A3B8; width:12px;">1</span>
          <!-- Mock shirt image -->
          <div style="width:36px; height:36px; border-radius:6px; background-color:#EFF6FF; display:flex; align-items:center; justify-content:center; font-size:18px;">👕</div>
          <div style="flex:1; display:flex; flex-direction:column;">
            <span style="font-size:13px; font-weight:600; color:#1E293B;">Men's Cotton Shirt</span>
          </div>
          <span style="font-size:12px; font-weight:500; color:#64748B; margin-right:12px;">125 PCS</span>
          <strong style="font-size:13px; font-weight:600; color:#1E293B;">₹ 18,750</strong>
        </div>

        <!-- Item 2 -->
        <div style="display:flex; align-items:center; gap:12px; border-bottom:1px solid #F1F5F9; padding-bottom:8px;">
          <span style="font-size:14px; font-weight:700; color:#94A3B8; width:12px;">2</span>
          <div style="width:36px; height:36px; border-radius:6px; background-color:#EFF6FF; display:flex; align-items:center; justify-content:center; font-size:18px;">👖</div>
          <div style="flex:1; display:flex; flex-direction:column;">
            <span style="font-size:13px; font-weight:600; color:#1E293B;">Denim Jeans</span>
          </div>
          <span style="font-size:12px; font-weight:500; color:#64748B; margin-right:12px;">98 PCS</span>
          <strong style="font-size:13px; font-weight:600; color:#1E293B;">₹ 14,750</strong>
        </div>

        <!-- Item 3 -->
        <div style="display:flex; align-items:center; gap:12px; border-bottom:1px solid #F1F5F9; padding-bottom:8px;">
          <span style="font-size:14px; font-weight:700; color:#94A3B8; width:12px;">3</span>
          <div style="width:36px; height:36px; border-radius:6px; background-color:#FEF2F2; display:flex; align-items:center; justify-content:center; font-size:18px;">👗</div>
          <div style="flex:1; display:flex; flex-direction:column;">
            <span style="font-size:13px; font-weight:600; color:#1E293B;">Ladies Kurti</span>
          </div>
          <span style="font-size:12px; font-weight:500; color:#64748B; margin-right:12px;">76 PCS</span>
          <strong style="font-size:13px; font-weight:600; color:#1E293B;">₹ 11,400</strong>
        </div>

        <!-- Item 4 -->
        <div style="display:flex; align-items:center; gap:12px; border-bottom:1px solid #F1F5F9; padding-bottom:8px;">
          <span style="font-size:14px; font-weight:700; color:#94A3B8; width:12px;">4</span>
          <div style="width:36px; height:36px; border-radius:6px; background-color:#EFF6FF; display:flex; align-items:center; justify-content:center; font-size:18px;">👕</div>
          <div style="flex:1; display:flex; flex-direction:column;">
            <span style="font-size:13px; font-weight:600; color:#1E293B;">T-Shirt (Round Neck)</span>
          </div>
          <span style="font-size:12px; font-weight:500; color:#64748B; margin-right:12px;">64 PCS</span>
          <strong style="font-size:13px; font-weight:600; color:#1E293B;">₹ 7,680</strong>
        </div>

        <!-- Item 5 -->
        <div style="display:flex; align-items:center; gap:12px; padding-bottom:4px;">
          <span style="font-size:14px; font-weight:700; color:#94A3B8; width:12px;">5</span>
          <div style="width:36px; height:36px; border-radius:6px; background-color:#FFF7ED; display:flex; align-items:center; justify-content:center; font-size:18px;">👗</div>
          <div style="flex:1; display:flex; flex-direction:column;">
            <span style="font-size:13px; font-weight:600; color:#1E293B;">Kids Party Wear</span>
          </div>
          <span style="font-size:12px; font-weight:500; color:#64748B; margin-right:12px;">52 PCS</span>
          <strong style="font-size:13px; font-weight:600; color:#1E293B;">₹ 6,240</strong>
        </div>
      </div>
    `;
    return el;
  }
}
