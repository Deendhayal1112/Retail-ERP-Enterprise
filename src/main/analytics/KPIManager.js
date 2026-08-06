/**
 * KPIManager.js
 * Retail ERP Enterprise — Key Performance Indicators manager
 */

"use strict";

const { KPITypes } = require("./AnalyticsConstants");

class KPIManager {
  constructor() {
    this.kpis = [
      { id: "rev", name: KPITypes.REVENUE, value: "$124,500.00", status: "Positive", change: "+14.2%" },
      { id: "prof", name: KPITypes.PROFIT, value: "$45,200.00", status: "Positive", change: "+8.6%" },
      { id: "exp", name: KPITypes.EXPENSES, value: "$79,300.00", status: "Warning", change: "+12.1%" },
      { id: "inv_val", name: KPITypes.INVENTORY_VALUE, value: "$310,000.00", status: "Stable", change: "-2.4%" },
      { id: "margin", name: KPITypes.GROSS_MARGIN, value: "36.3%", status: "Positive", change: "+1.1%" },
      { id: "cash", name: KPITypes.CASH_FLOW, value: "$58,400.00", status: "Positive", change: "+5.3%" }
    ];
  }

  async getKPIs() {
    return this.kpis;
  }
}

module.exports = KPIManager;
