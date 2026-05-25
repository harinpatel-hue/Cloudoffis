import { APIRequestContext, APIResponse } from '@playwright/test';

export class APIHelper {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Helper to perform a GET request with logging.
   */
  async get(url: string, headers: Record<string, string> = {}): Promise<APIResponse> {
    console.log(`[API GET] Requesting: ${url}`);
    return await this.request.get(url, { headers });
  }

  /**
   * Helper to perform a POST request with logging and auto JSON headers.
   */
  async post(url: string, data: any, headers: Record<string, string> = {}): Promise<APIResponse> {
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
