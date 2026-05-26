import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    
    // Inputs & Buttons
    /** @type {import('@playwright/test').Locator} */
    this.emailInput = this.page.locator('input#email');
    /** @type {import('@playwright/test').Locator} */
    this.passwordInput = this.page.locator('input#password');
    /** @type {import('@playwright/test').Locator} */
    this.signInButton = this.page.locator('#sign-in-btn');
    /** @type {import('@playwright/test').Locator} */
    this.xeroSignInButton = this.page.locator('#sign-in-with-xero-btn');
    
    // Left-Side Elements
    /** @type {import('@playwright/test').Locator} */
    this.leftLogo = this.page.locator('twp-svg-icon[name="workpapers-sorted-logo"]').first();
    /** @type {import('@playwright/test').Locator} */
    this.leftHeading = this.page.locator('h1:has-text("Welcome to Workpapers Sorted")');
    /** @type {import('@playwright/test').Locator} */
    this.leftDescription = this.page.locator('p:has-text("Workpapers Sorted by Cloudoffis streamlines")');

    // Right-Side Elements
    /** @type {import('@playwright/test').Locator} */
    this.rightHeading = this.page.locator('h1:has-text("Sign In to Workpapers Sorted!")');
    /** @type {import('@playwright/test').Locator} */
    this.rightSubHeading = this.page.locator('span:has-text("Use your credentials to continue with Workpapers Sorted")');
    /** @type {import('@playwright/test').Locator} */
    this.forgotPasswordLink = this.page.locator('a.forgot-password');

    // 2FA Elements
    /** @type {import('@playwright/test').Locator} */
    this.codeInput = this.page.locator('input[name="code"], input[type="text"].code-input, #code, input[formcontrolname="code"]');
    /** @type {import('@playwright/test').Locator} */
    this.trustDeviceCheckbox = this.page.locator('input[type="checkbox"], #trust-device, label:has-text("Trust this device")');
    /** @type {import('@playwright/test').Locator} */
    this.trustDeviceInfoIcon = this.page.locator('.info-icon, .fa-info-circle, text="info", [name*="info"], twp-svg-icon[name*="info"]');
    /** @type {import('@playwright/test').Locator} */
    this.trustDeviceTooltip = this.page.locator('.tooltip, .tooltip-content, .popover, text=/Temporarily skip/i');
    /** @type {import('@playwright/test').Locator} */
    this.trustDeviceTooltipClose = this.page.locator('.tooltip-close, .close-btn, text="X", .tooltip x-icon');
    /** @type {import('@playwright/test').Locator} */
    this.confirm2FAButton = this.page.locator('button:has-text("Confirm"), #confirm-btn, button[type="submit"]');

    // Validation Errors
    /** @type {import('@playwright/test').Locator} */
    this.fieldErrors = this.page.locator('.invalid-feedback, .error-message, .p-error, small.text-danger');
    /** @type {import('@playwright/test').Locator} */
    this.toastError = this.page.locator('.p-toast-message-content, .toast-message, .toast-error, .alert-danger');
  }

  /**
   * Navigate to the login page.
   * @returns {Promise<void>}
   */
  async goto() {
    await this.navigateTo('/auth/login');
  }

  /**
   * Performs standard login.
   * @param {string} username
   * @param {string} password
   * @returns {Promise<void>}
   */
  async login(username, password) {
    await this.fill(this.emailInput, username, 'Email Field');
    await this.fill(this.passwordInput, password, 'Password Field', true);
    await this.click(this.signInButton, 'Sign In Button');
  }

  /**
   * Clicks 'Sign in with Xero'.
   * @returns {Promise<void>}
   */
  async loginWithXero() {
    await this.click(this.xeroSignInButton, 'Sign in with Xero Button');
  }

  /**
   * Retrieves active validation/toast errors.
   * @returns {Promise<string | null>}
   */
  async getErrorMessage() {
    if (await this.toastError.first().isVisible()) {
      return await this.getElementText(this.toastError.first());
    }
    if (await this.fieldErrors.first().isVisible()) {
      return await this.getElementText(this.fieldErrors.first());
    }
    return null;
  }

  /**
   * Verifies if we are on the login page.
   * @returns {Promise<boolean>}
   */
  async isDisplayed() {
    return (await this.isVisible(this.emailInput)) && (await this.isVisible(this.signInButton));
  }
}
