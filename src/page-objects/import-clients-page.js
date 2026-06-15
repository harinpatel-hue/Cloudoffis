const { expect } = require('@playwright/test');
const { generateTotp } = require('../utils/mfa-utils');

class ImportClientsPage {
  constructor(page) {
    this.page = page;

    this.availableClientsTitle = page.getByText(/XPM Client\(s\)/);
    this.selectedClientsTitle = page.getByText(/Selected Client\(s\)/);
    this.availableClientsSearch = page.getByRole('textbox', { name: 'Search' }).first();
    this.selectedClientsSearch = page.getByRole('textbox', { name: 'Search' }).nth(1);
    this.addClientsButton = page.getByRole('button', { name: 'Add Client(s)' });
    this.backButton = page.getByRole('button', { name: 'Back' });
    this.allowAccessButton = page.getByRole('button', { name: 'Allow access' });
    this.noSelectedClientsMessage = page.getByText('No Client(s) Selected', { exact: true });

    this.xeroEmailInput = page.getByRole('textbox', { name: 'Email address' });
    this.xeroPasswordInput = page.getByRole('textbox', { name: 'Password' });
    this.xeroLoginButton = page.getByRole('button', { name: 'Log in' });
    this.xeroMfaInput = page.getByRole('textbox', { name: 'Authentication code' });
    this.xeroMfaConfirmButton = page.getByRole('button', { name: 'Confirm' });
  }

  async navigate() {
    await this.page.goto('/import-clients');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/import-clients/);
    await expect(this.availableClientsTitle).toBeVisible();
    await expect(this.selectedClientsTitle).toBeVisible();
  }

  async expectNoSelectedClients() {
    await expect(this.noSelectedClientsMessage).toBeVisible();
    await expect(this.addClientsButton).toBeDisabled();
  }

  async searchAvailableClient(clientName) {
    await this.availableClientsSearch.fill(clientName);
  }

  getAvailableClientRow(clientName) {
    return this.page.locator('tr').filter({ hasText: clientName }).first();
  }

  async selectAvailableClient(clientName) {
    await this.getAvailableClientRow(clientName).click();
  }

  async addSelectedClients() {
    await expect(this.addClientsButton).toBeEnabled();
    await this.addClientsButton.click();
  }

  async completeXeroLoginIfRequired() {
    const email = process.env.XERO_EMAIL || process.env.XERO_USERNAME;
    const password = process.env.XERO_PASSWORD;
    const totpSecret = process.env.XERO_TOTP_SECRET;

    if (await this.xeroEmailInput.isVisible({ timeout: 10000 }).catch(() => false)) {
      if (!email || !password) {
        throw new Error('XERO_EMAIL/XERO_USERNAME and XERO_PASSWORD must be configured in .env.');
      }

      await this.xeroEmailInput.fill(email);
      await this.xeroPasswordInput.fill(password);
      await this.xeroLoginButton.click();
    }

    if (await this.xeroMfaInput.isVisible({ timeout: 15000 }).catch(() => false)) {
      if (!totpSecret) {
        throw new Error('XERO_TOTP_SECRET must be configured in .env when Xero MFA is shown.');
      }

      await this.xeroMfaInput.fill(generateTotp(totpSecret));
      await this.xeroMfaConfirmButton.click();
    }

    if (await this.allowAccessButton.isVisible({ timeout: 30000 }).catch(() => false)) {
      await this.allowAccessButton.click();
    }
  }

  async expectRedirectedToXero() {
    await expect(this.page).toHaveURL(/xero|authorize\.xero\.com/);
  }
}

module.exports = { ImportClientsPage };
