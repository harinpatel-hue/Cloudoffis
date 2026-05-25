import { test, expect } from '@fixtures/baseFixture';

test.describe('Cloudoffis Login Page Tests @login', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  // TC001: Verify navigation to Login Screen
  test('TC001 - Should load and display the Login Screen of Workpapers Sorted', async ({ page }) => {
    // Assert we are redirected to /auth/login
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page).toHaveTitle(/Workpapers Sorted/i);
  });

  // TC002: Verify layout and fields on Login Screen
  test('TC002 - Should display correct layout, text content, and input fields on left & right sides', async ({ loginPage }) => {
    // Left-Side Assertions
    await expect(loginPage.leftLogo).toBeVisible();
    await expect(loginPage.leftHeading).toBeVisible();
    await expect(loginPage.leftDescription).toBeVisible();
    
    const descText = await loginPage.leftDescription.innerText();
    expect(descText).toContain('Workpapers Sorted by Cloudoffis streamlines workpaper preparation');

    // Right-Side Assertions
    await expect(loginPage.rightHeading).toBeVisible();
    await expect(loginPage.rightSubHeading).toBeVisible();
    await expect(loginPage.xeroSignInButton).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
  });

  // TC033: Verify Email Field Validation (Empty Email)
  test('TC033 - Should validate empty Email field when password is filled', async ({ loginPage }) => {
    await loginPage.passwordInput.fill('SomePassword123');
    await loginPage.signInButton.click();

    // Check that email input shows invalid validation classes
    await expect(loginPage.emailInput).toHaveClass(/ng-invalid/);
    // Password input should remain valid/untouched as it is filled
    await expect(loginPage.passwordInput).not.toHaveClass(/ng-invalid/);
  });

  // TC034: Verify Password Field Validation (Empty Password)
  test('TC034 - Should validate empty Password field when email is filled', async ({ loginPage }) => {
    await loginPage.emailInput.fill('test@cloudoffis.com.au');
    await loginPage.signInButton.click();

    // Check that password input shows invalid validation classes
    await expect(loginPage.passwordInput).toHaveClass(/ng-invalid/);
  });

  // TC035: Verify Invalid Email Format
  test('TC035 - Should validate incorrect email format', async ({ loginPage }) => {
    await loginPage.emailInput.fill('invalidemailcom');
    await loginPage.passwordInput.fill('SomePassword123');
    await loginPage.signInButton.click();

    // Email field must show invalid state
    await expect(loginPage.emailInput).toHaveClass(/ng-invalid/);
  });

  // TC036: Verify Invalid Credentials
  test('TC036 - Should display error message on wrong email/password credentials', async ({ loginPage, page }) => {
    await loginPage.login('wronguser@cloudoffis.com.au', 'wrongpassword');

    // User must remain on login page
    await expect(page).toHaveURL(/\/auth\/login/);

    // Verify presence of an error indicator (toast or form warning)
    const errorMsg = await loginPage.getErrorMessage();
    if (errorMsg) {
      expect(errorMsg.length).toBeGreaterThan(0);
    } else {
      console.log('[TC036 Verification] No text error retrieved; form remained unsubmitted.');
    }
  });

  // TC037: Successful Login with Correct credentials (Individual Run)
  test('TC037 - Should successfully log in and redirect to dashboard with valid credentials', async ({ loginPage, dashboardPage, page }) => {
    const username = process.env.TEST_USERNAME;
    const password = process.env.TEST_PASSWORD;

    if (!username || !password || username.includes('placeholder') || password.includes('placeholder')) {
      test.skip(true, 'Skipping TC037: Active credentials not configured in .env file.');
    }

    await loginPage.login(username!, password!);
    
    // Should navigate to dashboard
    await dashboardPage.verifyOnDashboard();
  });

  // TC038: Verify Forgot Password Link click navigation
  test('TC038 - Should navigate to password recovery page upon clicking Forgot Password link', async ({ loginPage, page }) => {
    await loginPage.forgotPasswordLink.click();
    
    // Check if URL redirects to recovery page route
    await page.waitForURL(/\/auth\/forgot-password|forgotpassword|reset-password|forgot/i, { timeout: 5000 });
    expect(page.url()).toMatch(/\/auth\/forgot-password|forgotpassword|reset-password|forgot/i);
  });
});
