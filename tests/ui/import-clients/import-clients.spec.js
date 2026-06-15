const { test } = require('@playwright/test');
const { ImportClientsPage } = require('../../../src/page-objects/import-clients-page');

test.describe('Import Clients @ui', () => {
  let importClientsPage;

  test.beforeEach(async ({ page }) => {
    importClientsPage = new ImportClientsPage(page);
    await importClientsPage.navigate();
  });

  test('Verify Import Clients screen loads @TC001 @regression', async () => {
    await importClientsPage.expectLoaded();
    await importClientsPage.expectNoSelectedClients();
  });

  test('Verify Xero OAuth can be completed when authorization is required @TC002 @regression', async () => {
    await importClientsPage.completeXeroLoginIfRequired();
    await importClientsPage.expectLoaded();
  });

  test('Verify searching for an available client filters the client list @TC003 @regression', async () => {
    const clientName = 'Test Client';

    await importClientsPage.searchAvailableClient(clientName);
    await importClientsPage.getAvailableClientRow(clientName).waitFor({ state: 'visible' });
  });

  test('Verify selected client can be added @TC004 @regression', async () => {
    const clientName = 'Test Client';

    await importClientsPage.searchAvailableClient(clientName);
    await importClientsPage.selectAvailableClient(clientName);
    await importClientsPage.addSelectedClients();
  });
});
