"use strict";

class BusinessSummary {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "businesssummary-placeholder";
    div.textContent = "BusinessSummary Placeholder";
    this.element = div;
    return div;
  }
}

module.exports = BusinessSummary;
