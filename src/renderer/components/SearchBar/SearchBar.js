/**
 * SearchBar.js
 * Retail ERP Enterprise — Top Header Search Input Component
 *
 * Implements interactive search input states, rotated query placeholder helpers,
 * and suggestion listing dropdown tags.
 */

export default class SearchBar {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
    
    // Rotating placeholder text suggestions
    this.placeholders = [
      "Search Products...",
      "Search Bills & Invoices...",
      "Search Customers...",
      "Search Inventory items...",
      "Search Supplier Purchase Orders...",
      "Future AI Search ready..."
    ];
    this.placeholderIdx = 0;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "header-search-bar-wrapper";

    wrapper.innerHTML = `
      <div class="search-input-field-group">
        <span class="search-icon-lens">🔍</span>
        <input type="text" class="search-input-element" placeholder="${this.placeholders[0]}" aria-label="Search Retail ERP" />
      </div>
      <div class="search-suggestions-dropdown-card">
        <div class="suggestion-item-row" data-search-type="product">
          <span class="suggestion-item-badge">Products</span>
          <span>Catalog inventory listings matching query</span>
        </div>
        <div class="suggestion-item-row" data-search-type="invoice">
          <span class="suggestion-item-badge">Invoices</span>
          <span>POS transaction bills logs matching invoice id</span>
        </div>
        <div class="suggestion-item-row" data-search-type="customer">
          <span class="suggestion-item-badge">Customers</span>
          <span>Registered operator or member profiles</span>
        </div>
      </div>
    `;

    const input = wrapper.querySelector(".search-input-element");
    const dropdown = wrapper.querySelector(".search-suggestions-dropdown-card");

    // Dynamic suggestions display on focus
    input.addEventListener("focus", () => {
      dropdown.classList.add("active");
    });

    input.addEventListener("blur", () => {
      // Small timeout to allow suggestion click events to propagate
      setTimeout(() => {
        dropdown.classList.remove("active");
      }, 200);
    });

    // Simple keyboard navigation suggestions logic
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        input.blur();
      }
    });

    // Start rotating placeholders interval
    setInterval(() => {
      this.placeholderIdx = (this.placeholderIdx + 1) % this.placeholders.length;
      input.setAttribute("placeholder", this.placeholders[this.placeholderIdx]);
    }, 4500);

    this.element = wrapper;
    return wrapper;
  }
}
