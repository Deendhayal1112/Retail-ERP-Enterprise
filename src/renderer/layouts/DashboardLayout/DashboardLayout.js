/**
 * DashboardLayout.js
 * Retail ERP Enterprise — Reusable Master Workspace layout component
 *
 * Implements a structured container that encapsulates the fixed 280px left sidebar,
 * the 72px sticky top nav, the 12-column page wrapper grid, and the 40px fixed footer.
 */

import Sidebar from "../../components/Sidebar/Sidebar.js";
import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";

export default class DashboardLayout {
  constructor(options = {}) {
    this.options = options;
    this.element = null;

    // Instantiate layout sections placeholders
    this.sidebar = new Sidebar();
    this.header = new Header();
    this.footer = new Footer();
  }

  /**
   * Renders the layout node.
   * @param {HTMLElement} contentNode Page content element to place inside the viewport grid.
   * @returns {HTMLElement} The complete layout structure element.
   */
  render(contentNode) {
    // 1. Create Layout Container
    const layoutContainer = document.createElement("div");
    layoutContainer.className = "layout-container";

    // 2. Left Sidebar fixed column
    const sidebarColumn = document.createElement("aside");
    sidebarColumn.className = "layout-sidebar-column";
    sidebarColumn.appendChild(this.sidebar.render());
    layoutContainer.appendChild(sidebarColumn);

    // 3. Right side pane (Header, content scroll viewport, Footer status bar)
    const rightPane = document.createElement("div");
    rightPane.className = "layout-right-pane";

    // Sticky Header row
    const headerRow = document.createElement("header");
    headerRow.className = "layout-header-row";
    headerRow.appendChild(this.header.render());
    rightPane.appendChild(headerRow);

    // Main viewport area containing the flexible scroll view
    const contentViewport = document.createElement("section");
    contentViewport.className = "layout-content-viewport";

    // 12-column Page wrapper layout grid
    const pageWrapperGrid = document.createElement("div");
    pageWrapperGrid.className = "page-wrapper-grid";

    if (contentNode) {
      pageWrapperGrid.appendChild(contentNode);
    } else {
      const emptyPlaceholder = document.createElement("div");
      emptyPlaceholder.textContent = "No page content loaded.";
      pageWrapperGrid.appendChild(emptyPlaceholder);
    }

    contentViewport.appendChild(pageWrapperGrid);
    rightPane.appendChild(contentViewport);

    // Fixed Footer row
    const footerRow = document.createElement("footer");
    footerRow.className = "layout-footer-row";
    footerRow.appendChild(this.footer.render());
    rightPane.appendChild(footerRow);

    layoutContainer.appendChild(rightPane);

    this.element = layoutContainer;
    return layoutContainer;
  }
}
