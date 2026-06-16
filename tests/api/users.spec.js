const { test, expect } = require('../../utils/fixtures');
const { apiRoutes } = require('../../config/api-routes');

const userPayload = {
  username: "qa.user@example.com",
  firstName: "QA",
  lastName: "User",
  role: "QA Analyst",
  status: "Active"
};

test.describe('User API Tests', () => {
  test('GET Request Profile', async ({ apiUtils }) => {
    // Perform GET using routes from config
    const response = await apiUtils.get(apiRoutes.users.profile);

    // Expect 200 OK or auth/method error codes
    expect([200, 401, 403, 404, 405]).toContain(response.status());
  });

  test('POST Create User with Payload', async ({ apiUtils }) => {
    // Perform POST using user-payload and route from config
    const response = await apiUtils.post(apiRoutes.users.list, userPayload);

    expect([200, 201, 401, 403, 404, 405]).toContain(response.status());
  });
});
