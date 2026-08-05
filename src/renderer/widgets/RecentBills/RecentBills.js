"use strict";

class RecentBills {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "recentbills-placeholder";
    div.textContent = "RecentBills Placeholder";
    this.element = div;
    return div;
  }
}

module.exports = RecentBills;
