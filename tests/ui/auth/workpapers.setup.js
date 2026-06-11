const { test: setup, expect } = require('@playwright/test');
const { LoginPage } = require('../../../src/page-objects/login-page');
const { generateTotp } = require('../../../src/utils/mfa-utils');
const { getBaseUrl } = require('../../../src/config/env-config');

const env = process.env.ENV || 'qa';
const authFile = `playwright/.auth/workpapers-${env}.json`;

setup('authenticate workpapers', async ({ page }) => {
  const fs = require('fs');
  const path = require('path');
  const baseUrl = getBaseUrl();
  const currentHostname = new URL(baseUrl).hostname;

  // Check if saved session already exists and is valid
  if (fs.existsSync(authFile)) {
    try {
      const authData = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
      const originData = authData.origins?.find(o => o.origin.includes(currentHostname));
      if (originData) {
        const accessTokenObj = originData.localStorage?.find(item => item.name === 'ACCESS_TOKEN');
        if (accessTokenObj?.value) {
          const payloadBase64 = accessTokenObj.value.split('.')[1];
          const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
          const exp = payload.exp * 1000;
          
          // If token is valid for at least 5 more minutes, skip login
          if (exp - Date.now() > 5 * 60 * 1000) {
            console.log('Reusing existing valid session. Skipping login.');
            return;
          }
        }
      }
    } catch (e) {
      console.log('Could not parse existing session, performing full login...');
    }
  }

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

  // Wait for redirect to client list page to ensure login is complete and session is saved
  await page.waitForURL(/client-list/, { timeout: 30000 });

  // Save storage state (cookies, local storage) to authFile
  await page.context().storageState({ path: authFile });
});
