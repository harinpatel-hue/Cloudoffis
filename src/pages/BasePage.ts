import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a path relative to the baseURL or an absolute URL.
   */
  async navigateTo(path: string = ''): Promise<void> {
    console.log(`[Navigation] Navigating to: ${path}`);
    await this.page.goto(path);
  }

  /**
   * Safe click action with logging.
   */
  async click(locator: Locator | string, name?: string): Promise<void> {
    const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const elementName = name || (typeof locator === 'string' ? locator : 'element');
    console.log(`[Action] Clicking on: ${elementName}`);
    await loc.click();
  }

  /**
   * Safe input fill action with logging (optional sensitive value masking).
   */
  async fill(locator: Locator | string, value: string, name?: string, maskValue: boolean = false): Promise<void> {
    const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const elementName = name || (typeof locator === 'string' ? locator : 'input');
    const displayValue = maskValue ? '********' : value;
    console.log(`[Action] Filling "${elementName}" with: ${displayValue}`);
    await loc.fill(value);
  }

  /**
   * Gets the inner text of an element.
   */
  async getElementText(locator: Locator | string): Promise<string> {
    const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await loc.innerText();
  }

  /**
   * Wait for element to be in a specific state (visible, hidden, attached, detached).
   */
  async waitForElementState(
    locator: Locator | string, 
    state: 'visible' | 'hidden' | 'attached' | 'detached' = 'visible', 
    timeout: number = 10000
  ): Promise<void> {
    const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await loc.waitFor({ state, timeout });
  }

  /**
   * Get the current page title.
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Check if element is visible.
   */
  async isVisible(locator: Locator | string): Promise<boolean> {
    const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await loc.isVisible();
  }
}
