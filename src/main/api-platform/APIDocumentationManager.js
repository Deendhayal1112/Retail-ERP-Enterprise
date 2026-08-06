/**
 * APIDocumentationManager.js
 * Retail ERP Enterprise — Enterprise API Documentation & OpenAPI Spec Manager
 *
 * Generates mock OpenAPI 3.1 specification document and SDK usage examples.
 * Architecture only — no live documentation server is started.
 */

"use strict";

const logger = require("../../shared/logger/logger");
const registry = require("./APIRegistry");
const appConfig = require("../../config/app.config");

class APIDocumentationManager {
  /**
   * Generates and returns the full OpenAPI 3.1 specification object.
   */
  getOpenAPISpec() {
    logger.debug("[APIDocumentationManager] Generating OpenAPI 3.1 specification document.");

    const endpoints = registry.getEndpoints();
    const paths = {};

    endpoints.forEach(ep => {
      if (!paths[ep.path]) paths[ep.path] = {};
      const method = ep.method.toLowerCase();

      const parameters = (ep.params || [])
        .filter(p => p.type === "path" || p.type === "query")
        .map(p => ({
          name: p.name,
          in: p.type,
          required: p.required,
          description: p.description,
          schema: { type: "string" }
        }));

      const requestBody = ep.params && ep.params.some(p => p.type === "body")
        ? {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: Object.fromEntries(
                    ep.params.filter(p => p.type === "body").map(p => [
                      p.name,
                      { type: "string", description: p.description }
                    ])
                  )
                }
              }
            }
          }
        : undefined;

      paths[ep.path][method] = {
        summary: ep.description,
        tags: [ep.module],
        security: ep.auth ? [{ ApiKeyAuth: [] }] : [],
        parameters,
        ...(requestBody ? { requestBody } : {}),
        responses: {
          [ep.mockResponse.status]: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: { type: "object" },
                example: ep.mockResponse.body
              }
            }
          },
          401: { description: "Unauthorized — invalid or missing API key" },
          403: { description: "Forbidden — insufficient scope permissions" },
          422: { description: "Unprocessable Entity — validation error" },
          500: { description: "Internal Server Error" }
        }
      };
    });

    return {
      openapi: "3.1.0",
      info: {
        title: "Retail ERP Enterprise — Internal REST API",
        version: appConfig.version || "0.2.0",
        description: "Enterprise-grade internal REST API for ERP module integrations.",
        contact: {
          name: "ERP Platform Team",
          email: "dev-platform@retail-erp.internal"
        },
        license: { name: "Proprietary", url: "https://retail-erp.internal/license" }
      },
      servers: [
        { url: "http://localhost:4200/api/v1", description: "Local Development (Placeholder)" },
        { url: "https://api.retail-erp.internal/v1", description: "Production (Placeholder)" }
      ],
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "X-ERP-API-Key"
          }
        }
      },
      paths,
      tags: registry.getModuleNames().map(name => ({
        name,
        description: `${name} module endpoints`
      }))
    };
  }

  /**
   * Returns code snippet samples for a given endpoint.
   * @param {string} endpointId
   * @param {string} language - "curl" | "javascript" | "python"
   */
  getSampleCode(endpointId, language = "curl") {
    logger.debug(`[APIDocumentationManager] Generating ${language} sample for: ${endpointId}`);
    const ep = registry.getEndpointById(endpointId);
    if (!ep) throw new Error(`Endpoint not found: ${endpointId}`);

    const baseUrl = "http://localhost:4200";
    const pathDisplay = ep.path.replace(":id", "prod-001");

    const samples = {
      curl: `curl -X ${ep.method} "${baseUrl}${pathDisplay}" \\
  -H "X-ERP-API-Key: erpk_live_YOUR_API_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json"`,

      javascript: `const response = await fetch("${baseUrl}${pathDisplay}", {
  method: "${ep.method}",
  headers: {
    "X-ERP-API-Key": "erpk_live_YOUR_API_KEY_HERE",
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

const data = await response.json();
console.log(data);`,

      python: `import requests

url = "${baseUrl}${pathDisplay}"
headers = {
    "X-ERP-API-Key": "erpk_live_YOUR_API_KEY_HERE",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

response = requests.${ep.method.toLowerCase()}(url, headers=headers)
print(response.json())`
    };

    return samples[language] || samples.curl;
  }

  /**
   * Returns SDK integration guide metadata.
   */
  getSDKInfo() {
    return {
      name: "RetailERP Enterprise SDK",
      version: "0.2.0",
      language: "JavaScript / Node.js",
      installCommand: "npm install @retail-erp/enterprise-sdk --save",
      repositoryUrl: "https://github.com/retail-erp/enterprise-sdk (placeholder)",
      quickstart: `const { ERPClient } = require("@retail-erp/enterprise-sdk");

const erp = new ERPClient({
  baseUrl: "http://localhost:4200/api/v1",
  apiKey: "erpk_live_YOUR_API_KEY_HERE"
});

// Fetch all products
const products = await erp.products.list({ page: 1, limit: 20 });
console.log(products.data);

// Create a sales order
const order = await erp.sales.createOrder({
  customerId: "cust-001",
  lineItems: [{ sku: "APP-SHIRT-COTTON", quantity: 2, unitPrice: 1497.50 }]
});
console.log(order.orderId);`
    };
  }
}

module.exports = new APIDocumentationManager();
