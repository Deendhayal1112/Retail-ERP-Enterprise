/**
 * StockTransferPanel.js
 * Retail ERP Enterprise — Stock Transfer Requests Panel
 */

"use strict";

export default class StockTransferPanel {
  /**
   * @param {Object}   options
   * @param {Array}    options.transfers        List of stock transfers.
   * @param {Array}    options.warehouses       List of warehouses.
   * @param {Function} options.onSubmitTransfer Callback when a transfer request is submitted.
   * @param {Function} options.onApprove        Callback to approve transfer.
   * @param {Function} options.onReceive        Callback to mark received.
   */
  constructor(options = {}) {
    this.transfers = options.transfers || [];
    this.warehouses = options.warehouses || [];
    this.onSubmitTransfer = options.onSubmitTransfer || null;
    this.onApprove = options.onApprove || null;
    this.onReceive = options.onReceive || null;
  }

  render() {
    const panel = document.createElement("div");
    panel.className = "stock-transfer-panel";

    // Split layout: Left (List / Logs), Right (New Request Form)
    const grid = document.createElement("div");
    grid.className = "transfer-layout-grid";

    // Left List
    const leftCol = document.createElement("div");
    leftCol.className = "transfer-list-column";
    
    leftCol.innerHTML = `
      <h2 class="panel-section-title">Inter-Warehouse Stock Movements</h2>
      <p class="panel-section-desc">Approve pending transfer requests, monitor logistics in-transit, and acknowledge item receipts.</p>
    `;

    if (this.transfers.length === 0) {
      leftCol.innerHTML += `<div class="empty-state-inner">No stock transfer records logs found.</div>`;
    } else {
      const tableContainer = document.createElement("div");
      tableContainer.className = "transfer-table-container";

      tableContainer.innerHTML = `
        <table class="transfer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>SKU / Product</th>
              <th>Qty</th>
              <th>From / To</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.transfers.map(tr => {
              const srcWh = this.warehouses.find(x => x.id === tr.sourceWarehouseId)?.code || "HQ";
              const destWh = this.warehouses.find(x => x.id === tr.destWarehouseId)?.code || "STORE";
              
              let actionHtml = "";
              if (tr.status === "requested") {
                actionHtml = `<button class="btn-table-action btn-approve" data-id="${tr.id}">Approve</button>`;
              } else if (tr.status === "in-transit") {
                actionHtml = `<button class="btn-table-action btn-receive" data-id="${tr.id}">Receive</button>`;
              } else {
                actionHtml = `<span class="completed-check font-semibold">✓ CLOSED</span>`;
              }

              let badgeClass = "badge-neutral";
              if (tr.status === "in-transit") badgeClass = "badge-warning";
              else if (tr.status === "received") badgeClass = "badge-success";
              else if (tr.status === "requested") badgeClass = "badge-primary";

              return `
                <tr>
                  <td class="font-mono text-xs">${tr.id}</td>
                  <td>
                    <span class="product-sku font-mono font-semibold">${tr.sku}</span>
                  </td>
                  <td class="font-mono text-center font-bold">${tr.qtyRequested}</td>
                  <td class="text-xs">
                    <span class="wh-code font-semibold">${srcWh}</span> ➔ <span class="wh-code font-semibold">${destWh}</span>
                  </td>
                  <td>
                    <span class="transfer-badge ${badgeClass}">${tr.status.toUpperCase()}</span>
                  </td>
                  <td class="text-right">${actionHtml}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      `;

      // Event listeners for approve / receive actions
      tableContainer.querySelectorAll(".btn-approve").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          if (this.onApprove) this.onApprove(id);
        });
      });

      tableContainer.querySelectorAll(".btn-receive").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          if (this.onReceive) this.onReceive(id);
        });
      });

      leftCol.appendChild(tableContainer);
    }

    // Right Form
    const rightCol = document.createElement("div");
    rightCol.className = "transfer-form-column";

    rightCol.innerHTML = `
      <h3 class="form-title">Create Stock Transfer Request</h3>
      <p class="form-subtitle">Initiate a mock stock distribution query.</p>
      
      <form class="new-transfer-form">
        <div class="form-field">
          <label>Source Warehouse</label>
          <select name="src-wh" required>
            ${this.warehouses.map(w => `<option value="${w.id}">${w.name} (${w.code})</option>`).join("")}
          </select>
        </div>
        <div class="form-field mt-3">
          <label>Destination Warehouse</label>
          <select name="dest-wh" required>
            ${this.warehouses.map(w => `<option value="${w.id}">${w.name} (${w.code})</option>`).join("")}
          </select>
        </div>
        <div class="form-field mt-3">
          <label>Product Item SKU</label>
          <input type="text" name="sku" placeholder="e.g. APP-SHIRT-COTTON" required />
        </div>
        <div class="form-field mt-3">
          <label>Quantity to Transfer</label>
          <input type="number" name="qty" placeholder="100" min="1" required />
        </div>
        <button type="submit" class="btn-submit-transfer">Submit Request</button>
      </form>
    `;

    const form = rightCol.querySelector(".new-transfer-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        sourceWarehouseId: form.elements["src-wh"].value,
        destWarehouseId: form.elements["dest-wh"].value,
        sku: form.elements["sku"].value.trim(),
        qtyRequested: Number(form.elements["qty"].value)
      };

      if (data.sourceWarehouseId === data.destWarehouseId) {
        window.Toast?.show("Source and destination warehouses cannot be the same.", "danger", 3000);
        return;
      }

      if (this.onSubmitTransfer) {
        this.onSubmitTransfer(data);
      }
    });

    grid.appendChild(leftCol);
    grid.appendChild(rightCol);
    panel.appendChild(grid);

    return panel;
  }
}
