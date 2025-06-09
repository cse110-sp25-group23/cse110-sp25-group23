// cypress.config.js
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl:    "http://localhost:8082",            //  dev server
    specPattern: "__tests__/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: false,
  },
});
