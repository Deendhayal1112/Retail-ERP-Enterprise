/**
 * PDFTemplates.js
 * Retail ERP Enterprise — Reusable Desktop PDF Invoice HTML Layouts
 *
 * Implements:
 * - InvoiceTemplate, ReceiptTemplate, ReportTemplate formats
 * - Mapped standard HTML structure variables
 */

"use strict";

export class InvoiceTemplate {
  render(data = {}) {
    return `
      <div class="invoice-box" style="font-family:sans-serif; color:#333;">
        <h2>Sales Invoice</h2>
        <p>Invoice ID: ${data.id || "INV-MOCK-01"}</p>
        <p>Customer: ${data.customer || "Walking Customer"}</p>
        <table style="width:100%; border-collapse:collapse;">
          <tr style="background:#eee;">
            <th style="padding:6px; text-align:left;">Item</th>
            <th style="padding:6px; text-align:right;">Total</th>
          </tr>
          <tr>
            <td style="padding:6px;">Leather Oxford Shoes</td>
            <td style="padding:6px; text-align:right;">$120.00</td>
          </tr>
        </table>
        <h3>Grand Total: $120.00</h3>
      </div>
    `;
  }
}

export class ReceiptTemplate {
  render(data = {}) {
    return `
      <div class="receipt-box" style="font-family:sans-serif; font-size:12px; width:80mm; padding:5px;">
        <h3 style="text-align:center;">Retail ERP Cash Receipt</h3>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p>Sale ID: ${data.saleId || "SALE-948b"}</p>
        <hr style="border:1px dashed #ccc;" />
        <p>Oxford Shoes - 1 x $120.00</p>
        <hr style="border:1px dashed #ccc;" />
        <h4>Total: $120.00 (PAID)</h4>
        <p style="text-align:center;">Thank you for shopping!</p>
      </div>
    `;
  }
}

export class ReportTemplate {
  render(data = {}) {
    return `
      <div class="report-box" style="font-family:sans-serif; padding:20px;">
        <h2>Daily Store Sales Summary</h2>
        <p>Generated At: ${new Date().toLocaleString()}</p>
        <p>Report Segment: Sales Performance Metrics</p>
        <div style="background:#f9f9f9; padding:10px; border:1px solid #ddd;">
          <p>Total Revenue: <strong>$12,450.00</strong></p>
          <p>Total Invoices: <strong>48 sales</strong></p>
        </div>
      </div>
    `;
  }
}

export default class PDFTemplates {
  constructor() {
    this.invoice = new InvoiceTemplate();
    this.receipt = new ReceiptTemplate();
    this.report  = new ReportTemplate();
  }

  get(type) {
    if (type === "invoice") return this.invoice;
    if (type === "receipt") return this.receipt;
    if (type === "report")  return this.report;
    return this.invoice;
  }
}
