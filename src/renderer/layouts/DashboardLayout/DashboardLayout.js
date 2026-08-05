/**
 * DashboardLayout.js
 * Retail ERP Enterprise — Main UI Page Shell Wrapper
 *
 * Implements the core multi-pane workspace layout consisting of:
 * - Left sidebar navigation menu placeholder
 * - Top header controls toolbar placeholder
 * - Central content viewport area
 * - Bottom status information bar placeholder
 */

"use strict";

const Sidebar = require("../../components/Sidebar");
const Header = require("../../components/Header");
const Footer = require("../../components/Footer");

class DashboardLayout {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
    
    // Instantiate sub-components
    this.sidebar = new Sidebar();
    this.header = new Header();
    this.footer = new Footer();
  }

  /**
   * Renders the layout grid wrapping sub-components.
   * @param {HTMLElement} contentNode The main workspace content element.
   * @returns {HTMLElement} The populated dashboard layout node.
   */
  render(contentNode) {
    const layoutContainer = document.createElement("div");
    layoutContainer.className = "dashboard-layout-container";

    // 1. Sidebar Column Section
    const sidebarWrapper = document.createElement("aside");
    sidebarWrapper.className = "layout-sidebar-column";
    sidebarWrapper.appendChild(this.sidebar.render());

    // 2. Right Pane (Header + Content + Footer)
    const rightPane = document.createElement("div");
    rightPane.className = "layout-right-pane";

    // Header Row
    const headerWrapper = document.createElement("header");
    headerWrapper.className = "layout-header-row";
    headerWrapper.appendChild(this.header.render());

    // Main Content Row
    const mainContentWrapper = document.createElement("main");
    mainContentWrapper.className = "layout-content-viewport";
    if (contentNode) {
      mainContentWrapper.appendChild(contentNode);
    } else {
      const placeholder = document.createElement("div");
      placeholder.textContent = "No content loaded.";
      mainContentWrapper.appendChild(placeholder);
    }

    // Footer Row
    const footerWrapper = document.createElement("footer");
    footerWrapper.className = "layout-footer-row";
    footerWrapper.appendChild(this.footer.render());

    // Assemble right pane
    rightPane.appendChild(headerWrapper);
    rightPane.appendChild(mainContentWrapper);
    rightPane.appendChild(footerWrapper);

    // Assemble outer layout grid
    layoutContainer.appendChild(sidebarWrapper);
    layoutContainer.appendChild(rightPane);

    this.element = layoutContainer;
    return layoutContainer;
  }
}

module.exports = DashboardLayout;
