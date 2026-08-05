"use strict";

class RevenueChart {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "revenuechart-placeholder";
    div.textContent = "RevenueChart Placeholder";
    this.element = div;
    return div;
  }
}

module.exports = RevenueChart;
