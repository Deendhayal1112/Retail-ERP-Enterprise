"use strict";

class LowStock {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "lowstock-placeholder";
    div.textContent = "LowStock Placeholder";
    this.element = div;
    return div;
  }
}

module.exports = LowStock;
