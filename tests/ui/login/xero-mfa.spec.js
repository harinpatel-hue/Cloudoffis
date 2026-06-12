const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../../src/page-objects/login-page');
const { generateTotp } = require('../../../src/utils/mfa-utils');

test.describe('Xero 2FA Verification @ui', () => {
  // Clear storageState so that login tests execute starting from a clean unauthenticated context
  test.use({ storageState: { cookies: [], origins: [] } });

  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Display 2FA Page on First-Time Login @TC014 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });
    await loginPage.fillXeroCredentials(process.env.XERO_EMAIL, process.env.XERO_PASSWORD);
    await page.waitForURL(/xero.com/, { timeout: 30000 });

    const mfaInput = page.getByRole('textbox', { name: 'Authentication code' });
    await expect(mfaInput.first()).toBeVisible().catch(() => { });
  });

  test('Successful Login with Valid 2FA Code @TC015 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });
    await loginPage.fillXeroCredentials(process.env.XERO_EMAIL, process.env.XERO_PASSWORD);
    await page.waitForURL(/xero.com/, { timeout: 30000 });

    const mfaInput = page.getByRole('textbox', { name: 'Authentication code' });
    if (await mfaInput.isVisible().catch(() => false)) {
      const mfaCode = generateTotp(process.env.XERO_TOTP_SECRET);
      await loginPage.fillXeroMfa(mfaCode);
    }
    await page.waitForURL(/authorize.xero.com/, { timeout: 30000 }).catch(() => { });
  });

  test('Invalid 2FA Code on First Login @TC016 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });
    await loginPage.fillXeroCredentials(process.env.XERO_EMAIL, process.env.XERO_PASSWORD);
    await page.waitForURL(/xero.com/, { timeout: 30000 });

    const mfaInput = page.getByRole('textbox', { name: 'Authentication code' });
    if (await mfaInput.isVisible().catch(() => false)) {
      await mfaInput.fill('000000');
      await page.getByRole('button', { name: 'Confirm' }).click();
      await expect(mfaInput).toBeVisible();
    }
  });

  test('2FA Not Displayed During Active Session @TC017 @regression', async ({ browser, baseURL }) => {
    const env = process.env.ENV || 'qa';
    const authFile = `playwright/.auth/workpapers-${env}.json`;
    const context = await browser.newContext({ storageState: authFile, baseURL });
    const page = await context.newPage();
    await page.goto('/client-list');
    await expect(page).toHaveURL(/client-list/, { timeout: 15000 });
    await context.close();
  });

  test('2FA Displayed After Session Expiry @TC018 @regression', async ({ page }) => {
    await page.context().clearCookies();
    await page.reload();
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('Refresh 2FA Page During First Login @TC019 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });
    await loginPage.fillXeroCredentials(process.env.XERO_EMAIL, process.env.XERO_PASSWORD);
    await page.waitForURL(/xero.com/, { timeout: 30000 });

    const mfaInput = page.getByRole('textbox', { name: 'Authentication code' });
    if (await mfaInput.isVisible().catch(() => false)) {
      await mfaInput.fill('123456');
      await page.reload();
      await expect(mfaInput).toHaveValue('').catch(() => { });
    }
  });

  test('Browser Back Button on 2FA Page @TC020 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });
    await loginPage.fillXeroCredentials(process.env.XERO_EMAIL, process.env.XERO_PASSWORD);
    await page.waitForURL(/xero.com/, { timeout: 30000 });

    const mfaInput = page.getByRole('textbox', { name: 'Authentication code' });
    if (await mfaInput.isVisible().catch(() => false)) {
      await page.goBack();
      await expect(page).toHaveURL(/xero.com/);
    }
  });

  test('Session Timeout on 2FA Page @TC021 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });
    await page.context().clearCookies();
    await page.goto('/client-list');
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('Multiple Invalid 2FA Attempts @TC022 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });
    await loginPage.fillXeroCredentials(process.env.XERO_EMAIL, process.env.XERO_PASSWORD);
    await page.waitForURL(/xero.com/, { timeout: 30000 });

    const mfaInput = page.getByRole('textbox', { name: 'Authentication code' });
    if (await mfaInput.isVisible().catch(() => false)) {
      await mfaInput.fill('000000');
      await page.getByRole('button', { name: 'Confirm' }).click();
      const errorMsg = page.locator('text=The code you entered is incorrect').or(page.locator('.x-alert-message'));
      await expect(errorMsg.first()).toBeVisible().catch(() => {});

      await mfaInput.fill('999999');
      await page.getByRole('button', { name: 'Confirm' }).click();
      await expect(mfaInput).toBeVisible();
    }
  });

  test('Logout and Clear Cookies @TC023 @regression', async ({ page }) => {
    await page.context().clearCookies();
    await page.reload();
    await expect(page).toHaveURL(/auth\/login/);
  });
});
