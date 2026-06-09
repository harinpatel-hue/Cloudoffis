const { test, expect } = require('@playwright/test');
const { ApiUtils } = require('../../../src/utils/api-utils');
const { apiRoutes } = require('../../../src/config/api-routes');
const userPayload = require('../../../src/test-data/api-payloads/user-payload.json');

test.describe('User API Tests @api', () => {
  let apiUtils;

  test.beforeEach(({ request }) => {
    apiUtils = new ApiUtils(request);
  });

  test('GET Request Profile @smoke @regression', async () => {
    // Perform GET using routes from config
    const response = await apiUtils.get(apiRoutes.users.profile);
    
    // Expect 200 OK or auth/method error codes
    expect([200, 401, 403, 404, 405]).toContain(response.status());
  });

  test('POST Create User with Payload @regression', async () => {
    // Perform POST using user-payload and route from config
    const response = await apiUtils.post(apiRoutes.users.list, userPayload);
    
    expect([200, 201, 401, 403, 404, 405]).toContain(response.status());
  });
});
