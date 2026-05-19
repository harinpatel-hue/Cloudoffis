import { expect } from '@playwright/test';

export class Homepage {

  constructor(page) {
    this.page = page;

    // Locators
    this.loginDropdown = page.getByRole('link', { name: 'Log In' });

    // Dropdown options
    this.dropdownOptions = page
      .getByRole('list', { name: 'Log In' })
      .getByRole('link');

    this.workpapersSorted = page.getByRole('link', {
      name: 'Workpapers Sorted'
    });

    this.smsfSorted = page.getByRole('link', {
      name: 'SMSF Sorted'
    });

    this.smsfAuditomation = page.getByRole('link', {
      name: 'SMSF Auditomation'
    });

    this.productsSection = page.getByRole('link', { 
      name: 'Products' 
    });

    this.servicesSection = page.getByRole('link', { 
      name: 'Services' 
    });

    this.resourcesSection = page.getByRole('link', { 
      name: 'Resources' 
    });

    this.pricingSection = page.getByRole('link', { 
      name: 'Pricing' 
    });
  }

  // Methods
  async gotoHomepage() {
    await this.page.goto('https://cloudoffis.com.au/');
  }

  // Verification methods
  async verifyHomepage() {
    await expect(this.page).toHaveURL('https://cloudoffis.com.au/');
    await expect(this.page).toHaveTitle(
      'Your Workpaper Platform for Auditors and Accounting'
    );
  }

  // Interaction methods
  async openLoginDropdown() {
    await this.loginDropdown.click();
  }

  // Dropdown verification methods
  async verifyDropdownOptions() {
    await expect(this.dropdownOptions).toHaveCount(3);

    await expect(this.dropdownOptions).toHaveText([
      'Workpapers Sorted',
      'SMSF Sorted',
      'SMSF Auditomation'
    ]);
  }

  // Dropdown interaction methods
  async clickWorkpapersSorted() {
    await this.workpapersSorted.first().click();
  }

  async clickSMSFSorted() {
    await this.smsfSorted.first().click();
  }

  async clickSMSFAuditomation() {
    await this.smsfAuditomation.first().click();
  }

  async clickProductsSection() {
    await this.productsSection.click();
  }

  async clickServicesSection() {
    await this.servicesSection.click();
  }

  async clickResourcesSection() {
    await this.resourcesSection.click();
  }

  async clickPricingSection() {
    await this.pricingSection.click();
  }

  // Scrolling method
  async scrollPage() {
    for (let i = 0; i < 7; i++) {
      await this.page.mouse.wheel(0, 1000);
    }
  }
}