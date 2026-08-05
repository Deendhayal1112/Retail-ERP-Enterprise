"use strict";

class RecentActivity {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "recentactivity-placeholder";
    div.textContent = "RecentActivity Placeholder";
    this.element = div;
    return div;
  }
}

module.exports = RecentActivity;
