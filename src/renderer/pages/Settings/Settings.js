/**
 * Settings.js
 * Retail ERP Enterprise — Reusable Workspace Settings Module
 *
 * Implements:
 * - SettingsLayout     (Main grid containing sidebar, navigation, search, and page frames)
 * - SettingsSidebar    (Lists settings categories: Company, Users, Roles, Appearance, Notifications, Localization, Security, About)
 * - SettingsContent    (Displays current page card lists)
 * - SettingsSearch     (Enables options layout query filter)
 * - SettingsBreadcrumb (Upper path indicators row)
 * - SettingsSection    (Header category title row wrapper)
 * - SettingsCard       (Pref card option with input fields/toggles)
 */

"use strict";

import CompanyProfile from "../../components/CompanyProfile/CompanyProfile.js";
import UserManagement from "../../components/UserManagement/UserManagement.js";

export class SettingsCard {
  /**
   * @param {Object}      options
   * @param {string}      options.title       Label name string
   * @param {string}      options.description Sub-label details paragraph
   * @param {HTMLElement} options.control     Action switch or select element
   */
  constructor(options = {}) {
    this.title       = options.title       || "Preference Item";
    this.description = options.description || "Configure setting parameter description.";
    this.control     = options.control     || null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "settings-pref-card";

    const labelGroup = document.createElement("div");
    labelGroup.className = "settings-card-label-group";
    labelGroup.innerHTML = `
      <span class="settings-card-title">${this.title}</span>
      <span class="settings-card-desc">${this.description}</span>
    `;
    card.appendChild(labelGroup);

    if (this.control) {
      card.appendChild(this.control);
    }

    return card;
  }
}

export class SettingsSection {
  /**
   * @param {Object} options
   * @param {string} options.title Category header title label
   */
  constructor(options = {}) {
    this.title = options.title || "Section Header";
  }

  render(cards = []) {
    const section = document.createElement("section");
    section.className = "settings-section-block";

    const header = document.createElement("h4");
    header.className = "settings-section-title";
    header.textContent = this.title;
    section.appendChild(header);

    const cardsList = document.createElement("div");
    cardsList.className = "settings-cards-list";
    cards.forEach(card => cardsList.appendChild(card));
    section.appendChild(cardsList);

    return section;
  }
}

export class SettingsBreadcrumb {
  /**
   * @param {Object} options
   * @param {string} options.section Active settings group name
   */
  constructor(options = {}) {
    this.section = options.section || "Company";
  }

  render() {
    const nav = document.createElement("nav");
    nav.className = "settings-breadcrumb-bar";

    nav.innerHTML = `
      <span class="settings-breadcrumb-link">Settings</span>
      <span>&gt;</span>
      <span class="settings-breadcrumb-active">${this.section}</span>
    `;
    return nav;
  }
}

export class SettingsSearch {
  /**
   * @param {Object}   options
   * @param {Function} options.onSearch Search query callback
   */
  constructor(options = {}) {
    this.onSearch = options.onSearch || null;
  }

  render() {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "settings-sidebar-search";
    input.placeholder = "Search Settings...";
    input.setAttribute("aria-label", "Search configurations");

    input.addEventListener("input", (e) => {
      if (this.onSearch) this.onSearch(e.target.value.toLowerCase());
    });

    return input;
  }
}

export class SettingsSidebar {
  /**
   * @param {Object}   options
   * @param {string}   options.activeSection Initial active section
   * @param {Function} options.onSelect      Section selection callback
   */
  constructor(options = {}) {
    this.activeSection = options.activeSection || "company";
    this.onSelect      = options.onSelect      || null;

    this.sections = [
      { key: "company",      label: "Company",       icon: "🏢" },
      { key: "users",        label: "Users",         icon: "👥" },
      { key: "roles",        label: "Roles",         icon: "🔑" },
      { key: "appearance",   label: "Appearance",    icon: "🎨" },
      { key: "notifications",label: "Notifications", icon: "🔔" },
      { key: "localization", label: "Localization",  icon: "🌍" },
      { key: "security",     label: "Security",      icon: "🔒" },
      { key: "about",        label: "About",         icon: "ℹ️" }
    ];
  }

