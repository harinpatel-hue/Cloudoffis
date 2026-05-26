export class APIHelper {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
  }

  /**
   * Helper to perform a GET request with logging.
   * @param {string} url
   * @param {Record<string, string>} [headers={}]
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async get(url, headers = {}) {
    console.log(`[API GET] Requesting: ${url}`);
    return await this.request.get(url, { headers });
  }

  /**
   * Helper to perform a POST request with logging and auto JSON headers.
   * @param {string} url
   * @param {any} data
   * @param {Record<string, string>} [headers={}]
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async post(url, data, headers = {}) {
    console.log(`[API POST] Requesting: ${url}`);
    return await this.request.post(url, {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    });
  }
}
