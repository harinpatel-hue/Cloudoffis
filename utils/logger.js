/**
 * Lightweight logger helper with formatted console outputs.
 */
export const logger = {
  /**
   * @param {string} msg
   */
  info: (msg) => {
    console.log(`[INFO] [${new Date().toISOString()}] - ${msg}`);
  },
  /**
   * @param {string} msg
   * @param {any} [err]
   */
  error: (msg, err) => {
    console.error(`[ERROR] [${new Date().toISOString()}] - ${msg}`, err || '');
  },
  /**
   * @param {string} msg
   */
  warn: (msg) => {
    console.warn(`[WARN] [${new Date().toISOString()}] - ${msg}`);
  },
  /**
   * @param {string} msg
   */
  debug: (msg) => {
    if (process.env.DEBUG) {
      console.log(`[DEBUG] [${new Date().toISOString()}] - ${msg}`);
    }
  }
};
