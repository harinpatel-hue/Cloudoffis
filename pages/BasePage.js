export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a path relative to the baseURL or an absolute URL.
   * @param {string} [path='']
   * @returns {Promise<void>}
   */
  async navigateTo(path = '') {
    console.log(`[Navigation] Navigating to: ${path}`);
    await this.page.goto(path);
  }

  /**
   * Safe click action with logging.
   * @param {import('@playwright/test').Locator | string} locator
   * @param {string} [name]
   * @returns {Promise<void>}
   */
  async click(locator, name) {
    const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const elementName = name || (typeof locator === 'string' ? locator : 'element');
    console.log(`[Action] Clicking on: ${elementName}`);
    await loc.click();
  }

  /**
   * Safe input fill action with logging (optional sensitive value masking).
   * @param {import('@playwright/test').Locator | string} locator
   * @param {string} value
   * @param {string} [name]
   * @param {boolean} [maskValue=false]
   * @returns {Promise<void>}
   */
  async fill(locator, value, name, maskValue = false) {
    const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const elementName = name || (typeof locator === 'string' ? locator : 'input');
    const displayValue = maskValue ? '********' : value;
    console.log(`[Action] Filling "${elementName}" with: ${displayValue}`);
    await loc.fill(value);
  }

  /**
   * Gets the inner text of an element.
   * @param {import('@playwright/test').Locator | string} locator
   * @returns {Promise<string>}
   */
  async getElementText(locator) {
    const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await loc.innerText();
  }

  /**
   * Wait for element to be in a specific state (visible, hidden, attached, detached).
   * @param {import('@playwright/test').Locator | string} locator
   * @param {'visible' | 'hidden' | 'attached' | 'detached'} [state='visible']
   * @param {number} [timeout=10000]
   * @returns {Promise<void>}
   */
  async waitForElementState(
    locator, 
    state = 'visible', 
    timeout = 10000
  ) {
    const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await loc.waitFor({ state, timeout });
  }

  /**
   * Get the current page title.
   * @returns {Promise<string>}
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Check if element is visible.
   * @param {import('@playwright/test').Locator | string} locator
   * @returns {Promise<boolean>}
   */
  async isVisible(locator) {
    const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await loc.isVisible();
  }
}
