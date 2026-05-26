/**
 * Helper functions for test data generation and custom timing utilities.
 */

/**
 * Generates a random alphanumeric string of a specified length.
 * @param {number} [length=8]
 * @returns {string}
 */
export function generateRandomString(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generates a unique email address for dynamic form input.
 * @param {string} [domain='cloudoffis.com.au']
 * @returns {string}
 */
export function generateRandomEmail(domain = 'cloudoffis.com.au') {
  const randomPart = generateRandomString(10);
  return `test-${randomPart}@${domain}`;
}

/**
 * Returns the current date formatted as YYYY-MM-DD.
 * @returns {string}
 */
export function getFormattedCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Custom promise-based delay helper (useful for debugging animations/race conditions).
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
