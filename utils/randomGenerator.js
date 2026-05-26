export class RandomGenerator {
  /**
   * Generates a random alphanumeric string of a given length.
   * @param {number} [length=8]
   * @returns {string}
   */
  static generateString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generates a random email address.
   * @param {string} [prefix='test']
   * @returns {string}
   */
  static generateEmail(prefix = 'test') {
    return `${prefix}_${this.generateString(6)}@cloudoffis.com.au`;
  }

  /**
   * Generates a random phone number.
   * @returns {string}
   */
  static generatePhoneNumber() {
    let num = '04'; // Common Australian mobile prefix
    for (let i = 0; i < 8; i++) {
      num += Math.floor(Math.random() * 10).toString();
    }
    return num;
  }

  /**
   * Generates a random name (e.g. for user registration).
   * @param {string} [prefix='User']
   * @returns {string}
   */
  static generateName(prefix = 'User') {
    return `${prefix}_${this.generateString(4)}`;
  }
}
