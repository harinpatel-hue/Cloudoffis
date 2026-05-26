import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage.js';
import { DashboardPage } from '@pages/DashboardPage.js';
import { RegistrationPage } from '@pages/RegistrationPage.js';

// Extend base test to include custom page fixtures
export const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  registrationPage: async ({ page }, use) => {
    const registrationPage = new RegistrationPage(page);
    await use(registrationPage);
  },
});

export { expect } from '@playwright/test';
