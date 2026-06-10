const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../../src/page-objects/login-page');
const { generateTotp } = require('../../../src/utils/mfa-utils');

test.describe('Authentication Tests @ui', () => {
  // Clear storageState so that login tests execute starting from a clean unauthenticated context
  test.use({ storageState: { cookies: [], origins: [] } });

  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Normal Login with MFA @smoke @regression', async ({ page }) => {
    const email = process.env.NORMAL_USERNAME;
    const password = process.env.NORMAL_PASSWORD;
    const secret = process.env.NORMAL_TOTP_SECRET;

    // Fill credentials and click sign in
    await loginPage.fillLoginCredentials(email, password);

    // Generate and enter MFA code — enterMfaCode fills the code AND clicks Verify
    await loginPage.mfaCodeInput.waitFor({ state: 'visible', timeout: 15000 });
    const code = generateTotp(secret);
    await loginPage.enterMfaCode(code);

    // Wait for redirect and verify the client list page is loaded
    await page.waitForURL(/client-list/, { timeout: 30000 });
    await expect(page).toHaveURL(/client-list/);

    console.log('Callback URL: ', page.url());
  });


  test('Xero Authentication Redirect @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();

    // Expect redirected to Xero authentication portal
    await expect(page).toHaveURL(/xero\.com/);
  });

  test('Xero Authentication Login @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();

    // Wait for redirect to Xero login page
    await expect(page).toHaveURL(/xero\.com/, { timeout: 15000 });

    const xeroEmail = process.env.XERO_EMAIL;
    const xeroPassword = process.env.XERO_PASSWORD;
    const xeroSecret = process.env.XERO_TOTP_SECRET;

    // Fill Xero credentials — this triggers a navigation
    await loginPage.fillXeroCredentials(xeroEmail, xeroPassword);

    // Wait for Xero to navigate after login (to either MFA screen or consent screen)
    await page.waitForURL(/xero\.com/, { timeout: 30000 });

    // Handle MFA only if the MFA input appears (Xero may skip it for active sessions)
    const mfaInput = page.getByRole('textbox', { name: 'Authentication code' });
    if (await mfaInput.isVisible().catch(() => false)) {
      const mfaCode = generateTotp(xeroSecret);
      await loginPage.fillXeroMfa(mfaCode);

      // After MFA submission, wait for navigation to the consent screen
      await page.waitForURL(/authorize\.xero\.com/, { timeout: 30000 });
    }

    // Click Allow Access on the consent screen
    await loginPage.allowAccess();

    // Wait for redirect back to the app and verify client list page is loaded
    await page.waitForURL(/client-list/, { timeout: 30000 });
    await expect(page).toHaveURL(/client-list/);

    console.log('Callback URL: ', page.url());
  });




  test('Login with Invalid Credentials @regression', async ({ page }) => {
    // Fill wrong credentials and click sign in
    await loginPage.fillLoginCredentials('wrong.user@cloudoffis.com.au', 'WrongPassword123');

    // Assert general authentication failure message is displayed
    await expect(loginPage.generalErrorMessage.first()).toBeVisible({ timeout: 10000 });
  });

  test('Validation for Empty Email and Password @regression', async ({ page }) => {
    // Submit form without entering credentials
    await loginPage.loginButton.click();

    // Assert validation messages are displayed
    await expect(loginPage.emailError).toBeVisible();
    await expect(loginPage.passwordError).toBeVisible();
  });

  test('Validation for Invalid Email Format @regression', async ({ page }) => {
    // Enter malformed email and click Sign In
    await loginPage.usernameInput.fill('invalid-email-format');
    await loginPage.loginButton.click();

    // Verify native HTML5 input validation triggers
    const isInvalid = await loginPage.usernameInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });
});