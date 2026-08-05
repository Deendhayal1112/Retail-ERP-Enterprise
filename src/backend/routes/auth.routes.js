/**
 * auth.routes.js
 * Retail ERP Enterprise — Authentication Routing Map
 *
 * Defines application authentication router bindings for Express API endpoints.
 *
 * Phase 5 — Step 1: Authentication Service
 */

"use strict";

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Post mapping for user credentials validation
router.post("/login", (req, res) => authController.login(req, res));

module.exports = router;
