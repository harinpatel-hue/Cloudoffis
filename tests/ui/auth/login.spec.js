const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../../src/page-objects/login-page');
const { generateTotp } = require('../../../src/utils/mfa-utils');

test.describe('Authentication Tests @ui', () => {
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

    // Generate and enter MFA code (wait up to 15s for CI runners)
    await loginPage.mfaCodeInput.waitFor({ state: 'visible', timeout: 15000 });
    const code = generateTotp(secret);
    await loginPage.enterMfaCode(code);

    // Assert redirect away from login page
    await expect(page).not.toHaveURL(/auth\/login/);
  });

  test('Xero Authentication Redirect @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();

    // Expect redirected to Xero authentication portal
    await expect(page).toHaveURL(/xero\.com/);
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
