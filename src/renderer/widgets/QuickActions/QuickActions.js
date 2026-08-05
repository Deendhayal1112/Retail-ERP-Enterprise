"use strict";

class QuickActions {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "quickactions-placeholder";
    div.textContent = "QuickActions Placeholder";
    this.element = div;
    return div;
  }
}

module.exports = QuickActions;
