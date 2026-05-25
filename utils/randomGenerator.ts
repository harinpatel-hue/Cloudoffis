export class RandomGenerator {
  /**
   * Generates a random alphanumeric string of a given length.
   */
  static generateString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generates a random email address.
   */
  static generateEmail(prefix: string = 'test'): string {
    return `${prefix}_${this.generateString(6)}@cloudoffis.com.au`;
  }

  /**
   * Generates a random phone number.
   */
  static generatePhoneNumber(): string {
    let num = '04'; // Common Australian mobile prefix
    for (let i = 0; i < 8; i++) {
      num += Math.floor(Math.random() * 10).toString();
    }
    return num;
  }

  /**
   * Generates a random name (e.g. for user registration).
   */
  static generateName(prefix: string = 'User'): string {
    return `${prefix}_${this.generateString(4)}`;
  }
}
