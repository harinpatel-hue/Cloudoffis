import { test, expect } from '@fixtures/baseFixture';
import { STORAGE_STATE } from '../../playwright.config';
import * as fs from 'fs';

test.describe('Cloudoffis Dashboard Tests @dashboard', () => {

  test.beforeEach(async ({ page }) => {
    // Safely check if storage state contains cached login session cookies
    let hasAuth = false;
    try {
      if (fs.existsSync(STORAGE_STATE)) {
        const state = JSON.parse(fs.readFileSync(STORAGE_STATE, 'utf-8'));
        if (state.cookies && state.cookies.length > 0) {
          hasAuth = true;
        }
      }
    } catch (e) {
      console.log('[Warn] Failed to parse storage state:', e);
    }

    if (!hasAuth) {
      test.skip(true, 'Skipping authenticated test because active session state is not generated (no valid credentials).');
    }
  });

  test('should load the dashboard and verify key layout elements', async ({ dashboardPage, page }) => {
    // Navigate to root (which should redirect to dashboard when authenticated)
    await page.goto('/');
    
    // Verify user is successfully authenticated and dashboard page is rendered
    await dashboardPage.verifyOnDashboard();
    
    // Verify profile menu exists in layout
    await expect(dashboardPage.profileDropdown.first()).toBeVisible();
  });

  test('should allow user to log out successfully', async ({ dashboardPage, page }) => {
    await page.goto('/');
    await dashboardPage.verifyOnDashboard();
    
    // Trigger logout
    await dashboardPage.logout();
    
    // Confirm we are back on the login screen
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
