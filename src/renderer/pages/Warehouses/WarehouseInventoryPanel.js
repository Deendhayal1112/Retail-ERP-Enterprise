/**
 * WarehouseInventoryPanel.js
 * Retail ERP Enterprise — Warehouses Zonal Inventory Allocations Panel
 */

"use strict";

export default class WarehouseInventoryPanel {
  /**
   * @param {Object} options
   * @param {Array}  options.inventory  Inventory stock maps.
   * @param {Array}  options.warehouses List of warehouses.
   */
  constructor(options = {}) {
    this.inventory = options.inventory || [];
    this.warehouses = options.warehouses || [];
    this.selectedWarehouseId = this.warehouses[0]?.id || "";
  }

  render() {
    const panel = document.createElement("div");
    panel.className = "warehouse-inventory-panel";

    const selectRow = document.createElement("div");
    selectRow.className = "warehouse-select-row";
    selectRow.innerHTML = `
      <label class="select-label font-semibold">Select Warehouse Context:</label>
      <select class="warehouse-dropdown-select">
        ${this.warehouses.map(w => `<option value="${w.id}" ${w.id === this.selectedWarehouseId ? "selected" : ""}>${w.name}</option>`).join("")}
      </select>
    `;
    panel.appendChild(selectRow);

    const tableWrapper = document.createElement("div");
    tableWrapper.className = "inventory-table-wrapper";
    panel.appendChild(tableWrapper);

    const renderTable = () => {
      const filteredStock = this.inventory.filter(x => x.warehouseId === this.selectedWarehouseId);
      
      if (filteredStock.length === 0) {
        tableWrapper.innerHTML = `<div class="empty-state-inner">No allocated inventory items found in this warehouse.</div>`;
        return;
      }

      tableWrapper.innerHTML = `
        <table class="inventory-alloc-table">
          <thead>
            <tr>
              <th>Product SKU</th>
              <th class="text-center">Available Stock</th>
              <th class="text-center">Reserved Stock</th>
              <th class="text-center">Damaged Stock</th>
              <th class="text-center">Returned Stock</th>
              <th>Current Valuation</th>
              <th>Bin Location / Zone</th>
            </tr>
          </thead>
          <tbody>
            ${filteredStock.map(inv => {
              return `
                <tr>
                  <td class="font-mono font-semibold">${inv.sku}</td>
                  <td class="text-center font-bold text-success">${inv.available.toLocaleString()} qty</td>
                  <td class="text-center text-primary">${inv.reserved.toLocaleString()} qty</td>
                  <td class="text-center text-danger">${inv.damaged.toLocaleString()} qty</td>
                  <td class="text-center text-neutral">${inv.returned.toLocaleString()} qty</td>
                  <td class="font-mono font-semibold">₹${inv.valuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span class="bin-location font-mono text-xs">${inv.bin}</span>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      `;
    };

    const dropdown = selectRow.querySelector(".warehouse-dropdown-select");
    dropdown.addEventListener("change", (e) => {
      this.selectedWarehouseId = e.target.value;
      renderTable();
    });

    renderTable();

    return panel;
  }
}
