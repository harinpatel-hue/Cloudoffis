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
        // Set up promise to wait for the clients API request to complete
        const responsePromise = this.page.waitForResponse(
            response => response.url().includes('/api/v1/clients') && response.status() === 200,
            { timeout: 5000 }
        ).catch(() => {}); // Catch timeout to prevent test crash if search is local/cached

        await this.clientSearchBox.fill(name);
        await responsePromise;
    }

    async verifyClientIsVisible(name) {
        await expect(this.clientTableRows.filter({ hasText: name }).first()).toBeVisible();
    }

    async verifyVisualLayout(screenshotName) {
        await expect(this.page).toHaveScreenshot(screenshotName, {
            maxDiffPixelRatio: 0.05,
            animations: 'allow'
        });
    }
}

module.exports = { ClientsPage };
