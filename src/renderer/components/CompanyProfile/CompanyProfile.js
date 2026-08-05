/**
 * CompanyProfile.js
 * Retail ERP Enterprise — Reusable Company Profile Configurations Panel Page
 *
 * Implements:
 * - CompanyProfile           (Master container layout wrapping forms and logos cards)
 * - CompanyLogoCard          (Upload circle display with metadata description stats)
 * - CompanyInformationForm   (Name, Legal Name, Business Type, Industry parameters)
 * - ContactInformationForm   (Email, Phone, Mobile, Website, GSTIN/Tax ID)
 * - AddressForm              (Street, Area, City, State, Country, Postal Code)
 * - BrandingSection          (Corporate identity primary/secondary color select picks)
 */

"use strict";

export class CompanyLogoCard {
  /**
   * @param {Object} options
   * @param {string} options.logoEmoji Default emoji placeholder
   */
  constructor(options = {}) {
    this.logoEmoji = options.logoEmoji || "🏢";
  }

  render() {
    const card = document.createElement("div");
    card.className = "company-logo-card";

    card.innerHTML = `
      <div class="logo-display-circle" title="Click to upload corporate image">
        <span>${this.logoEmoji}</span>
      </div>
      <div class="logo-meta-info">
        <h5 class="logo-meta-title">Corporate Logo Image</h5>
        <span class="logo-meta-desc">Accepts PNG, JPG format. Max resolution limit 512px.</span>
      </div>
    `;

    const circle = card.querySelector(".logo-display-circle");
    circle.addEventListener("click", () => {
      console.log("[Company Profile Action] Loading native image selector dialog upload.");
    });

    return card;
  }
}

export class BrandingSection {
  constructor(options = {}) {
    this.primaryColor   = options.primaryColor   || "#6366f1";
    this.secondaryColor = options.secondaryColor || "#4f46e5";
  }

  render() {
    const card = document.createElement("div");
    card.className = "branding-settings-card";

    card.innerHTML = `
      <header class="branding-section-header">
        <h5 class="branding-section-title">Brand Customization</h5>
      </header>
      <div class="branding-colors-grid">
        <div class="branding-color-item">
          <span class="branding-color-label">Primary Brand Color</span>
          <div class="color-input-picker-box">
            <input type="color" value="${this.primaryColor}" style="border:none; width:20px; height:20px; cursor:pointer;" />
            <span class="color-hex-text">${this.primaryColor}</span>
          </div>
        </div>
        <div class="branding-color-item">
          <span class="branding-color-label">Secondary Brand Color</span>
          <div class="color-input-picker-box">
            <input type="color" value="${this.secondaryColor}" style="border:none; width:20px; height:20px; cursor:pointer;" />
            <span class="color-hex-text">${this.secondaryColor}</span>
          </div>
        </div>
      </div>
      <div class="invoice-logo-uploader" title="Click to upload receipt invoice logo header">
        <span>🧾</span>
        <span>Invoice Header Logo</span>
      </div>
    `;

    // Connect color pickers outputs
    card.querySelectorAll("input[type='color']").forEach(picker => {
      picker.addEventListener("input", (e) => {
        const txt = picker.nextElementSibling;
        if (txt) txt.textContent = e.target.value.toUpperCase();
        console.log(`[Branding Action] Brand color updated to: ${e.target.value}`);
      });
    });

    return card;
  }
}

export class CompanyInformationForm {
  constructor(options = {}) {
    this.data = {
      name:      "Retail ERP Enterprise Inc.",
      legalName: "Retail ERP Enterprise LLC",
      type:      "Corporation",
      industry:  "Retail & E-commerce",
      ...options
    };
  }

  render() {
    const card = document.createElement("div");
    card.className = "profile-form-section-card";

    card.innerHTML = `
      <header class="form-section-header">
        <h5 class="form-section-title">Company Identity</h5>
      </header>
      <div class="profile-form-fields-grid">
        <div class="form-field-group">
          <label class="form-field-label">Company Name</label>
          <input type="text" class="profile-form-input" value="${this.data.name}" />
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Legal Business Name</label>
          <input type="text" class="profile-form-input" value="${this.data.legalName}" />
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Business Structure Type</label>
          <select class="profile-form-select">
            <option value="corporation" ${this.data.type === "Corporation" ? "selected" : ""}>Corporation</option>
            <option value="partnership" ${this.data.type === "Partnership" ? "selected" : ""}>Partnership</option>
            <option value="sole_proprietor" ${this.data.type === "Sole Proprietorship" ? "selected" : ""}>Sole Proprietorship</option>
          </select>
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Industry Classification</label>
          <input type="text" class="profile-form-input" value="${this.data.industry}" />
        </div>
      </div>
    `;

    return card;
  }
}

