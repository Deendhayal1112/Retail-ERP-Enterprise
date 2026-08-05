/**
 * SearchBar.js
 * Retail ERP Enterprise — Top Header Search Input Component
 */

export default class SearchBar {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const div = document.createElement("div");
    div.className = "searchbar-placeholder";
    
    div.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; background-color: var(--bg-input || #2c3e50); padding: 6px 12px; border-radius: var(--radius-md || 4px); border: 1px solid var(--border-light || #475569);">
        <span style="font-size: 0.825rem; opacity: 0.7;">🔍</span>
        <input type="text" placeholder="Search modules, invoices..." style="background: transparent; border: none; outline: none; color: inherit; font-size: 0.825rem; width: 220px;" />
      </div>
    `;
    
    this.element = div;
    return div;
  }
}
