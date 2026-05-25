/**
 * Helper functions for test data generation and custom timing utilities.
 */

/**
 * Generates a random alphanumeric string of a specified length.
 */
export function generateRandomString(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generates a unique email address for dynamic form input.
 */
export function generateRandomEmail(domain: string = 'cloudoffis.com.au'): string {
  const randomPart = generateRandomString(10);
  return `test-${randomPart}@${domain}`;
}

/**
 * Returns the current date formatted as YYYY-MM-DD.
 */
export function getFormattedCurrentDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Custom promise-based delay helper (useful for debugging animations/race conditions).
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
