"use strict";

class KPICard {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "kpicard-placeholder";
    div.textContent = "KPICard Placeholder";
    this.element = div;
    return div;
  }
}

module.exports = KPICard;
