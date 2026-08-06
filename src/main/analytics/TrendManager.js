/**
 * TrendManager.js
 * Retail ERP Enterprise — Sales and Purchases Historical Trend Analyzer
 */

"use strict";

const { TrendTypes } = require("./AnalyticsConstants");

class TrendManager {
  constructor() {
    this.trends = [
      { month: "Jan", [TrendTypes.SALES]: 42000, [TrendTypes.PURCHASES]: 31000, [TrendTypes.CUSTOMERS]: 110, [TrendTypes.SUPPLIERS]: 12, [TrendTypes.INVENTORY]: 290000, [TrendTypes.REVENUE]: 42000 },
      { month: "Feb", [TrendTypes.SALES]: 45000, [TrendTypes.PURCHASES]: 33000, [TrendTypes.CUSTOMERS]: 115, [TrendTypes.SUPPLIERS]: 12, [TrendTypes.INVENTORY]: 300000, [TrendTypes.REVENUE]: 45000 },
      { month: "Mar", [TrendTypes.SALES]: 48000, [TrendTypes.PURCHASES]: 35000, [TrendTypes.CUSTOMERS]: 124, [TrendTypes.SUPPLIERS]: 14, [TrendTypes.INVENTORY]: 310000, [TrendTypes.REVENUE]: 48000 },
      { month: "Apr", [TrendTypes.SALES]: 52000, [TrendTypes.PURCHASES]: 39000, [TrendTypes.CUSTOMERS]: 130, [TrendTypes.SUPPLIERS]: 14, [TrendTypes.INVENTORY]: 295000, [TrendTypes.REVENUE]: 52000 },
      { month: "May", [TrendTypes.SALES]: 58000, [TrendTypes.PURCHASES]: 42000, [TrendTypes.CUSTOMERS]: 142, [TrendTypes.SUPPLIERS]: 15, [TrendTypes.INVENTORY]: 305000, [TrendTypes.REVENUE]: 58000 },
      { month: "Jun", [TrendTypes.SALES]: 64000, [TrendTypes.PURCHASES]: 45000, [TrendTypes.CUSTOMERS]: 155, [TrendTypes.SUPPLIERS]: 15, [TrendTypes.INVENTORY]: 310000, [TrendTypes.REVENUE]: 64000 }
    ];
  }

  async getTrends() {
    return this.trends;
  }
}

module.exports = TrendManager;
