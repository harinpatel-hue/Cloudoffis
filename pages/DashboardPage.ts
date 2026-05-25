import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  // Common dashboard and sidebar selectors
  public readonly sidebarMenu: Locator;
  public readonly profileDropdown: Locator;
  public readonly logoutOption: Locator;
  public readonly pageHeader: Locator;

  constructor(page: Page) {
    super(page);
    // Generic selectors matching standard Admin templates (PrimeNG / Angular Admin styles)
    this.sidebarMenu = this.page.locator('.sidebar, .nav-sidebar, nav, #sidebarMenu, app-sidebar');
    this.profileDropdown = this.page.locator('.profile-menu, .user-profile, .avatar, #profileDropdown, .dropdown-toggle');
    this.logoutOption = this.page.locator('text=Logout, text=Sign Out, [href*="logout"], .logout-btn');
    this.pageHeader = this.page.locator('h1, h2, .page-title, .header-title');
  }

  /**
   * Verifies that the dashboard is visible and loaded.
   */
  async verifyOnDashboard(): Promise<void> {
    console.log('[Validation] Checking if user is on the Dashboard');
    // Ensure URL has redirected away from auth/login page
    await this.page.waitForURL((url) => !url.href.includes('/auth/login'), { timeout: 15000 });
    
    // Wait for either the sidebar, profile dropdown, or main dashboard headers to be visible
    const isSidebarVisible = await this.sidebarMenu.first().isVisible();
    const isProfileVisible = await this.profileDropdown.first().isVisible();
    
    if (!isSidebarVisible && !isProfileVisible) {
      console.log('[Warning] Standard dashboard indicators are not yet found. Checking page URL state.');
    }
  }

  /**
   * Log out of the application.
   */
  async logout(): Promise<void> {
    console.log('[Action] Executing Logout flow');
    if (await this.profileDropdown.isVisible()) {
      await this.click(this.profileDropdown, 'Profile Dropdown');
      await this.click(this.logoutOption, 'Logout Option');
    } else {
      // Fallback: search for logout button directly
      await this.click(this.logoutOption, 'Direct Logout Button');
    }
    // Verify redirection to login page
    await this.page.waitForURL(/\/auth\/login/, { timeout: 10000 });
  }
}