export class ContactInformationForm {
  constructor(options = {}) {
    this.data = {
      email:   "corporate@retailerp.com",
      phone:   "+1 (555) 942-8201",
      mobile:  "+1 (555) 919-4820",
      website: "https://retailerp.com",
      taxId:   "GSTIN-94A8C0294F1Z3",
      ...options
    };
  }

  render() {
    const card = document.createElement("div");
    card.className = "profile-form-section-card";

    card.innerHTML = `
      <header class="form-section-header">
        <h5 class="form-section-title">Contact Directory & Tax Details</h5>
      </header>
      <div class="profile-form-fields-grid">
        <div class="form-field-group">
          <label class="form-field-label">Official Email Address</label>
          <input type="email" class="profile-form-input" value="${this.data.email}" />
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Office Phone Number</label>
          <input type="text" class="profile-form-input" value="${this.data.phone}" />
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Mobile Hotline Number</label>
          <input type="text" class="profile-form-input" value="${this.data.mobile}" />
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Corporate Website Domain</label>
          <input type="url" class="profile-form-input" value="${this.data.website}" />
        </div>
        <div class="form-field-group" style="grid-column: span 2;">
          <label class="form-field-label">GST / Tax Registration ID Number</label>
          <input type="text" class="profile-form-input" value="${this.data.taxId}" />
        </div>
      </div>
    `;

    return card;
  }
}

export class AddressForm {
  constructor(options = {}) {
    this.data = {
      street:     "9408 Enterprise Parkway",
      area:       "Suite 204",
      city:       "Austin",
      state:      "Texas",
      country:    "United States",
      postalCode: "78701",
      ...options
    };
  }

  render() {
    const card = document.createElement("div");
    card.className = "profile-form-section-card";

    card.innerHTML = `
      <header class="form-section-header">
        <h5 class="form-section-title">Headquarters Address</h5>
      </header>
      <div class="profile-form-fields-grid">
        <div class="form-field-group" style="grid-column: span 2;">
          <label class="form-field-label">Street Address Line</label>
          <input type="text" class="profile-form-input" value="${this.data.street}" />
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Area / Suite Suite Number</label>
          <input type="text" class="profile-form-input" value="${this.data.area}" />
        </div>
        <div class="form-field-group">
          <label class="form-field-label">City Region</label>
          <input type="text" class="profile-form-input" value="${this.data.city}" />
        </div>
        <div class="form-field-group">
          <label class="form-field-label">State / Province</label>
          <input type="text" class="profile-form-input" value="${this.data.state}" />
        </div>
        <div class="form-field-group">
          <label class="form-field-label">Country Jurisdiction</label>
          <input type="text" class="profile-form-input" value="${this.data.country}" />
        </div>
        <div class="form-field-group" style="grid-column: span 2;">
          <label class="form-field-label">Postal / Zip Code</label>
          <input type="text" class="profile-form-input" value="${this.data.postalCode}" />
        </div>
      </div>
    `;

    return card;
  }
}

// ─────────────────────────────────────────────────────
// MAIN COMPANY PROFILE MASTER CARD LAYOUT
// ─────────────────────────────────────────────────────

export default class CompanyProfile {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const container = document.createElement("div");
    container.className = "company-profile-container";

    // A. Left column: Logo & Branding pickers
    const leftCol = document.createElement("div");
    leftCol.className = "company-profile-sidebar-col";

    leftCol.appendChild(new CompanyLogoCard().render());
    leftCol.appendChild(new BrandingSection().render());
    container.appendChild(leftCol);

    // B. Right column: Address, Identity, Contact Directory sheets
    const rightCol = document.createElement("div");
    rightCol.className = "company-profile-forms-col";

    rightCol.appendChild(new CompanyInformationForm().render());
    rightCol.appendChild(new ContactInformationForm().render());
    rightCol.appendChild(new AddressForm().render());

    // Footer actions save bar
    const saveBar = document.createElement("div");
    saveBar.className = "profile-save-bar";
    saveBar.innerHTML = `
      <button class="profile-save-btn">Save Configurations</button>
    `;
    saveBar.querySelector(".profile-save-btn").addEventListener("click", () => {
      console.log("[Company Profile Action] Local storage save dispatch initiated.");
    });
    rightCol.appendChild(saveBar);

    container.appendChild(rightCol);
    this.element = container;

    return container;
  }
}
