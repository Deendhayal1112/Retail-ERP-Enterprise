/**
 * TopSellingProducts.js
 * Retail ERP Enterprise — Top Selling Products Table Component
 *
 * Implements:
 * - TopSellingProducts (Main card manager)
 * - TopSellingHeader (Header details view all)
 * - ProductList (Table node wrapper)
 * - ProductRow (Individual row item)
 * - ProductThumbnail (Visual initials box)
 * - SalesProgress (Horizontal bars progress)
 * - TrendIndicator (Gain status badges)
 */

"use strict";

export class TopSellingHeader {
  constructor(options = {}) {
    this.title = options.title || "Top Selling Products";
    this.subtitle = options.subtitle || "Weekly sales performance catalog";
  }

  render() {
    const header = document.createElement("header");
    header.className = "top-selling-header-row";

    header.innerHTML = `
      <div class="top-selling-header-details">
        <h3 class="top-selling-title-text">${this.title}</h3>
        <span class="top-selling-subtitle-text">${this.subtitle}</span>
      </div>
      <button class="top-selling-btn-view-all">View All Products</button>
    `;

    header.querySelector(".top-selling-btn-view-all").addEventListener("click", () => {
      console.log("[Navigation Router] Redirecting user to full inventory catalog list.");
    });

    return header;
  }
}

export class ProductThumbnail {
  constructor(options = {}) {
    this.name = options.name || "P";
  }

  render() {
    const initial = this.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    const box = document.createElement("div");
    box.className = "product-thumbnail-box";
    box.textContent = initial;
    return box;
  }
}

export class SalesProgress {
  constructor(options = {}) {
    this.percentage = options.percentage || 50;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "8px";

    wrapper.innerHTML = `
      <div class="product-sales-progress-track">
        <div class="product-sales-progress-fill" style="width: ${this.percentage}%"></div>
      </div>
      <span style="font-size: 0.675rem; font-weight: 600;">${this.percentage}%</span>
    `;

    return wrapper;
  }
}

export class TrendIndicator {
  constructor(options = {}) {
    this.trend = options.trend || "up"; // up, down, stable
  }

  render() {
    const badge = document.createElement("span");
    
    let symbol = "→";
    let color = "var(--text-muted)";
    if (this.trend === "up") {
      symbol = "↑";
      color = "var(--success-600)";
    } else if (this.trend === "down") {
      symbol = "↓";
      color = "var(--danger-600)";
    }

    badge.textContent = symbol;
    badge.style.color = color;
    badge.style.fontWeight = "800";
    badge.style.fontSize = "0.875rem";
    return badge;
  }
}

export class ProductRow {
  constructor(options = {}) {
    this.item = {
      rank: options.rank || 1,
      name: options.name || "",
      sold: options.sold || "0 sold",
      revenue: options.revenue || "$0.00",
      progress: options.progress || 50,
      trend: options.trend || "up",
      ...options
    };
  }

  render() {
    const tr = document.createElement("tr");
    tr.className = "product-table-row-item";

    // Rank
    const tdRank = document.createElement("td");
    tdRank.className = "product-rank-badge";
    tdRank.textContent = `#${this.item.rank}`;
    tr.appendChild(tdRank);

    // Thumbnail
    const tdThumb = document.createElement("td");
    const thumb = new ProductThumbnail({ name: this.item.name });
    tdThumb.appendChild(thumb.render());
    tr.appendChild(tdThumb);

    // Product Name
    const tdName = document.createElement("td");
    tdName.style.fontWeight = "600";
    tdName.style.color = "var(--text-primary)";
    tdName.textContent = this.item.name;
    tr.appendChild(tdName);

    // Quantity Sold
    const tdQuantity = document.createElement("td");
    tdQuantity.textContent = this.item.sold;
    tr.appendChild(tdQuantity);

    // Revenue
    const tdRevenue = document.createElement("td");
    tdRevenue.style.fontWeight = "700";
    tdRevenue.textContent = this.item.revenue;
    tr.appendChild(tdRevenue);

    // Sales Progress Bar
    const tdProgress = document.createElement("td");
    const bar = new SalesProgress({ percentage: this.item.progress });
    tdProgress.appendChild(bar.render());
    tr.appendChild(tdProgress);

    // Trend
    const tdTrend = document.createElement("td");
    const trend = new TrendIndicator({ trend: this.item.trend });
    tdTrend.appendChild(trend.render());
    tr.appendChild(tdTrend);

    return tr;
  }
}

export class ProductList {
  constructor(options = {}) {
    this.products = options.products || [];
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "top-selling-table-wrapper";

    const table = document.createElement("table");
    table.className = "top-selling-table-node";

    // Table Header
    table.innerHTML = `
      <thead>
        <tr>
          <th>Rank</th>
          <th>Preview</th>
          <th>Product Name</th>
          <th>Qty Sold</th>
          <th>Revenue</th>
          <th>Sales Ratio</th>
          <th>Trend</th>
        </tr>
      </thead>
      <tbody class="product-table-tbody-list"></tbody>
    `;

    const tbody = table.querySelector(".product-table-tbody-list");
    this.products.forEach(p => {
      const row = new ProductRow(p);
      tbody.appendChild(row.render());
    });

    wrapper.appendChild(table);
    return wrapper;
  }
}

// ─────────────────────────────────────────────────────
// MAIN TOP SELLING PRODUCTS COMPONENT
// ─────────────────────────────────────────────────────

export default class TopSellingProducts {
  constructor(options = {}) {
    this.options = options;
    this.element = null;

    // Default mock popular items listings
    this.items = [
      { rank: 1, name: "Classic Denim Jacket", sold: "240 pcs", revenue: "$14,400.00", progress: 95, trend: "up" },
      { rank: 2, name: "Premium Leather Boot", sold: "180 pcs", revenue: "$21,600.00", progress: 75, trend: "up" },
      { rank: 3, name: "Wireless Sports Headphone", sold: "140 pcs", revenue: "$9,800.00", progress: 60, trend: "down" },
      { rank: 4, name: "Cotton Crewneck Tee", sold: "120 pcs", revenue: "$3,600.00", progress: 45, trend: "stable" }
    ];
  }

  render() {
    const card = document.createElement("div");
    card.className = "top-selling-products-card";

    // 1. Header
    card.appendChild(new TopSellingHeader().render());

    // 2. Product Table List
    const list = new ProductList({ products: this.items });
    card.appendChild(list.render());

    // 3. Footer info details
    const footer = document.createElement("footer");
    footer.className = "top-selling-footer-row";
    footer.innerHTML = `
      <span>Total Weekly Top Performance Revenue: <strong>$49,400.00</strong></span>
      <span>Target quota status: <strong>92% Met</strong></span>
    `;
    card.appendChild(footer);

    this.element = card;
    return card;
  }
}
