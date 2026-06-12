const { test: setup, expect } = require('@playwright/test');
const { LoginPage } = require('../../src/page-objects/login-page');
const { generateTotp } = require('../../src/utils/mfa-utils');
const { getBaseUrl } = require('../../src/config/env-config');

const env = process.env.ENV || 'qa';
const authFile = `playwright/.auth/workpapers-${env}.json`;

setup('authenticate workpapers', async ({ page }) => {
  const fs = require('fs');
  if (fs.existsSync(authFile)) {
    try {
      const context = await page.context().browser().newContext({ storageState: authFile });
      const verifyPage = await context.newPage();
      await verifyPage.goto(getBaseUrl() + '/client-list');
      const url = verifyPage.url();
      await context.close();
      if (url.includes('client-list')) {
        console.log('Reusing existing valid session. Skipping login.');
        return;
      }
      console.log('Existing session expired or invalid. Performing fresh login...');
    } catch (err) {
      console.log('Session verification failed, performing fresh login:', err.message);
    }
  }

  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  
  const email = process.env.NORMAL_USERNAME;
  const password = process.env.NORMAL_PASSWORD;
  const secret = process.env.NORMAL_TOTP_SECRET;

  await loginPage.fillLoginCredentials(email, password);

  // Wait for either direct redirect to client list OR the MFA input to be visible
  try {
    await Promise.race([
      page.waitForURL(/client-list/, { timeout: 15000 }),
      loginPage.mfaCodeInput.waitFor({ state: 'visible', timeout: 15000 })
    ]);
  } catch (err) {
    console.log('Proceeding to check page state after credentials submission...');
  }

  // Check if MFA challenge appears
  if (await loginPage.mfaCodeInput.isVisible()) {
    console.log('MFA challenge detected. Generating and entering code...');
    if (!secret) {
      throw new Error('MFA input is visible but NORMAL_TOTP_SECRET is not configured in .env file.');
    }
    const code = generateTotp(secret);
    await loginPage.enterMfaCode(code);
  } else if (page.url().includes('client-list')) {
    console.log('Direct login successful (MFA was not challenged).');
  } else {
    throw new Error('Neither redirect to client-list nor MFA input appeared after submitting credentials.');
  }

  // Wait for redirect to client list page to ensure login is complete and session is saved
  await page.waitForURL(/client-list/, { timeout: 30000 });

  // Save storage state (cookies, local storage) to authFile
  await page.context().storageState({ path: authFile });
});
