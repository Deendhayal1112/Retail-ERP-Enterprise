/**
 * BusinessPage.js
 * Retail ERP Enterprise — Reusable Business Modules View Controller
 *
 * Implements highly polished, premium mock panel interfaces for Products,
 * Inventory, POS, Purchase, Customers, Employees, Reports, Marketing,
 * AI Invoice Smart Import, Backup, License, and Profile.
 */

"use strict";

export default class BusinessPage {
  /**
   * @param {string} route The clicked routing key (e.g. pos, products, inventory)
   */
  constructor(route) {
    this.route = route;
    this.element = null;
    this.cart = []; // Used for POS Billing state
  }

  /**
   * Renders the page view.
   * @returns {Promise<HTMLElement>} Mounted DOM tree node.
   */
  async render() {
    const container = document.createElement("div");
    container.className = "business-page-container";

    // Set page header
    const header = document.createElement("header");
    header.className = "business-page-header";
    
    const titleBlock = document.createElement("div");
    titleBlock.className = "title-block";

    const title = document.createElement("h1");
    title.className = "business-page-title";
    title.textContent = this.getFriendlyTitle();

    const subtitle = document.createElement("p");
    subtitle.className = "business-page-subtitle";
    subtitle.textContent = this.getFriendlySubtitle();

    titleBlock.appendChild(title);
    titleBlock.appendChild(subtitle);
    header.appendChild(titleBlock);

    // Actions block on the right of the header
    const actionsBlock = document.createElement("div");
    actionsBlock.className = "actions-block";
    this.renderHeaderActions(actionsBlock);
    header.appendChild(actionsBlock);

    container.appendChild(header);

    // Main workspace
    const content = document.createElement("div");
    content.className = `business-page-content content-${this.route}`;
    
    // Inject specific page HTML & logic
    this.renderPageContent(content);
    container.appendChild(content);

    this.element = container;
    return container;
  }

  getFriendlyTitle() {
    const titles = {
      "pos": "POS Point of Sale",
      "products": "Products Directory",
      "inventory": "Inventory Registry",
      "purchase": "Purchasing & Procurement",
      "customers": "Customer Relationship Directory",
      "employees": "Employee Management Center",
      "reports": "Financial & Sales Reports",
      "marketing": "Marketing & Promotions",
      "ai-import": "AI Invoice Smart Import",
      "backup": "System Backup & Restore",
      "license": "License Activation Hub",
      "profile": "Operator Profile Settings"
    };
    return titles[this.route] || "Business Operations";
  }

  getFriendlySubtitle() {
    const subtitles = {
      "pos": "Process instant customer invoices, scan clothing barcodes, and accept payments.",
      "products": "Manage store apparel inventory items, pricing levels, and SKU categories.",
      "inventory": "Track stock levels, configure low-stock thresholds, and trigger manual restocks.",
      "purchase": "Draft purchase orders, track supplier deliveries, and manage vendor details.",
      "customers": "Monitor loyal store shoppers, customer profiles, and total purchase values.",
      "employees": "Configure store operators shift logs, access rights, and performance indices.",
      "reports": "Generate GST summaries, sales metrics, and export auditing sheets.",
      "marketing": "Configure promo codes, discount metrics, and loyal shopper campaign alerts.",
      "ai-import": "Upload vendor PDF invoices to automatically parse items using AI OCR scanning.",
      "backup": "Safeguard offline database, configure local archives, and link Google Drive sync.",
      "license": "Verify commercial serial certificate, view contract duration, and refresh keys.",
      "profile": "Update active operator profile credentials and set UI layout preferences."
    };
    return subtitles[this.route] || "Configure core retail enterprise operations.";
  }

