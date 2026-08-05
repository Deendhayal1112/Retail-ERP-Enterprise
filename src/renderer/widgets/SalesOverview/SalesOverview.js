"use strict";

class SalesOverview {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "salesoverview-placeholder";
    div.textContent = "SalesOverview Placeholder";
    this.element = div;
    return div;
  }
}

module.exports = SalesOverview;
