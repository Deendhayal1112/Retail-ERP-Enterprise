/**
 * Dashboard.js
 * Retail ERP Enterprise — Refactored Dashboard Home Page
 *
 * Implements:
 * - DashboardHome (Main page controller rendering one layout cleanly)
 * - BusinessStatus (Operation status bar)
 */

"use strict";

import WelcomeBanner      from "../../components/WelcomeBanner/WelcomeBanner.js";
import { KPIGrid }        from "../../components/KPICard/KPICard.js";
import AnalyticsToolbar   from "../../components/AnalyticsToolbar/AnalyticsToolbar.js";
import SalesTrend         from "../../components/SalesTrend/SalesTrend.js";
import RevenueTrend       from "../../components/RevenueTrend/RevenueTrend.js";
import BusinessComparison from "../../components/BusinessComparison/BusinessComparison.js";
import RecentActivities   from "../../components/RecentActivities/RecentActivities.js";
import Notifications      from "../../components/Notifications/Notifications.js";
import QuickActions       from "../../components/QuickActions/QuickActions.js";
import BusinessHealth     from "../../components/BusinessHealth/BusinessHealth.js";

export class BusinessStatus {
  constructor(options = {}) {
    this.status = options.status || "Operational";
  }

  render() {
    const el = document.createElement("div");
    el.className = "dashboard-business-status-bar";
    el.innerHTML = `
      <div class="business-status-left">
        <span class="status-badge-indicator active"></span>
        <span class="status-label">System Health: <strong>${this.status}</strong></span>
      </div>
      <div class="business-status-right">
        <span class="status-timestamp">Last Sync: Just now</span>
      </div>
    `;
    return el;
  }
}

export default class DashboardHome {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  /**
   * Renders the complete dashboard home interface.
   * @returns {HTMLElement} Mountable grid element.
   */
  render() {
    const outerContainer = document.createElement("div");
    outerContainer.className = "dashboard-grid-container";

    // 1. Header (Welcome Banner + Business Status)
    const headerWrapper = document.createElement("div");
    headerWrapper.className = "dashboard-grid-col col-span-12";
    headerWrapper.appendChild(new WelcomeBanner().render());
    headerWrapper.appendChild(new BusinessStatus().render());
    outerContainer.appendChild(headerWrapper);

    // 2. Toolbar
    const toolbarCol = document.createElement("div");
    toolbarCol.className = "dashboard-grid-col col-span-12";
    toolbarCol.appendChild(new AnalyticsToolbar().render());
    outerContainer.appendChild(toolbarCol);

    // 3. KPI Grid
    const kpiCol = document.createElement("div");
    kpiCol.className = "dashboard-grid-col col-span-12";
    kpiCol.appendChild(new KPIGrid().render());
    outerContainer.appendChild(kpiCol);

    // 4. Charts Grid
    const salesCol = document.createElement("div");
    salesCol.className = "dashboard-grid-col col-span-8";
    salesCol.appendChild(new SalesTrend().render());
    outerContainer.appendChild(salesCol);

    const revenueCol = document.createElement("div");
    revenueCol.className = "dashboard-grid-col col-span-4";
    revenueCol.appendChild(new RevenueTrend().render());
    outerContainer.appendChild(revenueCol);

    // 5. Analytics Grid (Business Comparison + Business Health)
    const comparisonCol = document.createElement("div");
    comparisonCol.className = "dashboard-grid-col col-span-6";
    comparisonCol.appendChild(new BusinessComparison().render());
    outerContainer.appendChild(comparisonCol);

    const healthCol = document.createElement("div");
    healthCol.className = "dashboard-grid-col col-span-6";
    healthCol.appendChild(new BusinessHealth().render());
    outerContainer.appendChild(healthCol);

    // 6. Bottom Grid (Recent Activity, Notifications, Quick Actions)
    const recentCol = document.createElement("div");
    recentCol.className = "dashboard-grid-col col-span-4";
    recentCol.appendChild(new RecentActivities().render());
    outerContainer.appendChild(recentCol);

    const notifyCol = document.createElement("div");
    notifyCol.className = "dashboard-grid-col col-span-4";
    notifyCol.appendChild(new Notifications().render());
    outerContainer.appendChild(notifyCol);

    const quickCol = document.createElement("div");
    quickCol.className = "dashboard-grid-col col-span-4";
    quickCol.appendChild(new QuickActions().render());
    outerContainer.appendChild(quickCol);

    this.element = outerContainer;
    return outerContainer;
  }
}
