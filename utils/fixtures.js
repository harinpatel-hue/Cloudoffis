const { test: base, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ClientsPage } = require('../pages/ClientsPage');
const { ApiUtils } = require('./api-utils');

// Extend base test to include page and API fixtures for dependency injection
const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  clientsPage: async ({ page }, use) => {
    const clientsPage = new ClientsPage(page);
    await use(clientsPage);
  },
  apiUtils: async ({ request }, use) => {
    const apiUtils = new ApiUtils(request);
    await use(apiUtils);
  }
});

module.exports = { test, expect };
