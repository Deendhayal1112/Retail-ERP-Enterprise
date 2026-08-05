"use strict";

class InventorySummary {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "inventorysummary-placeholder";
    div.textContent = "InventorySummary Placeholder";
    this.element = div;
    return div;
  }
}

module.exports = InventorySummary;