  render() {
    const nav = document.createElement("aside");
    nav.className = "settings-sidebar-nav";

    // 1. Search Bar placement
    const searchContainer = document.createElement("div");
    searchContainer.className = "settings-search-container";
    
    const searchObj = new SettingsSearch({
      onSearch: (q) => {
        console.log(`[Settings Search] Query key: ${q}`);
        // Filter sidebar links visually based on search query
        const links = nav.querySelectorAll(".settings-menu-link");
        links.forEach(link => {
          const text = link.textContent.toLowerCase();
          const li = link.closest(".settings-menu-item");
          if (li) {
            li.style.display = text.includes(q) ? "" : "none";
          }
        });
      }
    });
    searchContainer.appendChild(searchObj.render());
    nav.appendChild(searchContainer);

    // 2. Menu Links
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
        <span>${sec.label}</span>
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
   * @param {string} options.section Current section key
   */
  constructor(options = {}) {
    this.section = options.section || "company";
  }

  _createToggle(checked = true, key = "") {
    const sw = document.createElement("div");
    sw.className = `settings-toggle-switch${checked ? "" : " off"}`;
    sw.addEventListener("click", () => {
      const isOff = sw.classList.toggle("off");
      console.log(`[Settings Config] ${key} toggled = ${!isOff}`);
    });
    return sw;
  }

  _createSelect(options = [], selected = "") {
    const sel = document.createElement("select");
    sel.className = "settings-card-select-dropdown";
    options.forEach(opt => {
      const el = document.createElement("option");
      el.value = opt.toLowerCase().replace(/\s+/g, "_");
      el.textContent = opt;
      if (opt === selected) el.selected = true;
      sel.appendChild(el);
    });
    return sel;
  }

  _createInput(value = "", placeholder = "") {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "settings-card-input-field";
    input.value = value;
    input.placeholder = placeholder;
    return input;
  }

  render() {
    const wrap = document.createElement("div");
    wrap.className = "settings-scroll-body";

    if (this.section === "company") {
      const profile = new CompanyProfile();
      wrap.appendChild(profile.render());

    } else if (this.section === "users") {
      const userMgmt = new UserManagement();
      wrap.appendChild(userMgmt.render());

    } else if (this.section === "roles") {
      const p1 = new SettingsSection({ title: "Access Policies Enforcement" });
      const cards1 = [
        new SettingsCard({ title: "Enable Role-based Access", description: "Enforce permissions checking constraints in routes", control: this._createToggle(true, "rbac_policy") }).render(),
        new SettingsCard({ title: "Default Deny Mode", description: "Deny API calls by default when roles overlap", control: this._createToggle(false, "default_deny") }).render()
      ];
      wrap.appendChild(p1.render(cards1));

    } else if (this.section === "appearance") {
      const p1 = new SettingsSection({ title: "Workspace Themes Styles" });
      const cards1 = [
        new SettingsCard({ title: "Default Interface Color Theme", description: "Initial coloring parameters overlay on client launch", control: this._createSelect(["Light Theme", "Dark Theme", "System Default"], "System Default") }).render()
      ];
      wrap.appendChild(p1.render(cards1));

    } else if (this.section === "notifications") {
      const p1 = new SettingsSection({ title: "Dispatch Preferences" });
      const cards1 = [
        new SettingsCard({ title: "Enable Desktop Alerts Popup", description: "Broadcast system alerts notifications boxes", control: this._createToggle(true, "desktop_notif") }).render(),
        new SettingsCard({ title: "Sound Indicators On Error", description: "Trigger audio sound alerting alerts on fail logs", control: this._createToggle(false, "sound_notif") }).render()
      ];
      wrap.appendChild(p1.render(cards1));

    } else if (this.section === "localization") {
      const p1 = new SettingsSection({ title: "Regional Format Overrides" });
      const cards1 = [
        new SettingsCard({ title: "System Lang Standard", description: "Translate labels using local translations packages", control: this._createSelect(["English (US)", "Spanish (ES)", "French (FR)"], "English (US)") }).render(),
        new SettingsCard({ title: "Operator Display Currency", description: "Notation character prepending values quantities", control: this._createSelect(["USD ($)", "EUR (€)", "INR (₹)"], "USD ($)") }).render()
      ];
      wrap.appendChild(p1.render(cards1));

    } else if (this.section === "security") {
      const p1 = new SettingsSection({ title: "Password Policies Configuration" });
      const cards1 = [
        new SettingsCard({ title: "Min Password Length", description: "Minimum count digits credentials must possess", control: this._createInput("8 characters", "Min Length") }).render(),
        new SettingsCard({ title: "Auto Session Logout Time", description: "Minutes of client inactivity triggering automatic lock", control: this._createInput("15 minutes", "Idle minutes timeout") }).render()
      ];
      wrap.appendChild(p1.render(cards1));

    } else if (this.section === "about") {
      const p1 = new SettingsSection({ title: "Product Version & Info" });
      const cards1 = [
        new SettingsCard({ title: "Release Version ID", description: "Currently running client compiler package release version tag", control: this._createInput("0.2.0 (Phase 5 Prep)", "Version") }).render(),
        new SettingsCard({ title: "License Evaluation Status", description: "Software subscription evaluation credentials checks", control: this._createInput("Active Enterprise License", "License Status") }).render()
      ];
      wrap.appendChild(p1.render(cards1));
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

    // Remove existing items from content pane
    const prevHeader = pane.querySelector(".settings-content-header");
    const prevBody   = pane.querySelector(".settings-scroll-body");
    if (prevHeader) prevHeader.remove();
    if (prevBody)   prevBody.remove();

    // 1. Header (Breadcrumbs + Category Label)
    const header = document.createElement("header");
    header.className = "settings-content-header";

    const breadcrumbs = new SettingsBreadcrumb({
      section: this.activeSection.charAt(0).toUpperCase() + this.activeSection.slice(1)
    });
    header.appendChild(breadcrumbs.render());
    pane.appendChild(header);

    // 2. Body scroll views content card list
    const body = new SettingsContent({ section: this.activeSection });
    pane.appendChild(body.render());
  }

  render() {
    const mainWrap = document.createElement("div");
    mainWrap.className = "settings-module-wrapper";

    // A. Left navigation sidebar
    const sidebar = new SettingsSidebar({
      activeSection: this.activeSection,
      onSelect: (secKey) => {
        this.activeSection = secKey;
        this._updateWorkspace();
      }
    });
    mainWrap.appendChild(sidebar.render());

    // B. Right settings workspace viewport
    const contentPane = document.createElement("div");
    contentPane.className = "settings-content-pane";
    mainWrap.appendChild(contentPane);

    this.element = mainWrap;

    this._updateWorkspace();

    return mainWrap;
  }
}
