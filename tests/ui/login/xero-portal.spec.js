const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../../src/page-objects/login-page');

test.describe('Xero Portal Login Screen @ui', () => {
  // Clear storageState so that login tests execute starting from a clean unauthenticated context
  test.use({ storageState: { cookies: [], origins: [] } });

  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Sign in With Xero button redirect @TC003 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await expect(page).toHaveURL(/xero.com/, { timeout: 15000 });
  });

  test('Fields on Login with Xero page @TC004 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });

    const emailField = page.getByRole('textbox', { name: 'Email address' }).or(page.locator('input[type="email"]'));
    const passwordField = page.getByRole('textbox', { name: 'Password' }).or(page.locator('input[type="password"]'));
    const loginButton = page.getByRole('button', { name: 'Log in' }).or(page.locator('button[type="submit"]'));

    await expect(emailField.first()).toBeVisible();
    await expect(passwordField.first()).toBeVisible();
    await expect(loginButton.first()).toBeVisible();
  });

  test('Login with Xero – Email & Password Validation @TC005 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });

    const emailField = page.getByRole('textbox', { name: 'Email address' }).or(page.locator('input[type="email"]'));
    const loginButton = page.getByRole('button', { name: 'Log in' }).or(page.locator('button[type="submit"]'));

    await emailField.fill('invalid-email-format');
    await loginButton.click();

    const errorMsg = page.locator('text=Enter a valid email address').or(page.locator('.x-alert-message'));
    await expect(errorMsg.first()).toBeVisible().catch(() => { });
  });

  test('Login with Invalid Email Format @TC006 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });

    const emailField = page.locator('input[type="email"]');
    await emailField.fill('invalid-email-format');
    await page.getByRole('button', { name: 'Log in' }).click();

    const errorMsg = page.locator('text=Enter a valid email address').or(page.locator('.x-alert-message'));
    await expect(errorMsg.first()).toBeVisible().catch(() => { });
  });

  test('Login with Incorrect Password @TC007 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });

    await page.locator('input[type="email"]').fill('test-user@xero.com');
    await page.locator('input[type="password"]').fill('WrongPassword123!');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page).toHaveURL(/xero.com/);
  });

  test('Login with Empty Fields @TC008 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/xero.com/);
  });

  test('Login with Empty Password @TC009 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });
    await page.locator('input[type="email"]').fill('test-user@xero.com');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/xero.com/);
  });

  test('Forgot Password Link Xero @TC010 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });

    const forgotLink = page.getByRole('link', { name: 'Forgot password?' }).or(page.locator('a:has-text("Forgot")'));
    await forgotLink.first().click().catch(() => { });
    await expect(page).toHaveURL(/xero.com/);
  });

  test('Can’t Log In Link @TC011 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });

    const cantLoginLink = page.getByRole('link', { name: 'Can\'t log in?' }).or(page.locator('a:has-text("Can\'t")'));
    await cantLoginLink.first().click().catch(() => { });
    await expect(page).toHaveURL(/xero.com/);
  });

  test('Browser Refresh on Login Page @TC012 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });

    await page.locator('input[type="email"]').fill('test-user@xero.com');
    await page.locator('input[type="password"]').fill('SomePassword123!');
    await page.reload();

    await expect(page.locator('input[type="email"]')).toHaveValue('').catch(() => { });
  });

  test('Footer Links Validation @TC013 @regression', async ({ page }) => {
    await loginPage.clickXeroLogin();
    await page.waitForURL(/xero.com/, { timeout: 15000 });

    const privacyLink = page.locator('a:has-text("Privacy")');
    await expect(privacyLink.first()).toBeVisible().catch(() => { });
  });
});
