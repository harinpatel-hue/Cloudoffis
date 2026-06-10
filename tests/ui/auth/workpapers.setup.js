const { test: setup, expect } = require('@playwright/test');
const { LoginPage } = require('../../../src/page-objects/login-page');
const { generateTotp } = require('../../../src/utils/mfa-utils');

const authFile = 'playwright/.auth/workpapers.json';

setup('authenticate workpapers', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  
  const email = process.env.NORMAL_USERNAME;
  const password = process.env.NORMAL_PASSWORD;
  const secret = process.env.NORMAL_TOTP_SECRET;

  await loginPage.fillLoginCredentials(email, password);

  // Generate and enter MFA code (wait up to 15s for CI runners)
  await loginPage.mfaCodeInput.waitFor({ state: 'visible', timeout: 15000 });
  const code = generateTotp(secret);
  await loginPage.enterMfaCode(code);

  // Assert redirect away from login page
  await expect(page).not.toHaveURL(/auth\/login/, { timeout: 15000 });

  // Save storage state (cookies, local storage) to authFile
  await page.context().storageState({ path: authFile });
});
