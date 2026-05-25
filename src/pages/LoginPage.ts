import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Core Inputs & Buttons
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly signInButton: Locator;
  public readonly xeroSignInButton: Locator;
  
  // Left-Side Content Locators (TC002)
  public readonly leftLogo: Locator;
  public readonly leftHeading: Locator;
  public readonly leftDescription: Locator;

  // Right-Side Content Locators (TC002)
  public readonly rightHeading: Locator;
  public readonly rightSubHeading: Locator;
  public readonly forgotPasswordLink: Locator;

  // 2FA / Trust Device Locators (TC014 - TC028)
  public readonly codeInput: Locator;
  public readonly trustDeviceCheckbox: Locator;
  public readonly trustDeviceInfoIcon: Locator;
  public readonly trustDeviceTooltip: Locator;
  public readonly trustDeviceTooltipClose: Locator;
  public readonly confirm2FAButton: Locator;

  // Error Selectors
  public readonly fieldErrors: Locator;
  public readonly toastError: Locator;

  constructor(page: Page) {
    super(page);
    
    // Inputs & Buttons
    this.emailInput = this.page.locator('input#email');
    this.passwordInput = this.page.locator('input#password');
    this.signInButton = this.page.locator('#sign-in-btn');
    this.xeroSignInButton = this.page.locator('#sign-in-with-xero-btn');
    
    // Left-Side Elements
    this.leftLogo = this.page.locator('twp-svg-icon[name="workpapers-sorted-logo"]').first();
    this.leftHeading = this.page.locator('h1:has-text("Welcome to Workpapers Sorted")');
    this.leftDescription = this.page.locator('p:has-text("Workpapers Sorted by Cloudoffis streamlines")');

    // Right-Side Elements
    this.rightHeading = this.page.locator('h1:has-text("Sign In to Workpapers Sorted!")');
    this.rightSubHeading = this.page.locator('span:has-text("Use your credentials to continue with Workpapers Sorted")');
    this.forgotPasswordLink = this.page.locator('a.forgot-password');

    // 2FA Elements
    this.codeInput = this.page.locator('input[name="code"], input[type="text"].code-input, #code, input[formcontrolname="code"]');
    this.trustDeviceCheckbox = this.page.locator('input[type="checkbox"], #trust-device, label:has-text("Trust this device")');
    this.trustDeviceInfoIcon = this.page.locator('.info-icon, .fa-info-circle, text="info", [name*="info"], twp-svg-icon[name*="info"]');
    this.trustDeviceTooltip = this.page.locator('.tooltip, .tooltip-content, .popover, text=/Temporarily skip/i');
    this.trustDeviceTooltipClose = this.page.locator('.tooltip-close, .close-btn, text="X", .tooltip x-icon');
    this.confirm2FAButton = this.page.locator('button:has-text("Confirm"), #confirm-btn, button[type="submit"]');

    // Validation Errors
    this.fieldErrors = this.page.locator('.invalid-feedback, .error-message, .p-error, small.text-danger');
    this.toastError = this.page.locator('.p-toast-message-content, .toast-message, .toast-error, .alert-danger');
  }

  /**
   * Navigate to the login page.
   */
  async goto(): Promise<void> {
    await this.navigateTo('/auth/login');
  }

  /**
   * Performs standard login.
   */
  async login(username: string, password: string): Promise<void> {
    await this.fill(this.emailInput, username, 'Email Field');
    await this.fill(this.passwordInput, password, 'Password Field', true);
    await this.click(this.signInButton, 'Sign In Button');
  }

  /**
   * Clicks 'Sign in with Xero'.
   */
  async loginWithXero(): Promise<void> {
    await this.click(this.xeroSignInButton, 'Sign in with Xero Button');
  }

  /**
   * Retrieves active validation/toast errors.
   */
  async getErrorMessage(): Promise<string | null> {
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
   */
  async isDisplayed(): Promise<boolean> {
    return (await this.isVisible(this.emailInput)) && (await this.isVisible(this.signInButton));
  }
}
