"use strict";

class UserMenu {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "usermenu-placeholder";
    div.textContent = "UserMenu Placeholder";
    this.element = div;
    return div;
  }
}

module.exports = UserMenu;
