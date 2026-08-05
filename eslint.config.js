/**
 * eslint.config.js
 * Retail ERP Enterprise — Flat ESLint v9 configuration
 *
 * Phase 6 — Step 1: Unit Testing & Code Quality
 */

'use strict';

const js = require('@eslint/js');

module.exports = [
  // 1. Base JS Recommended config
  js.configs.recommended,

  // 2. Global rule preferences
  {
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^(event|_)' }],
      'no-console': 'off',
      'strict': 'off'
    }
  },

  // 3. Backend & Main Process (CommonJS Globals & Parsing)
  {
    files: ['src/backend/**/*.js', 'src/main/**/*.js', 'src/config/**/*.js', 'src/shared/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        console: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly'
      }
    }
  },

  // 4. Renderer Process (ESM Parser & Browser Globals)
  {
    files: ['src/renderer/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly'
      }
    }
  }
];
