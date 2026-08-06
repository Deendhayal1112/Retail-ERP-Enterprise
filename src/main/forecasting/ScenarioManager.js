/**
 * ScenarioManager.js
 * Retail ERP Enterprise — Best, Expected, and Worst Case scenario simulators
 */

"use strict";

class ScenarioManager {
  constructor() {
    this.baseRevenue = 124500.00; // base Indian Rupee value
    this.risks = [
      { id: "RISK-01", description: "Supply chain logistics disruption", probability: "Medium (45%)", impactCount: "-₹18,000.00" },
      { id: "RISK-02", description: "Local hardware supplier delay", probability: "Low (15%)", impactCount: "-₹8,500.00" }
    ];
    this.recommendations = [
      { id: "REC-901", tip: "Maintain safety stock above 25 units for critical thermal rolls.", expectedSavings: "₹12,000.00" },
      { id: "REC-902", tip: "Trigger bulk purchase orders on TechWorld vendor to reduce lead times.", expectedSavings: "₹24,500.00" }
    ];
  }

  async runSimulation(growthRate = 5) {
    const factor = 1 + (growthRate / 100);
    const expectedRevenue = this.baseRevenue * factor;
    const bestRevenue = expectedRevenue * 1.2;  // 20% higher
    const worstRevenue = expectedRevenue * 0.75; // 25% lower

    return {
      growthRate: `${growthRate}%`,
      cases: {
        expected: `₹${expectedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        best: `₹${bestRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        worst: `₹${worstRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      },
      risks: this.risks,
      recommendations: this.recommendations
    };
  }
}

module.exports = ScenarioManager;