  renderHeaderActions(parent) {
    // Add primary CTA buttons depending on active route
    if (this.route === "products") {
      const btn = document.createElement("button");
      btn.className = "btn-primary";
      btn.innerHTML = `<span class="icon">＋</span> Add Product`;
      btn.addEventListener("click", () => this.showToast("Add Product dialog triggered.", "info"));
      parent.appendChild(btn);
    } else if (this.route === "inventory") {
      const btn = document.createElement("button");
      btn.className = "btn-secondary";
      btn.innerHTML = `<span class="icon">↺</span> Trigger Stock Reconciliation`;
      btn.addEventListener("click", () => this.showToast("Stock reconciliation sequence started.", "info"));
      parent.appendChild(btn);
    } else if (this.route === "pos") {
      const btn = document.createElement("button");
      btn.className = "btn-secondary";
      btn.innerHTML = `<span class="icon">📋</span> View Holds`;
      btn.addEventListener("click", () => this.showToast("Active order holds list opened.", "info"));
      parent.appendChild(btn);
    } else if (this.route === "customers") {
      const btn = document.createElement("button");
      btn.className = "btn-primary";
      btn.innerHTML = `<span class="icon">＋</span> Add Customer`;
      btn.addEventListener("click", () => this.showToast("New customer registry wizard started.", "info"));
      parent.appendChild(btn);
    } else if (this.route === "employees") {
      const btn = document.createElement("button");
      btn.className = "btn-primary";
      btn.innerHTML = `<span class="icon">＋</span> Add Employee`;
      btn.addEventListener("click", () => this.showToast("Employee configuration wizard loaded.", "info"));
      parent.appendChild(btn);
    }
  }

  showToast(msg, type = "info") {
    if (window.Toast) {
      window.Toast.show(msg, type, 3000);
    } else {
      console.log(`[Toast ${type.toUpperCase()}]: ${msg}`);
    }
  }

  renderPageContent(content) {
    switch (this.route) {
      case "pos":
        this.renderPOS(content);
        break;
      case "products":
        this.renderProducts(content);
        break;
      case "inventory":
        this.renderInventory(content);
        break;
      case "purchase":
        this.renderPurchase(content);
        break;
      case "customers":
        this.renderCustomers(content);
        break;
      case "employees":
        this.renderEmployees(content);
        break;
      case "reports":
        this.renderReports(content);
        break;
      case "marketing":
        this.renderMarketing(content);
        break;
      case "ai-import":
        this.renderAIImport(content);
        break;
      case "backup":
        this.renderBackup(content);
        break;
      case "license":
        this.renderLicense(content);
        break;
      case "profile":
        this.renderProfile(content);
        break;
      default:
        content.innerHTML = `<div class="empty-state">No specific view mapped for this module.</div>`;
    }
  }

