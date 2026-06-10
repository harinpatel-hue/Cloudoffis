const { test, expect } = require('@playwright/test');
const { ClientsPage } = require('../../../src/page-objects/clients');

test.describe('Client List UI Tests @ui @regression', () => {

  let clientsPage;

  test.beforeEach(async ({ page }) => {
    clientsPage = new ClientsPage(page);
    await clientsPage.navigate();
  });

  test('Search client by name @TC-701 @regression', async ({ page }) => {
    // Search for a client by name
    await clientsPage.searchClient('Alica');
    await page.waitForTimeout(3000);
    await clientsPage.verifyClientIsVisible('Alica');
  });
});
