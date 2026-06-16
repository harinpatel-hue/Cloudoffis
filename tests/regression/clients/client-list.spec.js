const { test, expect } = require('../../../utils/fixtures');

test.describe('Client List UI Tests', () => {

  test('Search client by name @TC-701', async ({ clientsPage }) => {
    await clientsPage.navigate();
    // Search for a client by name
    await clientsPage.searchClient('Alica');
    await clientsPage.verifyClientIsVisible('Alica');
  });

  test('Verify client list visual layout @TC-702 @visual', async ({ clientsPage }) => {
    await clientsPage.navigate();
    // Search for client to render stable list
    await clientsPage.searchClient('Alica');
    // Assert visual layout snapshot matching
    await clientsPage.verifyVisualLayout('client-list-layout.png');
  });
});
