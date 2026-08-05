"use strict";

class SearchBar {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "searchbar-placeholder";
    div.textContent = "SearchBar Placeholder";
    this.element = div;
    return div;
  }
}

module.exports = SearchBar;
