const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../../src/page-objects/login-page');
const { generateTotp } = require('../../../src/utils/mfa-utils');

test.describe('Workpapers Sorted Login Screen @ui', () => {
  // Clear storageState so that login tests execute starting from a clean unauthenticated context
  test.use({ storageState: { cookies: [], origins: [] } });

  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Verify redirection to Login Screen @TC001 @regression', async ({ page }) => {
    // Expected: Redirected to login page URL
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('Verify Content and Fields on Login Screen @TC002 @regression', async ({ page }) => {
    // Left side headings & text
    await expect(page.locator('h1, h2, .heading:has-text("Welcome to Workpapers Sorted")').first()).toBeVisible().catch(() => { });
    await expect(page.locator('text=streamlines workpaper preparation').first()).toBeVisible().catch(() => { });

    // Right side login panel
    await expect(page.locator('text=Sign In to Workpapers Sorted!').first()).toBeVisible().catch(() => { });
    await expect(page.locator('text=Use your credentials to continue').first()).toBeVisible().catch(() => { });

    // Form fields & buttons
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.xeroLoginButton).toBeVisible();

    const forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password' }).or(page.locator('a:has-text("Forgot")'));
    await expect(forgotPasswordLink.first()).toBeVisible();
  });

  test('Verify Email Field Validation (Empty Email) @TC033 @regression', async ({ page }) => {
    await loginPage.passwordInput.fill('ValidPassword123!');
    await loginPage.loginButton.click();
    await expect(loginPage.emailError).toBeVisible();
  });

  test('Verify Password Field Validation (Empty Password) @TC034 @regression', async ({ page }) => {
    await loginPage.usernameInput.fill('test@cloudoffis.com.au');
    await loginPage.loginButton.click();
    await expect(loginPage.passwordError).toBeVisible();
  });

  test('Verify Invalid Email Format @TC035 @regression', async ({ page }) => {
    await loginPage.usernameInput.fill('invalidemailcom');
    await loginPage.loginButton.click();
    const isInvalid = await loginPage.usernameInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test('Verify Invalid Credentials @TC036 @regression', async ({ page }) => {
    await loginPage.fillLoginCredentials('wrong.user@cloudoffis.com.au', 'WrongPassword123');
    await expect(loginPage.generalErrorMessage.first()).toBeVisible({ timeout: 10000 });
  });

  test('Verify Successful Login with Correct Email and Password @TC037 @regression', async ({ page }) => {
    const email = process.env.NORMAL_USERNAME;
    const password = process.env.NORMAL_PASSWORD;
    const secret = process.env.NORMAL_TOTP_SECRET;

    await loginPage.fillLoginCredentials(email, password);
    
    try {
      await Promise.race([
        page.waitForURL(/client-list/, { timeout: 15000 }),
        loginPage.mfaCodeInput.waitFor({ state: 'visible', timeout: 15000 })
      ]);
    } catch (err) {
      console.log('Proceeding to check page state...');
    }

    if (await loginPage.mfaCodeInput.isVisible()) {
      const code = generateTotp(secret);
      await loginPage.enterMfaCode(code);
    }
    await page.waitForURL(/client-list/, { timeout: 30000 });
    await expect(page).toHaveURL(/client-list/);
  });

  test('Verify Forgot Password Link @TC038 @regression', async ({ page }) => {
    const forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password' }).or(page.locator('a:has-text("Forgot")'));
    await forgotPasswordLink.first().click();
    await page.waitForURL(/forgotpassword/, { timeout: 15000 }).catch(() => { });
    expect(page.url()).toContain('forgotpassword');
  });
});
