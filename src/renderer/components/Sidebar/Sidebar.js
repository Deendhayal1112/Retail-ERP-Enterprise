/**
 * Sidebar.js
 * Retail ERP Enterprise — Reusable Navigation Sidebar
 *
 * Implements collapsible navigation panels, menu group definitions, nested submenus,
 * active path updates, permission-based checks, and keyboard focus controls.
 */

"use strict";

export default class Sidebar {
  constructor(options = {}) {
    this.options = {
      activeRoute: "dashboard",
      userPermissions: options.userPermissions || ["all"], // "all" grants all, or list specific permission keys
      userContext: options.userContext || { full_name: "Admin Operator", role_name: "Administrator" },
      ...options
    };
    
    this.element = null;
    this.isCollapsed = false;

    // 1. Definition list for all modules mapping categories, icons, and nested nodes
    this.menuStructure = [
      {
        type: "group",
        label: "", // empty label to match mockup style
        items: [
          { key: "dashboard", label: "Dashboard", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>` },
          { key: "pos", label: "POS Billing", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="12" y1="10" x2="12" y2="10"></line><line x1="12" y1="14" x2="12" y2="14"></line><line x1="16" y1="10" x2="16" y2="10"></line><line x1="16" y1="14" x2="16" y2="14"></line><line x1="8" y1="10" x2="8" y2="10"></line><line x1="8" y1="14" x2="8" y2="14"></line></svg>`, badge: "F2" },
          { key: "products", label: "Products", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>` },
          { key: "inventory", label: "Inventory", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>` },
          { key: "purchase", label: "Purchase", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>` },
          { key: "customers", label: "Customers", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>` },
          { key: "employees", label: "Employees", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>` },
          { key: "reports", label: "Reports", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>` },
          { key: "marketing", label: "Marketing", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.5 7.5"></path><path d="M14 14l-1.5-1.5"></path></svg>`, badge: "New" }
        ]
      },
      {
        type: "group",
        label: "Tools",
        items: [
          { key: "ai-import", label: "AI Invoice Import", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>` },
          { key: "backup", label: "Backup & Restore", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"></path></svg>` },
          { key: "security", label: "Security & Compliance", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>` },
          {
            key: "diagnostics",
            label: "System Diagnostics",
            icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
            children: [
              { key: "release-center", label: "Release Center" },
              { key: "release-management", label: "Release Management" },
              { key: "performance", label: "Performance Center" },
              { key: "renderer-performance", label: "Renderer Optimization" },
              { key: "database-tuning", label: "Database Tuning" },
              { key: "memory-management", label: "Memory Management" },
              { key: "startup-profiler", label: "Startup Profiler" },
              { key: "bundle-optimizer", label: "Bundle Optimizer" },
              { key: "background-tasks", label: "Background Tasks" },
              { key: "diagnostics-health", label: "Diagnostics & Health" },
              { key: "enterprise-qa", label: "Enterprise QA" },
              { key: "cicd-pipeline", label: "CI/CD Pipeline" }
            ]
          },
          { key: "docs-center", label: "Help & Documentation", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>` },
          { key: "settings", label: "Settings", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>` },
          { key: "license", label: "License", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>` },
          { key: "profile", label: "Profile", icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>` }
        ]
      }
    ];
  }

  hasPermission(permission) {
    if (!permission) return true;
    if (this.options.userPermissions.includes("all")) return true;
    return this.options.userPermissions.includes(permission);
  }

  render() {
    const sidebarContainer = document.createElement("div");
    sidebarContainer.className = "sidebar-navigation-panel";
    if (this.isCollapsed) {
      sidebarContainer.className += " collapsed";
    }

    // A. Logo Area
    sidebarContainer.appendChild(this.renderLogo());

    // B. Navigation Scroll wrapper
    const scrollArea = document.createElement("div");
    scrollArea.className = "sidebar-nav-scroll-area";
    const navList = document.createElement("ul");
    navList.className = "sidebar-nav-list";

    this.menuStructure.forEach(group => {
      // Create Sidebar Group
      const groupEl = this.renderGroup(group);
      if (groupEl) {
        navList.appendChild(groupEl);
      }
    });

    scrollArea.appendChild(navList);
    sidebarContainer.appendChild(scrollArea);

    // C. Footer panel Area
    sidebarContainer.appendChild(this.renderFooter(sidebarContainer));

    this.element = sidebarContainer;
    this.setupKeyboardNavigation();

    return sidebarContainer;
  }

  renderLogo() {
    const logoArea = document.createElement("div");
    logoArea.className = "sidebar-logo-area";

    logoArea.innerHTML = `
      <div class="logo-icon-box" title="Retail ERP">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      </div>
      <div class="logo-info">
        <h2 class="logo-title">Retail ERP<span class="status-indicator-dot" title="Local System Active"></span></h2>
        <span class="logo-subtitle">Smart Retail Management</span>
      </div>
    `;
    return logoArea;
  }

  renderGroup(group) {
    // Check if group has visible items after permission filter
    const visibleItems = group.items.filter(item => this.hasPermission(item.permission));
    if (visibleItems.length === 0) return null;

    const groupFragment = document.createDocumentFragment();

    // Group Title Header (only if label is provided)
    if (group.label) {
      const groupHeader = document.createElement("li");
      groupHeader.className = "sidebar-group-header";
      groupHeader.textContent = group.label;
      groupFragment.appendChild(groupHeader);
    }

    // Render each item
    visibleItems.forEach(item => {
      const itemEl = this.renderItem(item);
      groupFragment.appendChild(itemEl);
    });

    return groupFragment;
  }

  renderItem(item) {
    const listItem = document.createElement("li");
    listItem.className = "sidebar-nav-item";

    const link = document.createElement("a");
    link.className = "sidebar-nav-link";
    link.href = "#";
    link.setAttribute("tabindex", "0");
    link.setAttribute("data-route", item.key);

    const isGroupActive = this.options.activeRoute === item.key || 
      (item.children && item.children.some(c => c.key === this.options.activeRoute));

    if (this.options.activeRoute === item.key && !item.children) {
      link.className += " active";
    }

    // Left content (Icon + label)
    const content = document.createElement("div");
    content.className = "nav-link-content";
    content.innerHTML = `
      <span class="nav-icon">${item.icon}</span>
      <span class="nav-label">${item.label}</span>
    `;
    link.appendChild(content);

    // Right content (Badge if present)
    if (item.badge) {
      const badge = document.createElement("span");
      badge.className = `sidebar-nav-badge badge-${item.key}`;
      badge.textContent = item.badge;
      link.appendChild(badge);
    }

    // If item has children submenus
    if (item.children) {
      const arrow = document.createElement("span");
      arrow.className = "nav-arrow";
      arrow.textContent = "▶";
      link.appendChild(arrow);

      // Submenu container
      const subUl = document.createElement("ul");
      subUl.className = "sidebar-submenu";
      
      item.children.forEach(child => {
        const subLi = document.createElement("li");
        const subLink = document.createElement("a");
        subLink.className = "submenu-link";
        subLink.href = "#";
        subLink.textContent = child.label;
        subLink.setAttribute("data-route", child.key);
        subLink.setAttribute("tabindex", "-1");

        if (this.options.activeRoute === child.key) {
          subLink.className += " active";
          subUl.className += " expanded";
          link.className += " expanded";
        }

        subLink.addEventListener("click", (e) => {
          e.preventDefault();
          this.setActiveRoute(child.key);
        });

        subLi.appendChild(subLink);
        subUl.appendChild(subLi);
      });

      // Expand / collapse action click listener
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const isExpanded = link.classList.toggle("expanded");
        subUl.classList.toggle("expanded", isExpanded);
      });

      listItem.appendChild(link);
      listItem.appendChild(subUl);
    } else {
      // Standard item route clicks
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.setActiveRoute(item.key);
      });
      listItem.appendChild(link);
    }

    return listItem;
  }

  renderFooter(panelContainer) {
    const footer = document.createElement("div");
    footer.className = "sidebar-footer";

    // Store profile metadata
    const storeInfo = document.createElement("div");
    storeInfo.className = "sidebar-footer-store-info";
    
    storeInfo.innerHTML = `
      <div class="store-details">
        <span class="store-name">ABC Textiles</span>
        <span class="store-id">Store ID: ST1001</span>
      </div>
      <div class="license-badge-row">
        <span class="license-badge">
          Licensed <span class="license-check">✓</span>
        </span>
      </div>
      <span class="license-expiry">Valid till: 31 Dec 2025</span>
    `;
    footer.appendChild(storeInfo);

    // Collapsed Toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "sidebar-collapse-toggle";
    toggleBtn.setAttribute("aria-label", "Toggle sidebar collapse");
    toggleBtn.innerHTML = "◀";
    
    toggleBtn.addEventListener("click", () => {
      this.isCollapsed = !this.isCollapsed;
      panelContainer.classList.toggle("collapsed", this.isCollapsed);
      toggleBtn.innerHTML = this.isCollapsed ? "▶" : "◀";
    });

    footer.appendChild(toggleBtn);
    return footer;
  }

  setActiveRoute(routeKey) {
    this.options.activeRoute = routeKey;
    console.log(`[Router Action] Navigating to: ${routeKey}`);
    
    // Clear existing active items
    const allLinks = this.element.querySelectorAll(".sidebar-nav-link, .submenu-link");
    allLinks.forEach(l => l.classList.remove("active"));

    // Find and highlight target active link
    const targetLink = this.element.querySelector(`[data-route="${routeKey}"]`);
    if (targetLink) {
      targetLink.classList.add("active");
      
      // If nested inside a submenu, expand parent group link
      const parentSubmenu = targetLink.closest(".sidebar-submenu");
      if (parentSubmenu) {
        parentSubmenu.classList.add("expanded");
        const parentLink = parentSubmenu.previousElementSibling;
        if (parentLink) parentLink.classList.add("expanded");
      }
    }
  }

  setupKeyboardNavigation() {
    if (!this.element) return;

    this.element.addEventListener("keydown", (e) => {
      const focusable = Array.from(this.element.querySelectorAll(".sidebar-nav-link, .sidebar-collapse-toggle"));
      const currentIdx = focusable.indexOf(document.activeElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIdx = (currentIdx + 1) % focusable.length;
        focusable[nextIdx].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIdx = (currentIdx - 1 + focusable.length) % focusable.length;
        focusable[prevIdx].focus();
      }
    });
  }
}
