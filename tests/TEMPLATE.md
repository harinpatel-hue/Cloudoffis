# 📝 Cloudoffis Test Coding Standards & Templates

To maintain consistency and ensure the framework remains easy for everyone (including manual QA engineers) to write and maintain tests, follow these standards.

---

## 🛑 The Golden Rules (Summary)

1. **No Raw Selectors in Tests**: Never use raw selectors like `page.click('#submit')` inside test files. All page buttons, input fields, and custom actions must live in a page object file under `src/page-objects/`.
2. **Never Hardcode Secrets**: Passwords, emails, and MFA keys must always be retrieved from environment variables (e.g., `process.env.NORMAL_USERNAME`).
3. **Traceability Tagging**: Every test title must contain:
   * The execution tag: `@smoke` or `@regression` (determines if it runs in daily build).
   * The platform tag: `@ui` or `@api`.
   * The Google Sheet Test Case ID: `@TC-XXX`.

---

## 💻 1. UI Test Case Blueprint
Use this template when automating browser-based actions (clicking buttons, filling forms, and navigating pages).

*Copy and save as: `tests/ui/[module-name]/[test-name].spec.js`*

```javascript
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../../src/page-objects/login-page'); // Adjust relative path (e.g., ../../../src/...)

test.describe('Module Name UI Tests @ui @regression', () => {
  let loginPage;

  // Setup: runs before every test in this file
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate(); // Navigates browser to base URL
  });

  // TEST 1: Positive Case
  test('Verify successful action description @smoke @TC-101', async ({ page }) => {
    // 1. Arrange & Act (Perform user actions via POM)
    await loginPage.fillLoginCredentials(process.env.NORMAL_USERNAME, process.env.NORMAL_PASSWORD);
    
    // 2. Assert (Verify outcome)
    await expect(page).toHaveURL(/dashboard/);
  });

  // TEST 2: Negative/Validation Case
  test('Verify error when credentials are empty @TC-102', async ({ page }) => {
    // 1. Arrange & Act (Click without entering data)
    await loginPage.loginButton.click();

    // 2. Assert (Verify error locator is visible)
    await expect(loginPage.emailError).toBeVisible();
  });
});
```

---

## 🔌 2. API Test Case Blueprint
Use this template when automating backend API endpoints (sending request payloads and verifying status codes).

*Copy and save as: `tests/api/[module-name]/[test-name]-api.spec.js`*

```javascript
const { test, expect } = require('@playwright/test');
const { ApiUtils } = require('../../../src/utils/api-utils'); // Adjust relative path
const { apiRoutes } = require('../../../src/config/api-routes');
const userPayload = require('../../../src/test-data/api-payloads/user-payload.json'); // Import JSON payload if needed

test.describe('Module Name API Tests @api @regression', () => {
  let apiUtils;

  // Setup: Runs before every API request
  test.beforeEach(({ request }) => {
    apiUtils = new ApiUtils(request);
  });

  // TEST 1: GET Request
  test('GET user profile info @smoke @TC-201', async () => {
    // 1. Act (Execute call)
    const response = await apiUtils.get(apiRoutes.users.profile);
    
    // 2. Assert (Verify HTTP status code)
    expect(response.status()).toBe(200);
  });

  // TEST 2: POST Request
  test('POST create new user profile @TC-202', async () => {
    // 1. Act (Execute post with payload)
    const response = await apiUtils.post(apiRoutes.users.list, userPayload);
    
    // 2. Assert (Expect 201 Created or 200 OK)
    expect([200, 201]).toContain(response.status());
  });
});
```
