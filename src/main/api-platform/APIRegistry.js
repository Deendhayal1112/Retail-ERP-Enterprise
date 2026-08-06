/**
 * APIRegistry.js
 * Retail ERP Enterprise — Enterprise API Endpoint Registry
 *
 * Declares all registered internal REST API endpoint definitions with
 * path, method, module, description, params, and mock response schemas.
 * Architecture only — no HTTP server is started.
 */

"use strict";

const logger = require("../../shared/logger/logger");

class APIRegistry {
  constructor() {
    /**
     * Master registry of all internal API endpoint definitions.
     * Each entry follows a structured REST resource pattern.
     */
    this.endpoints = [
      // ─── Products Module ───────────────────────────────────────────
      {
        id: "api-products-list",
        module: "Products",
        method: "GET",
        path: "/api/v1/products",
        description: "Retrieve paginated list of all product catalogue entries.",
        auth: true,
        scopes: ["products:read"],
        params: [
          { name: "page", type: "query", required: false, description: "Page number (default: 1)" },
          { name: "limit", type: "query", required: false, description: "Records per page (default: 20, max: 100)" },
          { name: "category", type: "query", required: false, description: "Filter by category slug" }
        ],
        mockResponse: {
          status: 200,
          body: {
            success: true,
            total: 1284,
            page: 1,
            limit: 20,
            data: [
              { id: "prod-001", sku: "APP-SHIRT-COTTON", name: "Premium Cotton Shirt", price: 1497.50, stock: 1200, category: "Apparel" },
              { id: "prod-002", sku: "APP-JEANS-INDIGO", name: "Indigo Slim Jeans", price: 2449.00, stock: 840, category: "Apparel" }
            ]
          }
        }
      },
      {
        id: "api-products-get",
        module: "Products",
        method: "GET",
        path: "/api/v1/products/:id",
        description: "Retrieve a single product by its unique identifier.",
        auth: true,
        scopes: ["products:read"],
        params: [
          { name: "id", type: "path", required: true, description: "Product unique identifier" }
        ],
        mockResponse: {
          status: 200,
          body: { success: true, data: { id: "prod-001", sku: "APP-SHIRT-COTTON", name: "Premium Cotton Shirt", price: 1497.50, stock: 1200 } }
        }
      },
      {
        id: "api-products-create",
        module: "Products",
        method: "POST",
        path: "/api/v1/products",
        description: "Create a new product catalogue entry.",
        auth: true,
        scopes: ["products:write"],
        params: [
          { name: "sku", type: "body", required: true, description: "Unique stock-keeping unit code" },
          { name: "name", type: "body", required: true, description: "Product display name" },
          { name: "price", type: "body", required: true, description: "Unit price in INR (₹)" }
        ],
        mockResponse: { status: 201, body: { success: true, message: "Product created.", id: "prod-NEW-001" } }
      },
      {
        id: "api-products-update",
        module: "Products",
        method: "PUT",
        path: "/api/v1/products/:id",
        description: "Update an existing product catalogue entry.",
        auth: true,
        scopes: ["products:write"],
        params: [
          { name: "id", type: "path", required: true, description: "Product identifier" },
          { name: "price", type: "body", required: false, description: "New price in INR (₹)" }
        ],
        mockResponse: { status: 200, body: { success: true, message: "Product updated." } }
      },
      {
        id: "api-products-delete",
        module: "Products",
        method: "DELETE",
        path: "/api/v1/products/:id",
        description: "Archive (soft-delete) a product catalogue entry.",
        auth: true,
        scopes: ["products:delete"],
        params: [
          { name: "id", type: "path", required: true, description: "Product identifier" }
        ],
        mockResponse: { status: 200, body: { success: true, message: "Product archived." } }
      },

      // ─── Inventory Module ──────────────────────────────────────────
      {
        id: "api-inventory-levels",
        module: "Inventory",
        method: "GET",
        path: "/api/v1/inventory",
        description: "Retrieve real-time stock levels across all warehouses.",
        auth: true,
        scopes: ["inventory:read"],
        params: [
          { name: "warehouseId", type: "query", required: false, description: "Filter by warehouse ID" }
        ],
        mockResponse: {
          status: 200,
          body: {
            success: true,
            data: [
              { sku: "APP-SHIRT-COTTON", warehouseId: "wh-central-delhi", available: 1200, reserved: 150 },
              { sku: "APP-JEANS-INDIGO", warehouseId: "wh-central-delhi", available: 840, reserved: 80 }
            ]
          }
        }
      },
      {
        id: "api-inventory-adjust",
        module: "Inventory",
        method: "POST",
        path: "/api/v1/inventory/adjust",
        description: "Submit a manual inventory adjustment entry.",
        auth: true,
        scopes: ["inventory:write"],
        params: [
          { name: "sku", type: "body", required: true, description: "Product SKU" },
          { name: "quantity", type: "body", required: true, description: "Adjustment quantity (positive = addition, negative = reduction)" },
          { name: "reason", type: "body", required: true, description: "Reason code (damage, audit, transfer)" }
        ],
        mockResponse: { status: 200, body: { success: true, message: "Adjustment recorded." } }
      },

      // ─── Sales Module ──────────────────────────────────────────────
      {
        id: "api-sales-orders-list",
        module: "Sales",
        method: "GET",
        path: "/api/v1/sales/orders",
        description: "Retrieve paginated sales order records.",
        auth: true,
        scopes: ["sales:read"],
        params: [
          { name: "status", type: "query", required: false, description: "Filter by order status (pending, confirmed, dispatched, delivered)" }
        ],
        mockResponse: {
          status: 200,
          body: {
            success: true,
            total: 5284,
            data: [
              { id: "SO-2026-0001", customer: "Ramesh Kumar", total: 4997.50, status: "confirmed", date: "2026-08-01" }
            ]
          }
        }
      },
      {
        id: "api-sales-orders-create",
        module: "Sales",
        method: "POST",
        path: "/api/v1/sales/orders",
        description: "Create a new sales order transaction.",
        auth: true,
        scopes: ["sales:write"],
        params: [
          { name: "customerId", type: "body", required: true, description: "Customer identifier" },
          { name: "lineItems", type: "body", required: true, description: "Array of { sku, quantity, unitPrice }" }
        ],
        mockResponse: { status: 201, body: { success: true, orderId: "SO-2026-9999", message: "Order created." } }
      },

      // ─── Purchases Module ──────────────────────────────────────────
      {
        id: "api-purchases-list",
        module: "Purchases",
        method: "GET",
        path: "/api/v1/purchases",
        description: "Retrieve paginated purchase order records.",
        auth: true,
        scopes: ["purchases:read"],
        params: [],
        mockResponse: {
          status: 200,
          body: {
            success: true,
            total: 842,
            data: [
              { id: "PO-2026-0001", vendor: "Singh Textile Mills", total: 248000.00, status: "received", date: "2026-07-15" }
            ]
          }
        }
      },
      {
        id: "api-purchases-create",
        module: "Purchases",
        method: "POST",
        path: "/api/v1/purchases",
        description: "Raise a new purchase order to a vendor.",
        auth: true,
        scopes: ["purchases:write"],
        params: [
          { name: "vendorId", type: "body", required: true, description: "Vendor identifier" },
          { name: "lineItems", type: "body", required: true, description: "Array of { sku, quantity, unitCost }" }
        ],
        mockResponse: { status: 201, body: { success: true, poId: "PO-2026-9999", message: "Purchase order raised." } }
      },

      // ─── Customers Module ──────────────────────────────────────────
      {
        id: "api-customers-list",
        module: "Customers",
        method: "GET",
        path: "/api/v1/customers",
        description: "Retrieve paginated customer CRM profiles.",
        auth: true,
        scopes: ["customers:read"],
        params: [
          { name: "search", type: "query", required: false, description: "Name or phone search" }
        ],
        mockResponse: {
          status: 200,
          body: {
            success: true,
            total: 12450,
            data: [
              { id: "cust-001", name: "Ramesh Kumar", email: "ramesh.kumar@email.com", totalOrders: 24, totalSpend: 84920.00 }
            ]
          }
        }
      },
      {
        id: "api-customers-create",
        module: "Customers",
        method: "POST",
        path: "/api/v1/customers",
        description: "Register a new customer CRM profile.",
        auth: true,
        scopes: ["customers:write"],
        params: [
          { name: "name", type: "body", required: true, description: "Customer full name" },
          { name: "email", type: "body", required: false, description: "Email address" },
          { name: "phone", type: "body", required: true, description: "Mobile number (10 digits)" }
        ],
        mockResponse: { status: 201, body: { success: true, customerId: "cust-NEW-001", message: "Customer registered." } }
      },

      // ─── Reports Module ────────────────────────────────────────────
      {
        id: "api-reports-sales-summary",
        module: "Reports",
        method: "GET",
        path: "/api/v1/reports/sales-summary",
        description: "Generate an aggregated sales performance summary report.",
        auth: true,
        scopes: ["reports:read"],
        params: [
          { name: "from", type: "query", required: true, description: "Start date (YYYY-MM-DD)" },
          { name: "to", type: "query", required: true, description: "End date (YYYY-MM-DD)" }
        ],
        mockResponse: {
          status: 200,
          body: {
            success: true,
            period: { from: "2026-08-01", to: "2026-08-06" },
            totalRevenue: 2847500.00,
            totalOrders: 1284,
            avgOrderValue: 2218.46,
            topProduct: "APP-SHIRT-COTTON"
          }
        }
      },
      {
        id: "api-reports-inventory-valuation",
        module: "Reports",
        method: "GET",
        path: "/api/v1/reports/inventory-valuation",
        description: "Generate a complete inventory stock valuation report.",
        auth: true,
        scopes: ["reports:read"],
        params: [],
        mockResponse: {
          status: 200,
          body: {
            success: true,
            totalSKUs: 312,
            totalUnits: 48240,
            totalValuation: 84750000.00,
            currency: "INR"
          }
        }
      }
    ];
  }

  /**
   * Retrieve all registered API endpoints.
   */
  getEndpoints() {
    logger.debug("[APIRegistry] Fetching all registered API endpoint definitions.");
    return this.endpoints;
  }

  /**
   * Retrieve endpoints filtered by module.
   * @param {string} module - Module name (Products, Inventory, Sales, etc.)
   */
  getEndpointsByModule(module) {
    logger.debug(`[APIRegistry] Fetching endpoints for module: ${module}`);
    return this.endpoints.filter(ep => ep.module === module);
  }

  /**
   * Retrieve a single endpoint by ID.
   * @param {string} id - Endpoint identifier
   */
  getEndpointById(id) {
    return this.endpoints.find(ep => ep.id === id) || null;
  }

  /**
   * Returns list of unique module names from the registry.
   */
  getModuleNames() {
    const names = [...new Set(this.endpoints.map(ep => ep.module))];
    return names;
  }
}

module.exports = new APIRegistry();
