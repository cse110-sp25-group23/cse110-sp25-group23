// cypress.config.js
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl:    "http://localhost:8081",            // your dev server
    specPattern: "__tests__/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: false,
  },
});
