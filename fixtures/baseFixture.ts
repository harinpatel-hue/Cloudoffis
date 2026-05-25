import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { RegistrationPage } from '@pages/RegistrationPage';

// Declare the types for custom fixtures
export type CustomFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  registrationPage: RegistrationPage;
};

// Extend base test to include custom page fixtures
export const test = base.extend<CustomFixtures>({
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
