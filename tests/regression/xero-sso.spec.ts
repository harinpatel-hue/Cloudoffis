import { test, expect } from '@fixtures/baseFixture';
import { STORAGE_STATE } from '../../playwright.config';
import * as fs from 'fs';

test.describe('Xero SSO & Consent Screen Tests @sso', () => {

  test('TC003 & TC004 - Click "Sign in with Xero" should navigate to Xero login page with core fields', async ({ loginPage, page }) => {
    await loginPage.goto();
    
    // Click Sign In with Xero
    await loginPage.loginWithXero();
    
    // Wait for URL to redirect to Xero login interface
    await page.waitForURL(/login\.xero\.com|xero\.com/i, { timeout: 15000 });
    expect(page.url()).toContain('xero.com');
    
    // TC004: Verify fields on Xero login page (if redirection loaded successfully)
    const emailField = page.locator('input[type="email"], #email, input[name="Username"]');
    const passwordField = page.locator('input[type="password"], #password, input[name="Password"]');
    const loginButton = page.locator('button[type="submit"], #submitButton');
    
    // Verify inputs and buttons exist on Xero page
    await expect(emailField.first()).toBeVisible({ timeout: 10000 });
    await expect(passwordField.first()).toBeVisible();
    await expect(loginButton.first()).toBeVisible();
  });

  // Consent & Authorization screen tests (TC029 - TC032)
  test.describe('Authenticated Authorization screen tests', () => {
    test.beforeEach(async () => {
      // Skip if active session state is not configured (since these require being logged in)
      let hasAuth = false;
      try {
        if (fs.existsSync(STORAGE_STATE)) {
          const state = JSON.parse(fs.readFileSync(STORAGE_STATE, 'utf-8'));
          if (state.cookies && state.cookies.length > 0) {
            hasAuth = true;
          }
        }
      } catch (e) {}

      if (!hasAuth) {
        test.skip(true, 'Skipping TC029-TC032 consent tests: active session state is not available.');
      }
    });

    test('TC029 & TC030 - Should display Allow Access authorization screens', async ({ page }) => {
      // Navigate to authorization/allow access page (e.g. callback or connection route)
      await page.goto('/auth/xero/authorize'); // Or correct redirect route
      
      const allowButton = page.locator('button:has-text("Allow access"), #allow-btn, .allow-btn');
      const userProfile = page.locator('.user-profile, .user-info, text="User account information"');
      
      await expect(allowButton.first()).toBeVisible();
      await expect(userProfile.first()).toBeVisible();
    });

    test('TC031 - Test "Cancel" button on authorization screen', async ({ page }) => {
      await page.goto('/auth/xero/authorize');
      const cancelButton = page.locator('button:has-text("Cancel"), #cancel-btn, .cancel-btn');
      
      await expect(cancelButton.first()).toBeVisible();
      await cancelButton.click();
      
      // Cancel redirect must bring user back to login page
      await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
      expect(page.url()).toContain('/auth/login');
    });

    test('TC032 - Verify presence of terms and conditions / privacy links on consent screen', async ({ page }) => {
      await page.goto('/auth/xero/authorize');
      
      const privacyLink = page.locator('a[href*="privacy"], a[href*="terms"]');
      await expect(privacyLink.first()).toBeVisible();
    });
  });
});
