"use strict";

class Breadcrumb {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "breadcrumb-placeholder";
    div.textContent = "Breadcrumb Placeholder";
    this.element = div;
    return div;
  }
}

module.exports = Breadcrumb;
