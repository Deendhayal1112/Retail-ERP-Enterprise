/**
 * Sidebar.js
 * Retail ERP Enterprise — Sidebar Navigation component
 *
 * Implements navigation links placeholders for:
 * - Dashboard, POS Billing, Products, Categories, Inventory, Purchase,
 * - Customers, Suppliers, Employees, Marketing, Reports, Settings,
 * - License, Profile, Logout.
 */

export default class Sidebar {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
    
    // Routing keys and display labels placeholders
    this.navItems = [
      { key: "dashboard", label: "Dashboard", icon: "📊" },
      { key: "pos", label: "POS Billing", icon: "💳" },
      { key: "products", label: "Products", icon: "📦" },
      { key: "categories", label: "Categories", icon: "🏷️" },
      { key: "inventory", label: "Inventory", icon: "📋" },
      { key: "purchase", label: "Purchase", icon: "🛍️" },
      { key: "customers", label: "Customers", icon: "👥" },
      { key: "suppliers", label: "Suppliers", icon: "🏢" },
      { key: "employees", label: "Employees", icon: "👔" },
      { key: "marketing", label: "Marketing", icon: "📢" },
      { key: "reports", label: "Reports", icon: "📈" },
      { key: "settings", label: "Settings", icon: "⚙️" },
      { key: "license", label: "License", icon: "🔑" },
      { key: "profile", label: "Profile", icon: "👤" },
      { key: "logout", label: "Logout", icon: "🚪" }
    ];
  }

  /**
   * Renders the navigation panel element.
   * @returns {HTMLElement} The sidebar navigation element.
   */
  render() {
    const container = document.createElement("div");
    container.className = "sidebar-navigation-panel";

    // Header Logo Area
    const logoArea = document.createElement("div");
    logoArea.className = "sidebar-logo-area";
    logoArea.innerHTML = `
      <span class="logo-text">Retail<span class="logo-accent">ERP</span></span>
      <span class="logo-version">v0.2.0</span>
    `;
    container.appendChild(logoArea);

    // Navigation Links List
    const navList = document.createElement("ul");
    navList.className = "sidebar-nav-list";

    this.navItems.forEach(item => {
      const listItem = document.createElement("li");
      listItem.className = `sidebar-nav-item item-${item.key}`;
      
      const link = document.createElement("a");
      link.href = "#";
      link.className = "sidebar-nav-link";
      link.setAttribute("data-route", item.key);
      
      // Placeholder click routing handler
      link.addEventListener("click", (e) => {
        e.preventDefault();
        console.log(`[Router Placeholder] Navigating to module: ${item.key}`);
        if (item.key === "logout") {
          console.log("[Router Placeholder] Triggering secure session logout sequence.");
        }
      });

      link.innerHTML = `
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label">${item.label}</span>
      `;

      listItem.appendChild(link);
      navList.appendChild(listItem);
    });

    container.appendChild(navList);
    this.element = container;
    return container;
  }
}
