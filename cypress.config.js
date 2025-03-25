const { defineConfig } = require("cypress");

const baseURL = process.env.VUE_APP_TEST_BASE_URL || 'http://localhost:8080';

module.exports = defineConfig({
  video: true,
  e2e: {
    baseUrl: baseURL,
    specPattern: 'tests/e2e/specs/**/*.{js,jsx,ts,tsx}',
    supportFile: 'tests/e2e/support/index.js',
    fixturesFolder: 'tests/e2e/fixtures',
  },
});