  /* ────────────────────────────────────────────────────────
   * POS BILLING MODULE (pos)
   * ──────────────────────────────────────────────────────── */
  renderPOS(parent) {
    parent.innerHTML = `
      <div class="pos-layout">
        <!-- Catalog column -->
        <div class="pos-catalog">
          <div class="catalog-search-bar">
            <input type="text" class="catalog-search-input" placeholder="Search product name or SKU..." />
            <select class="catalog-category-filter">
              <option value="all">All Categories</option>
              <option value="shirts">Shirts</option>
              <option value="denim">Denims</option>
              <option value="saree">Sarees</option>
              <option value="ethnic">Ethnic Wear</option>
            </select>
          </div>
          <div class="catalog-grid">
            <!-- Catalog Cards will be dynamically appended -->
          </div>
        </div>

        <!-- Billing Invoice column -->
        <div class="pos-cart-panel">
          <h2 class="cart-title">Active Invoice</h2>
          <div class="cart-items-container">
            <div class="cart-empty-message">No items added to invoice. Click catalog products to add.</div>
          </div>

          <div class="cart-summary-section">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span id="pos-subtotal">₹0.00</span>
            </div>
            <div class="summary-row text-muted">
              <span>CGST (9.0%):</span>
              <span id="pos-cgst">₹0.00</span>
            </div>
            <div class="summary-row text-muted">
              <span>SGST (9.0%):</span>
              <span id="pos-sgst">₹0.00</span>
            </div>
            <div class="summary-row divider"></div>
            <div class="summary-row grand-total">
              <span>Total Payable:</span>
              <span id="pos-grand-total">₹0.00</span>
            </div>
          </div>

          <div class="cart-payment-methods">
            <label class="payment-method-btn active">
              <input type="radio" name="payment-type" value="upi" checked />
              <span>UPI / Scan QR</span>
            </label>
            <label class="payment-method-btn">
              <input type="radio" name="payment-type" value="card" />
              <span>Card Terminal</span>
            </label>
            <label class="payment-method-btn">
              <input type="radio" name="payment-type" value="cash" />
              <span>Cash Payment</span>
            </label>
          </div>

          <button class="btn-checkout w-full disabled" id="checkout-invoice-btn" disabled>
            ⚡ Complete & Print Invoice (F8)
          </button>
        </div>
      </div>
    `;

    // Catalog items definitions
    const catalogItems = [
      { id: 1, name: "Premium Cotton Slim-Fit Shirt", category: "shirts", price: 1499, sku: "SH-COT-01", stock: 12 },
      { id: 2, name: "Dark Indigo Jeans (Stretchable)", category: "denim", price: 2199, sku: "DN-IND-02", stock: 8 },
      { id: 3, name: "Banarasi Pure Silk Saree", category: "saree", price: 6499, sku: "SR-BNR-03", stock: 3 },
      { id: 4, name: "Linen Casual Mens Blazer", category: "shirts", price: 3499, sku: "BZ-LIN-04", stock: 5 },
      { id: 5, name: "Anarkali Embroidered Kurta Suit", category: "ethnic", price: 2899, sku: "KT-ANR-05", stock: 7 },
      { id: 6, name: "Traditional Silk Kurta Pyjama Set", category: "ethnic", price: 1899, sku: "KT-SIL-06", stock: 14 }
    ];

    const catalogGrid = parent.querySelector(".catalog-grid");
    
    // Render catalog
    const renderCatalogGrid = (items) => {
      catalogGrid.innerHTML = "";
      items.forEach(prod => {
        const card = document.createElement("div");
        card.className = "catalog-card";
        card.innerHTML = `
          <div class="card-image-box">
            <span class="category-tag">${prod.category.toUpperCase()}</span>
            <div class="product-placeholder-avatar">${prod.name[0]}</div>
          </div>
          <div class="card-details">
            <h3 class="product-name">${prod.name}</h3>
            <span class="product-sku">${prod.sku}</span>
            <div class="card-footer">
              <span class="product-price">₹${prod.price.toLocaleString("en-IN")}</span>
              <button class="btn-add-cart" data-id="${prod.id}">Add</button>
            </div>
          </div>
        `;

        card.querySelector(".btn-add-cart").addEventListener("click", () => {
          this.addToCart(prod);
        });

        catalogGrid.appendChild(card);
      });
    };

    renderCatalogGrid(catalogItems);

    // Search and Filter listeners
    const searchInput = parent.querySelector(".catalog-search-input");
    const categorySelect = parent.querySelector(".catalog-category-filter");

    const filterCatalog = () => {
      const q = searchInput.value.toLowerCase().trim();
      const cat = categorySelect.value;
      const filtered = catalogItems.filter(item => {
        const matchQ = item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
        const matchCat = cat === "all" || item.category === cat;
        return matchQ && matchCat;
      });
      renderCatalogGrid(filtered);
    };

    searchInput.addEventListener("input", filterCatalog);
    categorySelect.addEventListener("change", filterCatalog);

    // Complete Checkout Button Event Listener
    const checkoutBtn = parent.querySelector("#checkout-invoice-btn");
    checkoutBtn.addEventListener("click", () => {
      this.showToast("Processing Invoice... Printing generated Receipt.", "success");
      // Clear cart
      this.cart = [];
      this.updateCartUI(parent);
    });
  }

  addToCart(prod) {
    const existing = this.cart.find(x => x.id === prod.id);
    if (existing) {
      existing.qty += 1;
    } else {
      this.cart.push({ ...prod, qty: 1 });
    }
    this.updateCartUI(this.element);
    this.showToast(`${prod.name} added to invoice.`, "success");
  }

  updateCartUI(parent) {
    const container = parent.querySelector(".cart-items-container");
    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = `<div class="cart-empty-message">No items added to invoice. Click catalog products to add.</div>`;
      parent.querySelector("#pos-subtotal").textContent = "₹0.00";
      parent.querySelector("#pos-cgst").textContent = "₹0.00";
      parent.querySelector("#pos-sgst").textContent = "₹0.00";
      parent.querySelector("#pos-grand-total").textContent = "₹0.00";
      const checkoutBtn = parent.querySelector("#checkout-invoice-btn");
      checkoutBtn.disabled = true;
      checkoutBtn.classList.add("disabled");
      return;
    }

    container.innerHTML = "";
    let subtotal = 0;

    this.cart.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-item-row";
      const totalRowPrice = item.price * item.qty;
      subtotal += totalRowPrice;

