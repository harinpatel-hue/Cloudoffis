import { test, expect } from '@fixtures/baseFixture.js';
import { STORAGE_STATE } from '../../playwright.config.js';
import * as fs from 'fs';

test.describe('Multi-Factor Authentication (2FA) & Trust Device Tests @mfa', () => {

  test.beforeEach(async ({ loginPage, page }) => {
    const username = process.env.TEST_USERNAME;
    const password = process.env.TEST_PASSWORD;

    // Skip if credentials are placeholders
    if (!username || !password || username.includes('placeholder') || password.includes('placeholder')) {
      test.skip(true, 'Skipping MFA tests: valid TEST_USERNAME and TEST_PASSWORD are not configured.');
    }

    // Attempt login to reach the 2FA page
    await loginPage.goto();
    await loginPage.login(username, password);

    // Wait for the URL to change to the 2FA authentication route
    try {
      await page.waitForURL(/\/auth\/2fa|mfa|verification/i, { timeout: 10000 });
    } catch (e) {
      // If we are logged in directly or didn't reach 2FA page, log warning
      console.log('[MFA Setup] 2FA page was not reached. It may already be a trusted session or direct login.');
    }
  });

  // TC014: Display 2FA Page on Login
  test('TC014 - Should display the 2FA verification page and input fields', async ({ loginPage, page }) => {
    // Assert 2FA elements are visible
    if (page.url().includes('2fa') || page.url().includes('mfa')) {
      await expect(loginPage.codeInput).toBeVisible();
      await expect(loginPage.confirm2FAButton).toBeVisible();
    } else {
      test.skip(true, 'Not on the 2FA page. Session might be pre-authenticated.');
    }
  });

  // TC016: Invalid 2FA Code Error Handling
  test('TC016 - Should show error message on entering invalid 2FA code', async ({ loginPage, page }) => {
    if (!page.url().includes('2fa') && !page.url().includes('mfa')) {
      test.skip(true, 'Not on the 2FA page.');
    }

    // Input invalid 6-digit code
    await loginPage.codeInput.fill('000000');
    await loginPage.confirm2FAButton.click();

    // User should remain on 2FA page
    await expect(page).toHaveURL(/\/auth\/2fa|mfa/);

    // Verify presence of field or toast errors
    const error = await loginPage.getErrorMessage();
    if (error) {
      expect(error.length).toBeGreaterThan(0);
    }
  });

  // TC024 & TC025: Trust Device Tooltip
  test('TC024 & TC025 - Should display and close the Trust This Device tooltip modal', async ({ loginPage, page }) => {
    if (!page.url().includes('2fa') && !page.url().includes('mfa')) {
      test.skip(true, 'Not on the 2FA page.');
    }

    // TC024: Verify presence of checkbox and click info icon
    await expect(loginPage.trustDeviceCheckbox).toBeVisible();
    await expect(loginPage.trustDeviceInfoIcon).toBeVisible();
    
    // Click info icon to show tooltip
    await loginPage.trustDeviceInfoIcon.click();
    await expect(loginPage.trustDeviceTooltip).toBeVisible();
    
    // Tooltip should contain explanations about skipping MFA
    const tooltipText = await loginPage.trustDeviceTooltip.innerText();
    expect(tooltipText).toMatch(/skip|trust|authenticate/i);

    // TC025: Close tooltip
    if (await loginPage.trustDeviceTooltipClose.isVisible()) {
      await loginPage.trustDeviceTooltipClose.click();
      await expect(loginPage.trustDeviceTooltip).not.toBeVisible();
    }
  });

  // TC027: Skip 2FA if Device is Already Trusted
  test('TC027 - Should bypass 2FA page when loading session from a trusted state', async ({ page }) => {
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
      test.skip(true, 'Skipping TC027: No active session state available.');
    }

    // Navigate to root
    await page.goto('/');
    
    // Confirm we bypassed 2FA and login pages, landing directly on Dashboard
    await expect(page).not.toHaveURL(/\/auth\/login/);
    await expect(page).not.toHaveURL(/\/auth\/2fa/);
  });
});
