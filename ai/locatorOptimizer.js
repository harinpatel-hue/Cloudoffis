export class LocatorOptimizer {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Attempts to locate an element with a primary selector,
   * and falls back to secondary selectors if the primary selector fails.
   * @param {string} primarySelector
   * @param {string[]} fallbacks
   * @returns {Promise<import('@playwright/test').Locator>}
   */
  async findOptimalElement(primarySelector, fallbacks) {
    const primaryLocator = this.page.locator(primarySelector);
    try {
      // Check if visible or attached quickly
      await primaryLocator.waitFor({ state: 'attached', timeout: 1000 });
      return primaryLocator;
    } catch (error) {
      console.log(`[AI Locator Optimizer] Primary selector "${primarySelector}" failed. Trying fallbacks...`);
      for (const fallback of fallbacks) {
        const fallbackLocator = this.page.locator(fallback);
        try {
          await fallbackLocator.waitFor({ state: 'attached', timeout: 1000 });
          console.log(`[AI Locator Optimizer] Found fallback element with selector: "${fallback}"`);
          return fallbackLocator;
        } catch (e) {
          // Continue to next fallback
        }
      }
      // If all fail, return primary anyway to allow standard playwright failure report
      return primaryLocator;
    }
  }
}
