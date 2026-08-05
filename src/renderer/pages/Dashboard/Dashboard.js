"use strict";

class Dashboard {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "dashboard-placeholder";
    div.textContent = "Dashboard Placeholder";
    this.element = div;
    return div;
  }
}

module.exports = Dashboard;
