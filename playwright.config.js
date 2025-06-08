import { defineConfig } from '@playwright/test';

export default defineConfig({
    // webServer: {
    //     command: 'npm run start',
    //     url: 'http://localhost:5502',
    //     timeout: 120 * 1000,
    //     reuseExistingServer: !process.env.CI
    // },
    testDir: './__tests__',
    testMatch: 'e2e-*.test.js',
    use: {
        baseURL: "http://localhost:5502/",
    }
});