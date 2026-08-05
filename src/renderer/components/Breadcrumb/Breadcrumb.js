/**
 * Breadcrumb.js
 * Retail ERP Enterprise — Breadcrumb Module Navigation Component
 */

export default class Breadcrumb {
  constructor(options = {}) {
    this.options = {
      currentModule: "Dashboard",
      ...options
    };
    this.element = null;
  }

  render() {
    const container = document.createElement("div");
    container.className = "header-breadcrumb-container";

    container.innerHTML = `
      <span class="breadcrumb-item hover:underline" style="cursor: pointer;">Retail ERP</span>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">${this.options.currentModule}</span>
    `;

    // Click handler to return to dashboard
    container.firstElementChild.addEventListener("click", () => {
      console.log("[Breadcrumb Action] Returning to workspace home dashboard.");
    });

    this.element = container;
    return container;
  }
}
