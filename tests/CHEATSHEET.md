# 🚀 Playwright Master Cheat Sheet & Feature Reference

This guide covers all major Playwright features, from basic browser interactions to advanced patterns like file handling, iframe testing, tab switching, and network interception.

---

## 🏃 1. Command Line (CLI) Commands

| Task | Command |
| :--- | :--- |
| **Run all tests** | `npx playwright test` |
| **Run specific suite** | `npx playwright test --project=smoke-suite` |
| **Run a single test file** | `npx playwright test tests/ui/auth/login.spec.js` |
| **Run headed mode** | `npx playwright test --headed` |
| **Debug tests (Step-by-step)** | `npx playwright test --debug` |
| **Run tests matching tag** | `npx playwright test --grep @smoke` |
| **Run tests excluding tag** | `npx playwright test --grep-invert @regression` |
| **Show HTML Report** | `npx playwright show-report` |

---

## 📅 2. Test Hooks & Structure

Organize setup and teardown stages at the file level:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Module Suite @ui', () => {

  // Runs once before all tests in this file (e.g. database setup)
  test.beforeAll(async () => {
    console.log('Setup database connections');
  });

  // Runs before each individual test (e.g. page navigation)
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  // Runs after each individual test (e.g. clearing cookies)
  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  // Runs once after all tests in this file (e.g. teardown)
  test.afterAll(async () => {
    console.log('Teardown database connections');
  });

  test('Test Case Title @smoke @TC-101', async ({ page }) => {
    await expect(page).toHaveURL(/login/);
  });
});
```

---

## 🎯 3. Locators & Element Interactions

### Actions
```javascript
// Input text
await page.locator('#username').fill('admin');

// Click elements
await page.locator('.submit-btn').click();
await page.locator('.submit-btn').dblclick(); // Double click
await page.locator('.submit-btn').click({ button: 'right' }); // Right click

// Checkbox / Radio buttons
await page.locator('#terms').check();
await page.locator('#terms').uncheck();

// Dropdowns (Select option)
await page.locator('#country').selectOption('Australia'); // By label text
await page.locator('#country').selectOption({ value: 'AU' }); // By value attribute
await page.locator('#country').selectOption({ index: 2 }); // By index
```

### Smart Wait states
```javascript
// Wait for an element to be visible
await page.locator('.loading-spinner').waitFor({ state: 'visible', timeout: 5000 });

// Wait for an element to be removed from DOM
await page.locator('.loading-spinner').waitFor({ state: 'hidden', timeout: 5000 });
```

---

## 🏆 4. Playwright Assertions (`expect`)

Playwright assertions have built-in **auto-retry** (default 5 seconds) until the condition is met.

| Assertion | Verifies |
| :--- | :--- |
| `await expect(page).toHaveURL(/dashboard/);` | Page URL matches regex or string |
| `await expect(page).toHaveTitle('Dashboard');` | Page HTML title matches |
| `await expect(locator).toBeVisible();` | Element is visible on the screen |
| `await expect(locator).toBeHidden();` | Element is hidden or removed |
| `await expect(locator).toBeEnabled();` | Input/button is enabled |
| `await expect(locator).toBeDisabled();` | Input/button is disabled |
| `await expect(locator).toHaveText('Success');` | Element contains exact text |
| `await expect(locator).toContainText('Succ');` | Element contains partial text |
| `await expect(locator).not.toBeVisible();` | **Negative assertion** (is NOT visible) |

---

## 🖼️ 5. Handling iFrames (Frames)

To interact with elements inside an iframe, use `frameLocator()`:

```javascript
// Locate the iframe using its selector
const myIframe = page.frameLocator('#payment-iframe-id');

// Interact with elements inside the iframe just like normal page elements
await myIframe.locator('#credit-card-number').fill('4111 1111 1111 1111');
await myIframe.locator('#pay-now-btn').click();
```

---

## 📑 6. Handling Multiple Tabs, Windows & Contexts

Interact with a popup or a new tab opened via target link (`target="_blank"`):

```javascript
// Wait for the new tab/page event while triggering the click
const [newPage] = await Promise.all([
  page.context().waitForEvent('page'),
  page.locator('#open-xero-btn').click(), // Action that opens the new tab
]);

// Wait for the new page to load
await newPage.waitForLoadState();

// Interact with the new tab
await expect(newPage).toHaveURL(/xero\.com/);
await newPage.locator('#email').fill('xero-user');
await newPage.close(); // Close the new tab
```

---

## 💬 7. Handling JS Dialogs (Alerts, Confirms, Prompts)

Playwright dismisses dialogs automatically by default. To accept/dismiss custom dialogs, set up a listener **before** the trigger action:

```javascript
// 1. Setup dialog event listener
page.on('dialog', async dialog => {
  console.log(`Dialog message: ${dialog.message()}`);
  
  if (dialog.type() === 'confirm') {
    await dialog.accept(); // Clicks "OK"
  } else {
    await dialog.dismiss(); // Clicks "Cancel"
  }
});

// 2. Click the button that triggers the JS alert
await page.locator('#delete-account-btn').click();
```

---

## 📂 8. File Uploads & Downloads

### Upload Files
```javascript
// Upload a single file
await page.locator('input[type="file"]').setInputFiles('src/test-data/sample-client.csv');

// Upload multiple files
await page.locator('input[type="file"]').setInputFiles([
  'src/test-data/file1.pdf',
  'src/test-data/file2.pdf'
]);

// Remove uploaded files
await page.locator('input[type="file"]').setInputFiles([]);
```

### Download Files
```javascript
// Wait for the download event while triggering the download action
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.locator('#export-csv-btn').click() // Action triggering download
]);

// Save the downloaded file to a path
await download.saveAs('test-results/downloads/client-export.csv');
```

---

## ⌨️ 9. Mouse & Keyboard Controls

### Mouse Movements
```javascript
// Hover over an dropdown menu to expand it
await page.locator('#profile-menu').hover();

// Click at specific coordinates (x, y)
await page.mouse.click(100, 200);
```

### Keyboard Keys
```javascript
// Press single key
await page.keyboard.press('Enter');
await page.keyboard.press('Tab');

// Key combinations (select all and delete)
await page.keyboard.press('Control+A');
await page.keyboard.press('Backspace');
```

### Drag and Drop
```javascript
// Drag element A to element B
await page.locator('#source-item').dragTo(page.locator('#target-column'));
```

---

## 🌐 10. Network Mocking & Interception

Mock API payloads or block heavy resources (like images) to speed up tests:

### Mocking API Response (Fulfill)
```javascript
// Mock a GET call returning mock JSON
await page.route('**/api/users/profile', async route => {
  const mockJson = { id: 123, name: "Mock Test User", role: "Auditor" };
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(mockJson),
  });
});

// Navigate and the page will load the mock data instead of calling the actual backend
await page.goto('/profile');
```

### Aborting Network Requests (Speed Optimizations)
```javascript
// Block images and stylesheets to speed up loading
await page.route('**/*.{png,jpg,jpeg,css}', route => route.abort());
```
