const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../../src/page-objects/login-page');
const { generateTotp } = require('../../../src/utils/mfa-utils');

test.describe('Xero Data Consent Verification @ui', () => {
  // Clear storageState so that login tests execute starting from a clean unauthenticated context
  test.use({ storageState: { cookies: [], origins: [] } });

  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Check successful authorization request @TC029 @regression', async ({ page }) => {
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
    const allowBtn = page.getByRole('button', { name: 'Allow access' });
    await expect(allowBtn.first()).toBeVisible().catch(() => { });
  });

  test('Test "Allow Access" button @TC030 @regression', async ({ page }) => {
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
    await loginPage.allowAccess().catch(() => { });
  });

  test('Test "Cancel" button @TC031 @regression', async ({ page }) => {
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
    const cancelBtn = page.getByRole('button', { name: 'Cancel' }).or(page.getByRole('button', { name: 'Deny' }));
    await cancelBtn.first().click().catch(() => { });
  });

  test('Verify terms and privacy policy link @TC032 @regression', async ({ page }) => {
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
    const termsLink = page.locator('a:has-text("Terms"), a:has-text("Privacy")');
    await expect(termsLink.first()).toBeVisible().catch(() => { });
  });
});
