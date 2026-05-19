import { test } from '@playwright/test';
import { Homepage } from '../pages/Homepage.js';

// This test suite covers the homepage of the Cloudoffis website, including navigation, dropdown menu functionality, and scrolling.
test('should have title', async ({ page }) => {

  const homepage = new Homepage(page);

  await homepage.gotoHomepage();
  await homepage.verifyHomepage();
});

// This test checks the functionality of the login dropdown menu on the homepage.
test('Check the dropdown menu', async ({ page }) => {

  const homepage = new Homepage(page);

  await homepage.gotoHomepage();
  await homepage.openLoginDropdown();
});

// This test checks the available options in the login dropdown menu on the homepage.
test('Check the available options in the dropdown menu', async ({ page }) => {

  const homepage = new Homepage(page);

  await homepage.gotoHomepage();
  await homepage.openLoginDropdown();
  await homepage.verifyDropdownOptions();
});

// These tests check the functionality of each option in the login dropdown menu on the homepage.
test('Click on Workpapers Sorted', async ({ page }) => {

  const homepage = new Homepage(page);

  await homepage.gotoHomepage();
  await homepage.openLoginDropdown();
  await homepage.clickWorkpapersSorted();
});

// This test checks the functionality of the SMSF Sorted option in the login dropdown menu on the homepage.
test('Click on SMSF Sorted', async ({ page }) => {

  const homepage = new Homepage(page);

  await homepage.gotoHomepage();
  await homepage.openLoginDropdown();
  await homepage.clickSMSFSorted();
});

// This test checks the functionality of the SMSF Auditomation option in the login dropdown menu on the homepage.
test('Click on SMSF Auditomation', async ({ page }) => {

  const homepage = new Homepage(page);

  await homepage.gotoHomepage();
  await homepage.openLoginDropdown();
  await homepage.clickSMSFAuditomation();
});

// This test checks the scrolling functionality on the homepage.
test('Check scrolling functionality', async ({ page }) => {

  const homepage = new Homepage(page);

  await homepage.gotoHomepage();
  await homepage.scrollPage();
});

// This test checks the functionality of the Products section link on the homepage.
test('Click on Products section', async ({ page }) => {

  const homepage = new Homepage(page);

  await homepage.gotoHomepage();
  await homepage.clickProductsSection();
  await page.waitForTimeout(2000); // Wait for 2 seconds to allow the page to load after clicking the Products section link
});

// This test checks the functionality of the Services section link on the homepage.
test('Click on Services section', async ({ page }) => {

  const homepage = new Homepage(page);

  await homepage.gotoHomepage();
  await homepage.clickServicesSection();
  await page.waitForTimeout(2000); // Wait for 2 seconds to allow the page to load after clicking the Services section link
});

// This test checks the functionality of the Resources section link on the homepage.
test('Click on Resources section', async ({ page }) => {

  const homepage = new Homepage(page);

  await homepage.gotoHomepage();
  await homepage.clickResourcesSection();
  await page.waitForTimeout(2000); // Wait for 2 seconds to allow the page to load after clicking the Resources section link
});

// This test checks the functionality of the Pricing section link on the homepage.
test('Click on Pricing section', async ({ page }) => {

  const homepage = new Homepage(page);

  await homepage.gotoHomepage();
  await homepage.clickPricingSection();
  await page.waitForTimeout(2000); // Wait for 2 seconds to allow the page to load after clicking the Pricing section link
});