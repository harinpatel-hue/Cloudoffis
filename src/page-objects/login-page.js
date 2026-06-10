class LoginPage {
  constructor(page) {
    this.page = page;

    // Simple Selectors
    this.usernameInput = page.locator('input#email');
    this.passwordInput = page.locator('input#password');
    this.loginButton = page.locator('#sign-in-btn');

    this.mfaCodeInput = page.getByLabel('Enter Code', { exact: true });
    this.mfaVerifyButton = page.getByRole('button', { name: 'Verify Code' });

    this.xeroLoginButton = page.locator('button:has-text("Xero"), a:has-text("Xero")');

    this.emailError = page.locator('text=Email Address is required.');
    this.passwordError = page.locator('text=Password field is required.');
    this.generalErrorMessage = page.locator('.toast, [role="alert"]');
  }

  async navigate() {
    await this.page.goto('');
  }

  async fillLoginCredentials(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async enterMfaCode(code) {
    const resolvedCode = await code;
    await this.mfaCodeInput.fill(resolvedCode);
    await this.mfaVerifyButton.click();
  }

  async clickXeroLogin() {
    await this.xeroLoginButton.click();
  }

  async fillXeroCredentials(email, password) {
    await this.page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Log in' }).click();
  }

  async fillXeroMfa(code) {
    const resolvedCode = await code;
    await this.page.getByRole('textbox', { name: 'Authentication code' }).fill(resolvedCode);
    await this.page.getByRole('button', { name: 'Confirm' }).click();
  }

  async allowAccess() {
    await this.page.getByRole('button', { name: 'Allow access' }).click();
  }
}

module.exports = { LoginPage };
