import { test as setup } from '../src/fixtures/baseFixture';
import { STORAGE_STATE } from '../playwright.config';

setup('authenticate', async ({ loginPage, page }) => {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;

  // Gracefully handle placeholder credentials by skipping setup
  if (!username || !password || username.includes('placeholder') || password.includes('placeholder')) {
    console.log('\n========================================================================');
    console.log('[Setup Skip] Skipping global authentication setup.');
    console.log('Please configure valid TEST_USERNAME and TEST_PASSWORD in your .env file');
    console.log('to enable authenticated tests/projects.');
    console.log('========================================================================\n');
    return;
  }

  console.log(`[Setup] Attempting login with: ${username}`);
  await loginPage.goto();
  await loginPage.login(username, password);

  // Wait for redirection away from login page to verify successful login
  await page.waitForURL((url) => !url.href.includes('/auth/login'), { timeout: 15000 });

  // Save cookies and session storage state for standard projects to reuse
  await page.context().storageState({ path: STORAGE_STATE });
  console.log('[Setup Success] Authentication state saved successfully!');
});
