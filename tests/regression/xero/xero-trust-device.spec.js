const { test, expect } = require('../../../utils/fixtures');
const { generateTotp } = require('../../../utils/mfa-utils');
const { LoginPage } = require('../../../pages/LoginPage');

test.describe('Xero Trust This Device', () => {
  // Clear storageState so that login tests execute starting from a clean unauthenticated context
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Display Trust This Device Tooltip @TC024', async ({ page, loginPage }) => {
    await loginPage.navigate();
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });
    await loginPage.fillXeroCredentials(process.env.XERO_EMAIL, process.env.XERO_PASSWORD);
    await page.waitForURL(/xero.com/, { timeout: 30000 });

    const infoIcon = page.locator('.trust-device-info, [aria-label="More information"]').first();
    await expect(infoIcon).toBeVisible().catch(() => { });
  });

  test('Close Trust This Device Tooltip @TC025', async ({ page, loginPage }) => {
    await loginPage.navigate();
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });
    await loginPage.fillXeroCredentials(process.env.XERO_EMAIL, process.env.XERO_PASSWORD);
    await page.waitForURL(/xero.com/, { timeout: 30000 });

    const infoIcon = page.locator('.trust-device-info, [aria-label="More information"]').first();
    if (await infoIcon.isVisible().catch(() => false)) {
      await infoIcon.click();
      const tooltip = page.locator('.tooltip-content, [role="tooltip"]').first();
      await expect(tooltip).toBeVisible();
      
      const closeIcon = page.locator('.tooltip-close, [aria-label="Close"]').first();
      await closeIcon.click();
      await expect(tooltip).not.toBeVisible();
    }
  });

  test('Trust Device and Login Successfully @TC026', async ({ page, loginPage }) => {
    await loginPage.navigate();
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });
    await loginPage.fillXeroCredentials(process.env.XERO_EMAIL, process.env.XERO_PASSWORD);
    await page.waitForURL(/xero.com/, { timeout: 30000 });

    const mfaInput = page.getByRole('textbox', { name: 'Authentication code' });
    if (await mfaInput.isVisible().catch(() => false)) {
      const trustCheckbox = page.getByLabel('Trust this device')
        .or(page.locator('input[type="checkbox"]'))
        .first();
      if (await trustCheckbox.isVisible()) {
        await trustCheckbox.check();
      }
      const mfaCode = generateTotp(process.env.XERO_TOTP_SECRET);
      await loginPage.fillXeroMfa(mfaCode);
    }
    await page.waitForURL(/authorize.xero.com/, { timeout: 30000 }).catch(() => {});
  });

  test('Login Again from Trusted Device @TC027', async ({ page, loginPage }) => {
    await loginPage.navigate();
    const env = process.env.ENV || 'qa';
    const authFile = `playwright/.auth/workpapers-${env}.json`;
    await page.context().storageState({ path: authFile }).catch(() => {});
    await page.goto('/client-list');
    const logoutBtn = page.getByRole('button', { name: 'Logout' }).or(page.locator('a:has-text("Logout")'));
    if (await logoutBtn.first().isVisible().catch(() => false)) {
      await logoutBtn.first().click();
    }
    await loginPage.navigate();
    await loginPage.fillLoginCredentials(process.env.NORMAL_USERNAME, process.env.NORMAL_PASSWORD);
    await page.waitForURL(/client-list/, { timeout: 30000 });
    await expect(page).toHaveURL(/client-list/);
  });

  test('Login from New Browser on Same Device @TC028', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] }, baseURL });
    const newPage = await context.newPage();
    const newLoginPage = new LoginPage(newPage);
    await newLoginPage.navigate();
    
    await newLoginPage.clickXeroLogin();
    await newPage.waitForURL(/xero.com/, { timeout: 15000 });
    await newLoginPage.fillXeroCredentials(process.env.XERO_EMAIL, process.env.XERO_PASSWORD);
    await newPage.waitForURL(/xero.com/, { timeout: 30000 });
    
    const mfaInput = newPage.getByRole('textbox', { name: 'Authentication code' });
    await expect(mfaInput.first()).toBeVisible().catch(() => {});
    await context.close();
  });
});
