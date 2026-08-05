/**
 * Dashboard.js
 * Retail ERP Enterprise — Main Dashboard Rebuilt Component
 *
 * Serves solely as the layout mounting entrypoint.
 * Under 150 lines total.
 */

"use strict";

import DashboardLayout    from "./DashboardLayout.js";
import DashboardHeader    from "./DashboardHeader.js";
import KPIGrid            from "./KPIGrid.js";
import SalesOverview      from "./SalesOverview.js";
import TopProducts        from "./TopProducts.js";
import BusinessSummary    from "./BusinessSummary.js";
import InventoryAnalytics from "./InventoryAnalytics.js";
import RecentActivity     from "./RecentActivity.js";
import Notifications      from "./Notifications.js";
import FooterStatus       from "./FooterStatus.js";

export default class DashboardHome {
  constructor(options = {}) {
    this.options = options;
    this.element = null;

    // Instantiate modular child components matching the screenshot
    this.layout             = new DashboardLayout();
    this.header             = new DashboardHeader();
    this.kpiGrid            = new KPIGrid();
    this.salesOverview      = new SalesOverview();
    this.topProducts        = new TopProducts();
    this.businessSummary    = new BusinessSummary();
    this.inventoryAnalytics = new InventoryAnalytics();
    this.recentActivity     = new RecentActivity();
    this.notifications      = new Notifications();
    this.footerStatus       = new FooterStatus();
  }

  /**
   * Renders the complete dashboard workspace page.
   * @returns {HTMLElement} Mountable DOM layout tree node.
   */
  render() {
    // Compile child widgets inside layout mapping
    const elements = {
      header:             this.header.render(),
      kpiGrid:            this.kpiGrid.render(),
      salesOverview:      this.salesOverview.render(),
      topProducts:        this.topProducts.render(),
      businessSummary:    this.businessSummary.render(),
      inventoryAnalytics: this.inventoryAnalytics.render(),
      recentActivity:     this.recentActivity.render(),
      notifications:      this.notifications.render(),
      footerStatus:       this.footerStatus.render()
    };

    // Render outer workspace container layout
    const renderedNode = this.layout.render(elements);
    this.element = renderedNode;
    return renderedNode;
  }
}
