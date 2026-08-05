"use strict";

class Notifications {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "notifications-placeholder";
    div.textContent = "Notifications Placeholder";
    this.element = div;
    return div;
  }
}

module.exports = Notifications;
