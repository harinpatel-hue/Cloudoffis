import { BasePage } from './BasePage.js';

export class RegistrationPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    /** @type {import('@playwright/test').Locator} */
    this.usernameInput = this.page.locator('input#username');
    /** @type {import('@playwright/test').Locator} */
    this.emailInput = this.page.locator('input#email');
    /** @type {import('@playwright/test').Locator} */
    this.passwordInput = this.page.locator('input#password');
    /** @type {import('@playwright/test').Locator} */
    this.confirmPasswordInput = this.page.locator('input#confirm-password');
    /** @type {import('@playwright/test').Locator} */
    this.registerButton = this.page.locator('button[type="submit"], #register-btn');
  }

  /**
   * Navigate to the registration page.
   * @returns {Promise<void>}
   */
  async goto() {
    await this.navigateTo('/auth/register');
  }

  /**
   * Fills the registration form and submits.
   * @param {string} username
   * @param {string} email
   * @param {string} pass
   * @returns {Promise<void>}
   */
  async register(username, email, pass) {
    await this.fill(this.usernameInput, username, 'Username Field');
    await this.fill(this.emailInput, email, 'Email Field');
    await this.fill(this.passwordInput, pass, 'Password Field', true);
    await this.fill(this.confirmPasswordInput, pass, 'Confirm Password Field', true);
    await this.click(this.registerButton, 'Register Button');
  }
}
