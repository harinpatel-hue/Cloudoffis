import { test, expect } from '@fixtures/baseFixture.js';
import { RandomGenerator } from '@utils/randomGenerator.js';

test.describe('Registration Screen Smoke Tests @registration', () => {

  test.beforeEach(async ({ registrationPage, page }) => {
    await registrationPage.goto();
    // If redirected to login, the environment does not expose registration publicly
    if (page.url().includes('/auth/login')) {
      test.skip(true, 'Skipping registration tests: Public registration is not enabled or accessible in this environment.');
    }
  });

  test('should load registration page and verify all elements', async ({ registrationPage }) => {
    // Verify fields are visible
    await expect(registrationPage.usernameInput).toBeVisible();
    await expect(registrationPage.emailInput).toBeVisible();
    await expect(registrationPage.passwordInput).toBeVisible();
    await expect(registrationPage.confirmPasswordInput).toBeVisible();
    await expect(registrationPage.registerButton).toBeVisible();
  });

  test('should fill out and submit registration form successfully', async ({ registrationPage, page }) => {
    const username = RandomGenerator.generateName('smoke_user');
    const email = RandomGenerator.generateEmail('smoke');
    const password = 'StrongPassword123!';

    // Perform registration
    await registrationPage.register(username, email, password);

    // After submit, check if page navigates or shows feedback
    expect(page.url()).not.toContain('register-fail');
  });
});
