/**
 * Settings.js
 * Retail ERP Enterprise — Reusable Workspace Settings Module
 *
 * Implements the Settings Layout containing sidebar, forms grids, and
 * service status monitors, visually matching the design reference screenshot.
 */

"use strict";

export class SettingsSidebar {
  /**
   * @param {Object}   options
   * @param {string}   options.activeSection Active tab selection key
   * @param {Function} options.onSelect      Navigation callback
   */
  constructor(options = {}) {
    this.activeSection = options.activeSection || "company";
    this.onSelect      = options.onSelect      || null;

    this.sections = [
      {
        key: "company",
        label: "Store Settings",
        sub: "Profile, Address, Logo",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
      },
      {
        key: "invoice",
        label: "Invoice Settings",
        sub: "Templates, Prefix, Taxes",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
      },
      {
        key: "pos",
        label: "POS Settings",
        sub: "Billing, Payment, Print",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`
      },
      {
        key: "users",
        label: "User & Roles",
        sub: "Users, Roles, Permissions",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
      },
      {
        key: "whatsapp",
        label: "WhatsApp Settings",
        sub: "Business API Configuration",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`
      },
      {
        key: "email",
        label: "Email Settings",
        sub: "SMTP, Daily Reports",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`
      },
      {
        key: "gdrive",
        label: "Google Drive Backup",
        sub: "Backup Schedule, Restore",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.2 15c.9-1.2 1.4-2.5 1.4-3.9 0-3.9-3.1-7-7-7-.7 0-1.3.1-1.9.3C12.8 2.5 10.5 1 8 1 3.6 1 0 4.6 0 9c0 .7.1 1.4.3 2.1C.1 12.1 0 13 0 14c0 4.4 3.6 8 8 8h11.2c2.1 0 3.8-1.7 3.8-3.8 0-1.2-.6-2.4-1.8-3.2z"></path></svg>`
      },
      {
        key: "ai",
        label: "AI Settings",
        sub: "AI Provider, API Configuration",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`
      },
      {
        key: "printer",
        label: "Printer Settings",
        sub: "Thermal, A4, Barcode",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>`
      },
      {
        key: "general",
        label: "General Settings",
        sub: "Language, Currency, Theme",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
      },
      {
        key: "security",
        label: "Security Settings",
        sub: "Password, Session, Locks",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`
      }
    ];
  }

  render() {
    const nav = document.createElement("aside");
    nav.className = "settings-sidebar-nav";

    const list = document.createElement("ul");
    list.className = "settings-menu-list";

    this.sections.forEach(sec => {
      const li = document.createElement("li");
      li.className = "settings-menu-item";

      const link = document.createElement("a");
      link.className = `settings-menu-link${sec.key === this.activeSection ? " active" : ""}`;
      link.href = "#";
      link.setAttribute("data-section", sec.key);

      link.innerHTML = `
        <span class="settings-menu-icon">${sec.icon}</span>
        <div class="settings-menu-text-wrap">
          <span class="settings-menu-label">${sec.label}</span>
          <span class="settings-menu-sub">${sec.sub}</span>
        </div>
      `;

      link.addEventListener("click", (e) => {
        e.preventDefault();
        nav.querySelectorAll(".settings-menu-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        this.activeSection = sec.key;
        if (this.onSelect) this.onSelect(sec.key);
      });

      li.appendChild(link);
      list.appendChild(li);
    });

    nav.appendChild(list);
    return nav;
  }
}

export class SettingsContent {
  /**
   * @param {Object} options
   * @param {string} options.section Selection key
   */
  constructor(options = {}) {
    this.section = options.section || "company";
  }

  render() {
    const wrap = document.createElement("div");
    wrap.className = "settings-scroll-body";

    if (this.section === "company") {
      // ────────────────────────────────────────────────────────────────
      // ROW 1: Store Information (2/3 width) & Store Logo (1/3 width)
      // ────────────────────────────────────────────────────────────────
      const row1 = document.createElement("div");
      row1.className = "settings-grid-row-1";

      // Store Information Card
      const infoCard = document.createElement("div");
      infoCard.className = "settings-card store-info-card";
      infoCard.innerHTML = `
        <h3 class="settings-card-title">Store Information</h3>
        <div class="store-info-fields-container">
          <div class="store-info-left-fields">
            <div class="settings-form-group">
              <label class="settings-form-label">Store Name <span style="color:#EF4444;">*</span></label>
              <input type="text" class="settings-form-input" value="ABC Textiles" placeholder="ABC Textiles" />
            </div>
            <div class="settings-form-group">
              <label class="settings-form-label">GST Number</label>
              <input type="text" class="settings-form-input" value="33ABCDE1234F1Z5" placeholder="33ABCDE1234F1Z5" />
            </div>
            <div class="settings-form-group">
              <label class="settings-form-label">Phone Number</label>
              <input type="text" class="settings-form-input" value="+91 98765 43210" placeholder="+91 98765 43210" />
            </div>
            <div class="settings-form-group">
              <label class="settings-form-label">Email</label>
              <input type="email" class="settings-form-input" value="info@abctextiles.com" placeholder="info@abctextiles.com" />
            </div>
          </div>
          <div class="store-info-right-fields">
            <div class="settings-form-group textarea-group">
              <label class="settings-form-label">Address</label>
              <div class="textarea-relative-wrapper">
                <textarea class="settings-form-textarea" placeholder="Address">No. 12, Lake View Road,\nT. Nagar,\nChennai - 600017,\nTamil Nadu, India.</textarea>
                <span class="textarea-character-count">73/200</span>
              </div>
            </div>
            <div class="settings-form-group">
              <label class="settings-form-label">Currency</label>
              <div class="select-relative-wrapper">
                <select class="settings-form-select">
                  <option selected>INR - Indian Rupee (₹)</option>
                  <option>USD - US Dollar ($)</option>
                  <option>EUR - Euro (€)</option>
                </select>
              </div>
            </div>
            <div class="settings-form-group">
              <label class="settings-form-label">Timezone</label>
              <div class="select-relative-wrapper">
                <select class="settings-form-select">
                  <option selected>(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                  <option>(UTC+00:00) UTC / GMT</option>
                  <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      `;
      row1.appendChild(infoCard);

      // Store Logo Card
      const logoCard = document.createElement("div");
      logoCard.className = "settings-card store-logo-card";
      logoCard.innerHTML = `
        <h3 class="settings-card-title">Store Logo</h3>
        <div class="logo-display-wrapper">
          <button class="logo-delete-btn" aria-label="Delete Logo">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
          <div class="logo-badge-container">
            <div class="logo-shield-crest">
              <svg viewBox="0 0 100 100" width="80" height="80">
                <!-- Crown motif -->
                <path d="M25,35 L38,45 L50,22 L62,45 L75,35 L68,68 L32,68 Z" fill="none" stroke="#5B3DF5" stroke-width="2" stroke-linejoin="round"/>
                <!-- Letter A -->
                <text x="50" y="58" font-family="Cinzel, Georgia, serif" font-size="24" font-weight="bold" fill="#5B3DF5" text-anchor="middle">A</text>
                <!-- Wreath arcs -->
                <path d="M15,50 C15,70 30,85 50,85 C70,85 85,70 85,50" fill="none" stroke="#5B3DF5" stroke-width="1.5" stroke-dasharray="3,3"/>
              </svg>
            </div>
            <div class="logo-badge-title">ABC TEXTILES</div>
            <div class="logo-badge-subtitle">STYLE THAT DEFINES YOU</div>
          </div>
        </div>
        <button class="settings-btn-secondary upload-logo-btn">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          Change Logo
        </button>
        <span class="logo-upload-caption">JPG, PNG or WEBP. Max size 2MB</span>
      `;
      row1.appendChild(logoCard);

      wrap.appendChild(row1);

      // ────────────────────────────────────────────────────────────────
      // ROW 2: Business Preferences, Theme Settings, Financial Year
      // ────────────────────────────────────────────────────────────────
      const row2 = document.createElement("div");
      row2.className = "settings-grid-row-2";

      // Business Preferences
      const prefCard = document.createElement("div");
      prefCard.className = "settings-card business-preferences-card";
      prefCard.innerHTML = `
        <h3 class="settings-card-title">Business Preferences</h3>
        <div class="business-preferences-grid">
          <div class="settings-form-group">
            <label class="settings-form-label">Language</label>
            <select class="settings-form-select">
              <option selected>English</option>
              <option>Tamil (தமிழ்)</option>
              <option>Spanish</option>
            </select>
          </div>
          <div class="settings-form-group">
            <label class="settings-form-label">Date Format</label>
            <select class="settings-form-select">
              <option selected>DD-MM-YYYY</option>
              <option>MM-DD-YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div class="settings-form-group">
            <label class="settings-form-label">Time Format</label>
            <select class="settings-form-select">
              <option selected>12 Hour</option>
              <option>24 Hour</option>
            </select>
          </div>
          <div class="settings-form-group">
            <label class="settings-form-label">Measurement Unit</label>
            <select class="settings-form-select">
              <option selected>Pieces</option>
              <option>Boxes</option>
              <option>Kilograms</option>
            </select>
          </div>
          <div class="settings-form-group">
            <label class="settings-form-label">Tax Calculation</label>
            <select class="settings-form-select">
              <option selected>Inclusive of Tax</option>
              <option>Exclusive of Tax</option>
            </select>
          </div>
          <div class="settings-form-group">
            <label class="settings-form-label">Default Payment</label>
            <select class="settings-form-select">
              <option selected>Cash</option>
              <option>Card</option>
              <option>UPI</option>
            </select>
          </div>
        </div>
      `;
      row2.appendChild(prefCard);

      // Theme Settings
      const themeCard = document.createElement("div");
      themeCard.className = "settings-card theme-settings-card";
      themeCard.innerHTML = `
        <h3 class="settings-card-title">Theme Settings</h3>
        <label class="settings-form-label" style="margin-bottom:12px; display:block;">Select Theme</label>
        <div class="theme-selections-row">
          <div class="theme-option-box active" data-theme="light">
            <div class="theme-preview-block light-preview">
              <span class="theme-check-badge">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <div class="preview-inner-ui">
                <div class="preview-sidebar"></div>
                <div class="preview-main"></div>
              </div>
            </div>
            <span class="theme-option-label">Light</span>
          </div>
          <div class="theme-option-box" data-theme="dark">
            <div class="theme-preview-block dark-preview">
              <span class="theme-check-badge"></span>
              <div class="preview-inner-ui">
                <div class="preview-sidebar"></div>
                <div class="preview-main"></div>
              </div>
            </div>
            <span class="theme-option-label">Dark</span>
          </div>
          <div class="theme-option-box" data-theme="blue">
            <div class="theme-preview-block blue-preview">
              <span class="theme-check-badge"></span>
              <div class="preview-inner-ui">
                <div class="preview-sidebar"></div>
                <div class="preview-main"></div>
              </div>
            </div>
            <span class="theme-option-label">Blue</span>
          </div>
          <div class="theme-option-box" data-theme="green">
            <div class="theme-preview-block green-preview">
              <span class="theme-check-badge"></span>
              <div class="preview-inner-ui">
                <div class="preview-sidebar"></div>
                <div class="preview-main"></div>
              </div>
            </div>
            <span class="theme-option-label">Green</span>
          </div>
        </div>

        <label class="settings-form-label" style="margin-top:20px; margin-bottom:12px; display:block;">Sidebar Style</label>
        <div class="sidebar-style-buttons-row">
          <button class="settings-btn-choice">Compact</button>
          <button class="settings-btn-choice active">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Default
          </button>
          <button class="settings-btn-choice">Wide</button>
        </div>
      `;
      
      // Connect interactive mock click selectors
      themeCard.querySelectorAll(".theme-option-box").forEach(box => {
        box.addEventListener("click", () => {
          themeCard.querySelectorAll(".theme-option-box").forEach(b => {
            b.classList.remove("active");
            const badge = b.querySelector(".theme-check-badge");
            if (badge) badge.innerHTML = "";
          });
          box.classList.add("active");
          const activeBadge = box.querySelector(".theme-check-badge");
          if (activeBadge) {
            activeBadge.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          }
          console.log(`[Appearance Theme] Selected theme is: ${box.getAttribute("data-theme")}`);
        });
      });

      themeCard.querySelectorAll(".settings-btn-choice").forEach(btn => {
        btn.addEventListener("click", () => {
          themeCard.querySelectorAll(".settings-btn-choice").forEach(b => {
            b.classList.remove("active");
            b.innerHTML = b.textContent.trim();
          });
          btn.classList.add("active");
          btn.innerHTML = `
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ${btn.textContent.trim()}
          `;
        });
      });

      row2.appendChild(themeCard);

      // Financial Year Card
      const finCard = document.createElement("div");
      finCard.className = "settings-card financial-year-card";
      finCard.innerHTML = `
        <h3 class="settings-card-title">Financial Year</h3>
        <div class="financial-year-fields-wrap">
          <div class="settings-form-group">
            <label class="settings-form-label">Financial Year Start</label>
            <select class="settings-form-select">
              <option selected>1 April</option>
              <option>1 January</option>
              <option>1 July</option>
            </select>
          </div>
          <div class="settings-form-group" style="margin-top:20px;">
            <label class="settings-form-label">Default Warehouse</label>
            <select class="settings-form-select">
              <option selected>Main Store</option>
              <option>Warehouse A</option>
              <option>Warehouse B</option>
            </select>
          </div>
          <button class="settings-btn-primary save-all-settings-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Save Changes
          </button>
        </div>
      `;

      finCard.querySelector(".save-all-settings-btn").addEventListener("click", () => {
        console.log("[Settings Layout Action] Save Changes dispatched.");
      });

      row2.appendChild(finCard);

      wrap.appendChild(row2);

      // ────────────────────────────────────────────────────────────────
      // ROW 3: System Configuration Status section (Full width)
      // ────────────────────────────────────────────────────────────────
      const row3 = document.createElement("div");
      row3.className = "settings-grid-row-3";

      row3.innerHTML = `
        <div class="status-section-header">
          <h2 class="status-section-title">System Configuration Status</h2>
          <span class="status-section-subtitle">Check the status of all integrated services</span>
        </div>
        <div class="status-cards-row">
          <!-- Card 1: WhatsApp API -->
          <div class="status-card-item">
            <div class="status-card-icon whatsapp-color">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
            <div class="status-card-content">
              <div class="status-card-title-row">
                <span class="status-name-label">WhatsApp API</span>
                <span class="status-badge connected">Connected</span>
              </div>
              <span class="status-desc-label">Last synced: 12 May 2025, 09:15 AM</span>
            </div>
          </div>

          <!-- Card 2: Email Service -->
          <div class="status-card-item">
            <div class="status-card-icon email-color">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div class="status-card-content">
              <div class="status-card-title-row">
                <span class="status-name-label">Email Service</span>
                <span class="status-badge connected">Connected</span>
              </div>
              <span class="status-desc-label">Last test email: 12 May 2025, 08:45 AM</span>
            </div>
          </div>

          <!-- Card 3: Google Drive -->
          <div class="status-card-item">
            <div class="status-card-icon drive-color">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.2 15c.9-1.2 1.4-2.5 1.4-3.9 0-3.9-3.1-7-7-7-.7 0-1.3.1-1.9.3C12.8 2.5 10.5 1 8 1 3.6 1 0 4.6 0 9c0 .7.1 1.4.3 2.1C.1 12.1 0 13 0 14c0 4.4 3.6 8 8 8h11.2c2.1 0 3.8-1.7 3.8-3.8 0-1.2-.6-2.4-1.8-3.2z"></path></svg>
            </div>
            <div class="status-card-content">
              <div class="status-card-title-row">
                <span class="status-name-label">Google Drive</span>
                <span class="status-badge connected">Connected</span>
              </div>
              <span class="status-desc-label">Last backup: 12 May 2025, 01:30 AM</span>
            </div>
          </div>

          <!-- Card 4: AI Service -->
          <div class="status-card-item">
            <div class="status-card-icon ai-color">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
            </div>
            <div class="status-card-content">
              <div class="status-card-title-row">
                <span class="status-name-label">AI Service</span>
                <span class="status-badge connected">Connected</span>
              </div>
              <span class="status-desc-label">Model: GPT-4o Mini</span>
            </div>
          </div>

          <!-- Card 5: Printer -->
          <div class="status-card-item">
            <div class="status-card-icon printer-color">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            </div>
            <div class="status-card-content">
              <div class="status-card-title-row">
                <span class="status-name-label">Printer</span>
                <span class="status-badge connected">Connected</span>
              </div>
              <span class="status-desc-label">Thermal Printer (USB001)</span>
            </div>
          </div>
        </div>
      `;

      wrap.appendChild(row3);

    } else {
      // Clean placeholder layout mapping for other sections
      const placeholderCard = document.createElement("div");
      placeholderCard.className = "settings-card placeholder-view-card";
      placeholderCard.innerHTML = `
        <h3 class="settings-card-title">${this.section.charAt(0).toUpperCase() + this.section.slice(1).replace("_", " ")}</h3>
        <p style="color: #6B7280; font-size: 14px; margin-top: 8px;">Configurations console dashboard is currently active. Adjust parameters values below.</p>
        <div class="settings-form-group" style="margin-top: 20px; width: 320px;">
          <label class="settings-form-label">Service Toggle State</label>
          <div class="select-relative-wrapper">
            <select class="settings-form-select">
              <option selected>Enabled / Active</option>
              <option>Disabled / Inactive</option>
            </select>
          </div>
        </div>
      `;
      wrap.appendChild(placeholderCard);
    }

    return wrap;
  }
}

// ─────────────────────────────────────────────────────
// MAIN SETTINGS LAYOUT CONTAINER
// ─────────────────────────────────────────────────────

export default class SettingsLayout {
  constructor(options = {}) {
    this.options       = options;
    this.activeSection = "company";
    this.element       = null;
  }

  _updateWorkspace() {
    const pane = this.element.querySelector(".settings-content-pane");
    if (!pane) return;

    // Clear previous settings content
    pane.innerHTML = "";

    // Render active section's scroll body content card list
    const body = new SettingsContent({ section: this.activeSection });
    pane.appendChild(body.render());
  }

  render() {
    const mainWrap = document.createElement("div");
    mainWrap.className = "settings-module-wrapper";

    // 1. Header Row (Titles + Search Input) — Spans full width at the top
    const header = document.createElement("header");
    header.className = "settings-content-header";

    const titleGroup = document.createElement("div");
    titleGroup.className = "settings-title-group";
    titleGroup.innerHTML = `
      <h1 class="settings-page-title">Settings</h1>
      <p class="settings-page-subtitle">Manage all your system settings and preferences</p>
    `;
    header.appendChild(titleGroup);

    const searchWrapper = document.createElement("div");
    searchWrapper.className = "settings-search-wrapper";
    searchWrapper.innerHTML = `
      <svg class="search-input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <input type="text" class="settings-search-field" placeholder="Search settings..." aria-label="Search settings configurations" />
    `;
    header.appendChild(searchWrapper);
    mainWrap.appendChild(header);

    // 2. Main split panel layout (Sidebar on left, active content cards on right)
    const mainLayout = document.createElement("div");
    mainLayout.className = "settings-main-layout";

    // A. Left settings navigation sidebar
    const sidebar = new SettingsSidebar({
      activeSection: this.activeSection,
      onSelect: (secKey) => {
        this.activeSection = secKey;
        this._updateWorkspace();
      }
    });
    mainLayout.appendChild(sidebar.render());

    // B. Right settings workspace scroll area container
    const contentPane = document.createElement("div");
    contentPane.className = "settings-content-pane";
    mainLayout.appendChild(contentPane);

    mainWrap.appendChild(mainLayout);

    this.element = mainWrap;
    this._updateWorkspace();

    return mainWrap;
  }
}
