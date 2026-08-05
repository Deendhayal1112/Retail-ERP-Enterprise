/**
 * Dashboard.js
 * Retail ERP Enterprise — Reusable Main Dashboard Page Component
 *
 * Implements the layout component orchestrating child panels and cards.
 * Strict limits: Layout-only, under 150 lines total.
 */

"use strict";

import DashboardLayout   from "./DashboardLayout.js";
import DashboardHeader   from "./DashboardHeader.js";
import DashboardToolbar  from "./DashboardToolbar.js";
import DashboardHero     from "./DashboardHero.js";
import KPIGrid           from "./KPIGrid.js";
import SalesOverview     from "./SalesOverview.js";
import RevenueAnalytics  from "./RevenueAnalytics.js";
import InventoryAnalytics from "./InventoryAnalytics.js";
import BusinessHealth    from "./BusinessHealth.js";
import TopProducts       from "./TopProducts.js";
import QuickActions      from "./QuickActions.js";
import Notifications     from "./Notifications.js";
import RecentActivity    from "./RecentActivity.js";
import Favorites         from "./Favorites.js";
import FooterStatus      from "./FooterStatus.js";

export default class DashboardHome {
  constructor(options = {}) {
    this.options = options;
    this.element = null;

    // Instantiate modular child components
    this.layout             = new DashboardLayout();
    this.header             = new DashboardHeader();
    this.toolbar            = new DashboardToolbar();
    this.hero               = new DashboardHero();
    this.kpiGrid            = new KPIGrid();
    this.salesOverview      = new SalesOverview();
    this.revenueAnalytics   = new RevenueAnalytics();
    this.inventoryAnalytics = new InventoryAnalytics();
    this.businessHealth     = new BusinessHealth();
    this.topProducts        = new TopProducts();
    this.quickActions       = new QuickActions();
    this.notifications      = new Notifications();
    this.recentActivity     = new RecentActivity();
    this.favorites          = new Favorites();
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
      toolbar:            this.toolbar.render(),
      hero:               this.hero.render(),
      kpiGrid:            this.kpiGrid.render(),
      salesOverview:      this.salesOverview.render(),
      revenueAnalytics:   this.revenueAnalytics.render(),
      inventoryAnalytics: this.inventoryAnalytics.render(),
      businessHealth:     this.businessHealth.render(),
      topProducts:        this.topProducts.render(),
      quickActions:       this.quickActions.render(),
      notifications:      this.notifications.render(),
      recentActivity:     this.recentActivity.render(),
      favorites:          this.favorites.render(),
      footerStatus:       this.footerStatus.render()
    };

    // Render outer workspace container layout
    const renderedNode = this.layout.render(elements);
    this.element = renderedNode;
    return renderedNode;
  }
}
