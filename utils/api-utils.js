class ApiUtils {
  constructor(requestContext) {
    this.request = requestContext;
  }

  async get(url) {
    const response = await this.request.get(url);
    return response;
  }

  async post(url, requestData) {
    const response = await this.request.post(url, {
      data: requestData
    });
    return response;
  }
}

module.exports = { ApiUtils };
