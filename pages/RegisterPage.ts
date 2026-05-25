import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  // Locators
  public readonly usernameInput: Locator;
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly confirmPasswordInput: Locator;
  public readonly registerButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.locator('input#username');
    this.emailInput = this.page.locator('input#email');
    this.passwordInput = this.page.locator('input#password');
    this.confirmPasswordInput = this.page.locator('input#confirm-password');
    this.registerButton = this.page.locator('button[type="submit"], #register-btn');
  }

  /**
   * Navigate to the registration page.
   */
  async goto(): Promise<void> {
    await this.navigateTo('/auth/register');
  }

  /**
   * Fills the registration form and submits.
   */
  async register(username: string, email: string, pass: string): Promise<void> {
    await this.fill(this.usernameInput, username, 'Username Field');
    await this.fill(this.emailInput, email, 'Email Field');
    await this.fill(this.passwordInput, pass, 'Password Field', true);
    await this.fill(this.confirmPasswordInput, pass, 'Confirm Password Field', true);
    await this.click(this.registerButton, 'Register Button');
  }
}
