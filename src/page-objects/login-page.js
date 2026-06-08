class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Simple Selectors
    this.usernameInput = page.locator('input#email');
    this.passwordInput = page.locator('input#password');
    this.loginButton = page.locator('#sign-in-btn');
    
    this.mfaCodeInput = page.locator('input[name="code"]');
    this.mfaVerifyButton = page.locator('button:has-text("Verify"), button:has-text("Submit")');
    
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
    await this.mfaCodeInput.fill(code);
    await this.mfaVerifyButton.click();
  }

  async clickXeroLogin() {
    await this.xeroLoginButton.click();
  }
}

module.exports = { LoginPage };
