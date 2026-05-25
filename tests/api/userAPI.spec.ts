import { test, expect } from '@playwright/test';
import { APIHelper } from '@utils/apiHelper';

test.describe('User API Verification Tests @api', () => {
  let apiHelper: APIHelper;

  test.beforeAll(async ({ playwright }) => {
    // Create request context
    const context = await playwright.request.newContext({
      baseURL: 'https://jsonplaceholder.typicode.com', // Public REST API for verification
    });
    apiHelper = new APIHelper(context);
  });

  test('should retrieve user details successfully via API GET', async () => {
    const response = await apiHelper.get('/users/1');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('email');
    expect(data.email).toContain('@');
  });

  test('should create a new user successfully via API POST', async () => {
    const payload = {
      name: 'Cloudoffis QA Test',
      username: 'cloudoffisqa',
      email: 'qa@cloudoffis.com.au',
    };

    const response = await apiHelper.post('/users', payload);
    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.name).toBe(payload.name);
  });
});
