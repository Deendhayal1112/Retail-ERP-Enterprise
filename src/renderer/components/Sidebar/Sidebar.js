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
        label: "Core Operations",
        items: [
          { key: "dashboard", label: "Dashboard", icon: "📊", permission: "dashboard:read" },
          { key: "pos", label: "POS Billing", icon: "💳", permission: "billing:create" }
        ]
      },
      {
        type: "group",
        label: "Inventory Mgmt",
        items: [
          {
            key: "products-group",
            label: "Catalog",
            icon: "📦",
            permission: "inventory:read",
            children: [
              { key: "products", label: "Products List" },
              { key: "categories", label: "Categories Grid" }
            ]
          },
          { key: "inventory", label: "Inventory Stock", icon: "📋", permission: "inventory:write" },
          { key: "purchase", label: "Purchase Orders", icon: "🛍️", permission: "purchase:write" }
        ]
      },
      {
        type: "group",
        label: "Partners & staff",
        items: [
          { key: "sales", label: "Sales Log", icon: "📈", permission: "reports:read" },
          { key: "customers", label: "Customers Catalog", icon: "👥", permission: "users:read" },
          { key: "suppliers", label: "Suppliers List", icon: "🏢", permission: "users:read" },
          { key: "employees", label: "Employees Roster", icon: "👔", permission: "users:write" }
        ]
      },
      {
        type: "group",
        label: "Control Panel",
        items: [
          { key: "marketing", label: "Marketing Campaigns", icon: "📢", permission: "marketing:read" },
          { key: "reports", label: "Reports & Analytics", icon: "📊", permission: "reports:read" },
          { key: "settings", label: "Settings", icon: "⚙️", permission: "settings:write" },
          { key: "license", label: "License & Evaluation", icon: "🔑", permission: "settings:write" }
        ]
      }
    ];
  }

  /**
   * Evaluates if the current operator has access to a specific permission key.
   * @param {string} permission Code string.
   * @returns {boolean} Check result.
   */
  hasPermission(permission) {
    if (!permission) return true;
    if (this.options.userPermissions.includes("all")) return true;
    return this.options.userPermissions.includes(permission);
  }

  /**
   * Renders the complete Sidebar DOM node tree.
   * @returns {HTMLElement} The sidebar DOM node.
   */
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

  /**
   * Renders logo section.
   */
  renderLogo() {
    const logoArea = document.createElement("div");
    logoArea.className = "sidebar-logo-area";

    logoArea.innerHTML = `
      <div class="logo-icon-box" title="Retail ERP">R</div>
      <div class="logo-info">
        <h2 class="logo-title">Retail ERP<span class="status-indicator-dot" title="Local System Active"></span></h2>
        <span class="logo-subtitle">Enterprise Edition</span>
      </div>
    `;
    return logoArea;
  }

  /**
   * Renders group heading wrapper and items list.
   */
  renderGroup(group) {
    // Check if group has visible items after permission filter
    const visibleItems = group.items.filter(item => this.hasPermission(item.permission));
    if (visibleItems.length === 0) return null;

    const groupFragment = document.createDocumentFragment();

    // Group Title Header
    const groupHeader = document.createElement("li");
    groupHeader.className = "sidebar-group-header";
    groupHeader.textContent = group.label;
    groupFragment.appendChild(groupHeader);

    // Render each item
    visibleItems.forEach(item => {
      const itemEl = this.renderItem(item);
      groupFragment.appendChild(itemEl);
    });

    return groupFragment;
  }

  /**
   * Renders item links and sub-menus.
   */
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

  /**
   * Renders the footer metadata, user context, and collapse toggle button.
   */
  renderFooter(panelContainer) {
    const footer = document.createElement("div");
    footer.className = "sidebar-footer";

    // User Profile
    const profile = document.createElement("div");
    profile.className = "sidebar-footer-profile";
    const initials = this.options.userContext.full_name.split(" ").map(n => n[0]).join("").substring(0, 2);
    
    profile.innerHTML = `
      <div class="profile-avatar">${initials}</div>
      <div class="profile-info sidebar-footer-info">
        <span class="profile-name">${this.options.userContext.full_name}</span>
        <span class="profile-role">${this.options.userContext.role_name}</span>
      </div>
    `;
    footer.appendChild(profile);

    // Sidebar divider
    const divider = document.createElement("div");
    divider.className = "sidebar-divider";
    footer.appendChild(divider);

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

  /**
   * Sets the active route key and triggers visual highlights.
   * @param {string} routeKey Key of the target route.
   */
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

  /**
   * Keyboard arrow key and focus controls.
   */
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