      row.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-meta">${item.sku} @ ₹${item.price}</span>
        </div>
        <div class="cart-qty-controls">
          <button class="btn-qty-minus" data-id="${item.id}">-</button>
          <span class="cart-item-qty">${item.qty}</span>
          <button class="btn-qty-plus" data-id="${item.id}">+</button>
        </div>
        <span class="cart-item-total">₹${totalRowPrice.toLocaleString("en-IN")}</span>
      `;

      row.querySelector(".btn-qty-minus").addEventListener("click", () => {
        if (item.qty > 1) {
          item.qty -= 1;
        } else {
          this.cart = this.cart.filter(x => x.id !== item.id);
        }
        this.updateCartUI(parent);
      });

      row.querySelector(".btn-qty-plus").addEventListener("click", () => {
        item.qty += 1;
        this.updateCartUI(parent);
      });

      container.appendChild(row);
    });

    const cgst = subtotal * 0.09;
    const sgst = subtotal * 0.09;
    const total = subtotal + cgst + sgst;

    parent.querySelector("#pos-subtotal").textContent = `₹${subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    parent.querySelector("#pos-cgst").textContent = `₹${cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    parent.querySelector("#pos-sgst").textContent = `₹${sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    parent.querySelector("#pos-grand-total").textContent = `₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

    const checkoutBtn = parent.querySelector("#checkout-invoice-btn");
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove("disabled");
  }

  /* ────────────────────────────────────────────────────────
   * PRODUCTS DIRECTORY MODULE (products)
   * ──────────────────────────────────────────────────────── */
  renderProducts(parent) {
    parent.innerHTML = `
      <div class="table-container-card">
        <div class="table-header-filters">
          <input type="text" class="search-field" placeholder="Filter products by SKU, name..." />
          <select class="select-field">
            <option>All Apparel</option>
            <option>Shirts</option>
            <option>Denims</option>
            <option>Sarees</option>
            <option>Ethnic Wear</option>
          </select>
        </div>
        <table class="enterprise-table">
          <thead>
            <tr>
              <th>SKU ID</th>
              <th>Product Details</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-mono">SH-COT-01</td>
              <td class="font-semibold text-primary">Premium Cotton Slim-Fit Shirt</td>
              <td>Mens Wear</td>
              <td>₹1,499.00</td>
              <td>12 Units</td>
              <td><span class="badge-success">In Stock</span></td>
              <td><button class="table-action-btn">Edit</button></td>
            </tr>
            <tr>
              <td class="font-mono">DN-IND-02</td>
              <td class="font-semibold text-primary">Dark Indigo Jeans (Stretchable)</td>
              <td>Mens Wear</td>
              <td>₹2,199.00</td>
              <td>8 Units</td>
              <td><span class="badge-warning">Low Stock</span></td>
              <td><button class="table-action-btn">Edit</button></td>
            </tr>
            <tr>
              <td class="font-mono">SR-BNR-03</td>
              <td class="font-semibold text-primary">Banarasi Pure Silk Saree</td>
              <td>Womens Wear</td>
              <td>₹6,499.00</td>
              <td>3 Units</td>
              <td><span class="badge-danger">Reorder Alert</span></td>
              <td><button class="table-action-btn">Edit</button></td>
            </tr>
            <tr>
              <td class="font-mono">BZ-LIN-04</td>
              <td class="font-semibold text-primary">Linen Casual Mens Blazer</td>
              <td>Formal Wear</td>
              <td>₹3,499.00</td>
              <td>5 Units</td>
              <td><span class="badge-success">In Stock</span></td>
              <td><button class="table-action-btn">Edit</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  /* ────────────────────────────────────────────────────────
   * INVENTORY MODULE (inventory)
   * ──────────────────────────────────────────────────────── */
  renderInventory(parent) {
    parent.innerHTML = `
      <div class="kpi-row-grid">
        <div class="summary-card">
          <span class="card-label">Total SKUs Tracked</span>
          <span class="card-value">1,480</span>
        </div>
        <div class="summary-card text-warning">
          <span class="card-label">Low Stock Alarms</span>
          <span class="card-value">24</span>
        </div>
        <div class="summary-card text-danger">
          <span class="card-label">Out of Stock Items</span>
          <span class="card-value">3</span>
        </div>
        <div class="summary-card text-success">
          <span class="card-label">Total Inventory Valuation</span>
          <span class="card-value">₹24,80,500</span>
        </div>
      </div>

      <div class="table-container-card mt-6">
        <table class="enterprise-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Apparel Item</th>
              <th>Storage location</th>
              <th>Available Units</th>
              <th>Safety Limit</th>
              <th>Restock Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-mono">SH-COT-01</td>
              <td class="font-semibold">Premium Cotton Slim-Fit Shirt</td>
              <td>Aisle 2B / Shelf 1</td>
              <td>12 Pcs</td>
              <td>10 Pcs</td>
              <td><button class="restock-action-btn font-semibold">Quick Restock</button></td>
            </tr>
            <tr>
              <td class="font-mono">DN-IND-02</td>
              <td class="font-semibold text-warning">Dark Indigo Jeans (Stretchable)</td>
              <td>Aisle 4A / Shelf 3</td>
              <td class="text-warning font-bold">8 Pcs</td>
              <td>12 Pcs</td>
              <td><button class="restock-action-btn font-semibold restock-warn">Quick Restock</button></td>
            </tr>
            <tr>
              <td class="font-mono">SR-BNR-03</td>
              <td class="font-semibold text-danger">Banarasi Pure Silk Saree</td>
              <td>Aisle 1C / Vault</td>
              <td class="text-danger font-bold">3 Pcs</td>
              <td>5 Pcs</td>
              <td><button class="restock-action-btn font-semibold restock-critical">Order Restock</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    // Interactive stock restock incrementor
    parent.querySelectorAll(".restock-action-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tr = e.target.closest("tr");
        const cell = tr.children[3];
        const val = parseInt(cell.textContent);
        cell.textContent = `${val + 10} Pcs`;
        cell.className = "text-success font-bold";
        this.showToast("Stock level updated by 10 units.", "success");
      });
    });
  }

  /* ────────────────────────────────────────────────────────
   * PURCHASE MODULE (purchase)
   * ──────────────────────────────────────────────────────── */
  renderPurchase(parent) {
    parent.innerHTML = `
      <div class="kpi-row-grid">
        <div class="summary-card">
          <span class="card-label">Open Purchase Orders</span>
          <span class="card-value">6</span>
        </div>
        <div class="summary-card">
          <span class="card-label">Awaiting Delivery</span>
          <span class="card-value">2 Orders</span>
        </div>
        <div class="summary-card text-success">
          <span class="card-label">Procured This Month</span>
          <span class="card-value">₹8,92,400</span>
        </div>
      </div>

      <div class="table-container-card mt-6">
        <table class="enterprise-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Vendor Details</th>
              <th>Issue Date</th>
              <th>Billing Amount</th>
              <th>Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-mono">PO-2025-091</td>
              <td>Karan Garment Mills Ltd</td>
              <td>01 May 2025</td>
              <td>₹4,50,000</td>
              <td><span class="badge-success">Received</span></td>
            </tr>
            <tr>
              <td class="font-mono">PO-2025-092</td>
              <td>Surat Silk & Cotton Hub</td>
              <td>03 May 2025</td>
              <td>₹1,80,000</td>
              <td><span class="badge-warning">In Transit</span></td>
            </tr>
            <tr>
              <td class="font-mono">PO-2025-093</td>
              <td>Ethnic Fabrics Co.</td>
              <td>05 May 2025</td>
              <td>₹2,62,400</td>
              <td><span class="badge-danger">Pending Approval</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  /* ────────────────────────────────────────────────────────
   * CUSTOMERS MODULE (customers)
   * ──────────────────────────────────────────────────────── */
  renderCustomers(parent) {
    parent.innerHTML = `
      <div class="table-container-card">
        <table class="enterprise-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Contact Details</th>
              <th>Email Address</th>
              <th>Loyalty Points</th>
              <th>Life Time Sales</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-semibold text-primary">Aarav Sharma</td>
              <td>+91 98765 43210</td>
              <td>aarav.sharma@gmail.com</td>
              <td>450 Pts</td>
              <td>₹28,500.00</td>
              <td><span class="badge-success">Active</span></td>
            </tr>
            <tr>
              <td class="font-semibold text-primary">Diya Patel</td>
              <td>+91 87654 32109</td>
              <td>diya.patel@yahoo.com</td>
              <td>980 Pts</td>
              <td>₹62,400.00</td>
              <td><span class="badge-success">Active</span></td>
            </tr>
            <tr>
              <td class="font-semibold text-primary">Vivaan Iyer</td>
              <td>+91 76543 21098</td>
              <td>vivaan.iyer@outlook.com</td>
              <td>120 Pts</td>
              <td>₹8,900.00</td>
              <td><span class="badge-warning">Inactive</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  /* ────────────────────────────────────────────────────────
   * EMPLOYEES MODULE (employees)
   * ──────────────────────────────────────────────────────── */
  renderEmployees(parent) {
    parent.innerHTML = `
      <div class="table-container-card">
        <table class="enterprise-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Assigned Store Role</th>
              <th>Shift Status</th>
              <th>Contact Node</th>
              <th>KPI index</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-semibold text-primary">Anjali Mehta</td>
              <td>Store Administrator</td>
              <td><span class="badge-success">On Duty</span></td>
              <td>anjali.mehta@retailerp.com</td>
              <td>9.8 / 10.0</td>
            </tr>
            <tr>
              <td class="font-semibold text-primary">Rahul Nair</td>
              <td>Sales & Billing Clerk</td>
              <td><span class="badge-success">On Duty</span></td>
              <td>rahul.nair@retailerp.com</td>
              <td>8.5 / 10.0</td>
            </tr>
            <tr>
              <td class="font-semibold text-primary">Vikram Sen</td>
              <td>Inventory Supervisor</td>
              <td><span class="badge-danger">Off Duty</span></td>
              <td>vikram.sen@retailerp.com</td>
              <td>9.0 / 10.0</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  /* ────────────────────────────────────────────────────────
   * REPORTS MODULE (reports)
   * ──────────────────────────────────────────────────────── */
  renderReports(parent) {
    parent.innerHTML = `
      <div class="reports-toolbar">
        <div class="toolbar-group">
          <label class="form-label">Report type:</label>
          <select class="select-field">
            <option>Sales Ledger Summary</option>
            <option>GST GSTR-1 Tax File Summary</option>
            <option>Inventory Valuation Audit</option>
          </select>
        </div>
        <div class="toolbar-group">
          <label class="form-label">Scope Duration:</label>
          <select class="select-field">
            <option>This Current Month</option>
            <option>Previous Quarter</option>
            <option>Full Fiscal Year</option>
          </select>
        </div>
        <button class="btn-primary" id="btn-generate-report">⚡ Execute Query</button>
      </div>

      <div class="report-results-box hidden mt-6">
        <div class="kpi-row-grid">
          <div class="summary-card">
            <span class="card-label">Net Billings</span>
            <span class="card-value">₹14,92,000.00</span>
          </div>
          <div class="summary-card text-success">
            <span class="card-label">Taxes Collected (GST 18%)</span>
            <span class="card-value">₹2,68,560.00</span>
          </div>
          <div class="summary-card text-primary">
            <span class="card-label">Average Order Value</span>
            <span class="card-value">₹2,450.00</span>
          </div>
        </div>

        <div class="table-container-card mt-6">
          <table class="enterprise-table">
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Operator</th>
                <th>Sale Date</th>
                <th>Gross Price</th>
                <th>Taxes (CGST+SGST)</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="font-mono">REC-2025-8812</td>
                <td>Rahul Nair</td>
                <td>20 May 2025</td>
                <td>₹2,499.00</td>
                <td>₹449.82</td>
                <td class="font-bold text-primary">₹2,948.82</td>
              </tr>
              <tr>
                <td class="font-mono">REC-2025-8813</td>
                <td>Rahul Nair</td>
                <td>20 May 2025</td>
                <td>₹1,499.00</td>
                <td>₹269.82</td>
                <td class="font-bold text-primary">₹1,768.82</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    const genBtn = parent.querySelector("#btn-generate-report");
    const results = parent.querySelector(".report-results-box");
    genBtn.addEventListener("click", () => {
      results.classList.remove("hidden");
      this.showToast("Report loaded successfully.", "success");
    });
  }

  /* ────────────────────────────────────────────────────────
   * MARKETING MODULE (marketing)
   * ──────────────────────────────────────────────────────── */
  renderMarketing(parent) {
    parent.innerHTML = `
      <div class="kpi-row-grid">
        <div class="summary-card">
          <span class="card-label">Active Promo Codes</span>
          <span class="card-value">4 Codes</span>
        </div>
        <div class="summary-card">
          <span class="card-label">SMS Alert Subscribers</span>
          <span class="card-value">1,240</span>
        </div>
        <div class="summary-card text-success">
          <span class="card-label">Campaign Conversions</span>
          <span class="card-value">₹1,24,900</span>
        </div>
      </div>

      <div class="table-container-card mt-6">
        <table class="enterprise-table">
          <thead>
            <tr>
              <th>Promo Code</th>
              <th>Discount Type</th>
              <th>Assigned Value</th>
              <th>Expiry Limit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-mono font-bold">FESTIVE20</td>
              <td>Cart Percentage</td>
              <td>20% OFF</td>
              <td>31 Dec 2025</td>
              <td><span class="badge-success">Active</span></td>
            </tr>
            <tr>
              <td class="font-mono font-bold">WELCOME500</td>
              <td>Flat Value Coupon</td>
              <td>₹500 OFF</td>
              <td>Open Ended</td>
              <td><span class="badge-success">Active</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  /* ────────────────────────────────────────────────────────
   * AI INVOICE IMPORT MODULE (ai-import)
   * ──────────────────────────────────────────────────────── */
  renderAIImport(parent) {
    parent.innerHTML = `
      <div class="ai-import-layout">
        <div class="drop-zone-card" id="drop-zone">
          <div class="drop-zone-inner">
            <span class="drop-icon">📤</span>
            <h3 class="drop-title">Drag & Drop Vendor Invoices Here</h3>
            <p class="drop-subtitle">Supports PDF, PNG, JPG files up to 10MB</p>
            <button class="btn-secondary" id="btn-browse-file">Browse File</button>
          </div>
        </div>

        <div class="ai-parsed-results hidden">
          <div class="results-header">
            <h3>🤖 Parsed Data Preview</h3>
            <span class="confidence-badge">Confidence Rate: 98.4%</span>
          </div>

          <div class="parsed-form-grid mt-4">
            <div class="form-group">
              <label class="form-label">Invoice Reference ID</label>
              <input type="text" class="input-field" value="INV-990812" readonly />
            </div>
            <div class="form-group">
              <label class="form-label">Supplier Entity Name</label>
              <input type="text" class="input-field" value="Vardhman Garment Mills Ltd" readonly />
            </div>
            <div class="form-group">
              <label class="form-label">Invoice Value (INR)</label>
              <input type="text" class="input-field" value="₹1,84,500.00" readonly />
            </div>
            <div class="form-group">
              <label class="form-label">Calculated GST Tax</label>
              <input type="text" class="input-field" value="₹33,210.00" readonly />
            </div>
          </div>

          <div class="results-actions mt-6">
            <button class="btn-primary" id="btn-commit-db">✓ Commit parsed items to inventory</button>
            <button class="btn-secondary" id="btn-discard-results">Discard</button>
          </div>
        </div>
      </div>
    `;

    const dropZone = parent.querySelector("#drop-zone");
    const browseBtn = parent.querySelector("#btn-browse-file");
    const results = parent.querySelector(".ai-parsed-results");
    const commitBtn = parent.querySelector("#btn-commit-db");

    const triggerImport = () => {
      this.showToast("Uploading and scanning invoice PDF using Gemini OCR...", "info");
      dropZone.innerHTML = `
        <div class="scanning-spinner">
          <div class="spinner-circle"></div>
          <p>Analyzing document syntax patterns...</p>
        </div>
      `;
      setTimeout(() => {
        dropZone.classList.add("hidden");
        results.classList.remove("hidden");
        this.showToast("Analysis complete. Parsed items loaded.", "success");
      }, 2000);
    };

    browseBtn.addEventListener("click", triggerImport);
    commitBtn.addEventListener("click", () => {
      this.showToast("Invoice products committed to Inventory Database successfully.", "success");
      // Reset
      dropZone.classList.remove("hidden");
      results.classList.add("hidden");
      dropZone.innerHTML = `
        <div class="drop-zone-inner">
          <span class="drop-icon">📤</span>
          <h3 class="drop-title">Drag & Drop Vendor Invoices Here</h3>
          <p class="drop-subtitle">Supports PDF, PNG, JPG files up to 10MB</p>
          <button class="btn-secondary" id="btn-browse-file">Browse File</button>
        </div>
      `;
      parent.querySelector("#btn-browse-file").addEventListener("click", triggerImport);
    });
  }

  /* ────────────────────────────────────────────────────────
   * BACKUP MODULE (backup)
   * ──────────────────────────────────────────────────────── */
  renderBackup(parent) {
    parent.innerHTML = `
      <div class="backup-grid">
        <div class="backup-card">
          <h3 class="card-title">Local Database Backup</h3>
          <p class="card-desc">Store raw offline SQL archives on this device.</p>
          <div class="backup-meta">Last Backup: Today at 08:30 AM</div>
          <button class="btn-primary" id="btn-run-local-backup">Backup database Now</button>
        </div>

        <div class="backup-card">
          <h3 class="card-title">Cloud Synchronization</h3>
          <p class="card-desc">Securely replicate backup archives to linked Google Drive.</p>
          <div class="backup-meta text-success">Google Drive Connection Active</div>
          <button class="btn-secondary" id="btn-run-cloud-sync">Sync archives to Cloud</button>
        </div>
      </div>
    `;

    parent.querySelector("#btn-run-local-backup").addEventListener("click", () => {
      this.showToast("Generating local database backup binary...", "info");
      setTimeout(() => {
        this.showToast("Local backup successfully saved to /database/backup/", "success");
      }, 1500);
    });

    parent.querySelector("#btn-run-cloud-sync").addEventListener("click", () => {
      this.showToast("Replicating local archives to secure cloud bucket...", "info");
      setTimeout(() => {
        this.showToast("Cloud sync successfully completed.", "success");
      }, 2000);
    });
  }

  /* ────────────────────────────────────────────────────────
   * LICENSE MODULE (license)
   * ──────────────────────────────────────────────────────── */
  renderLicense(parent) {
    parent.innerHTML = `
      <div class="license-layout">
        <div class="license-status-card">
          <div class="badge-row">
            <span class="active-badge">✓ LICENSE ACTIVE</span>
            <span class="license-type-badge">ENTERPRISE EDITION</span>
          </div>
          <div class="license-field-row mt-4">
            <span class="label">Assigned Node ID:</span>
            <span class="value font-mono">ERP-ENT-2026-89102-X</span>
          </div>
          <div class="license-field-row">
            <span class="label">Support End Date:</span>
            <span class="value">28 May 2027 (300 Days remaining)</span>
          </div>
        </div>

        <div class="license-form-card mt-6">
          <h3>Verify or Refresh License Certificate</h3>
          <div class="form-group mt-4">
            <input type="text" class="input-field" placeholder="Enter key (e.g. XXXX-XXXX-XXXX-XXXX)" />
          </div>
          <button class="btn-primary mt-4" id="btn-verify-license">Verify Certificate Key</button>
        </div>
      </div>
    `;

    parent.querySelector("#btn-verify-license").addEventListener("click", () => {
      this.showToast("Validating license signature with local keys...", "info");
      setTimeout(() => {
        this.showToast("License certificate key successfully verified. Store is secure.", "success");
      }, 1500);
    });
  }

  /* ────────────────────────────────────────────────────────
   * PROFILE MODULE (profile)
   * ──────────────────────────────────────────────────────── */
  renderProfile(parent) {
    parent.innerHTML = `
      <div class="profile-layout">
        <div class="profile-details-card">
          <div class="profile-avatar-row">
            <div class="profile-avatar">A</div>
            <div class="profile-meta">
              <h3 class="profile-name">Admin Operator</h3>
              <span class="profile-role">System Administrator</span>
            </div>
          </div>
        </div>

        <div class="profile-form-card mt-6">
          <h3 class="section-title">Modify Account Password</h3>
          <div class="form-grid mt-4">
            <div class="form-group">
              <label class="form-label">Current Password</label>
              <input type="password" class="input-field" />
            </div>
            <div class="form-group">
              <label class="form-label">New Password</label>
              <input type="password" class="input-field" />
            </div>
            <div class="form-group">
              <label class="form-label">Confirm New Password</label>
              <input type="password" class="input-field" />
            </div>
          </div>
          <button class="btn-primary mt-6" id="btn-update-password">Update Password Credentials</button>
        </div>
      </div>
    `;

    parent.querySelector("#btn-update-password").addEventListener("click", () => {
      this.showToast("Verifying input credentials strength...", "info");
      setTimeout(() => {
        this.showToast("Operator account password updated successfully.", "success");
      }, 1500);
    });
  }
}
