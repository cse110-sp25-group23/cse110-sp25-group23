// cypress.config.js
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl:    "http://localhost:8082",            // your dev server
    specPattern: "__tests__/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: false,
  },
});
