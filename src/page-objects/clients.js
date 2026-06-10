const { expect } = require('@playwright/test');

class ClientsPage {
    constructor(page) {
        this.page = page;

        // Locators
        this.clientSearchBox = page.getByPlaceholder('Search');
        this.clientTableHeader = page.locator('.ag-header-cell');
        this.clientTableRows = page.locator('.ag-row');
    }

    async navigate() {
        await this.page.goto('/client-list');
    }

    async searchClient(name) {
        await this.clientSearchBox.fill(name);
    }

    async verifyClientIsVisible(name) {
        await expect(this.clientTableRows.filter({ hasText: name }).first()).toBeVisible();
    }
}

module.exports = { ClientsPage };
