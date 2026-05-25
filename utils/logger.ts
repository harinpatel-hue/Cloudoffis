/**
 * Lightweight logger helper with formatted console outputs.
 */
export const logger = {
  info: (msg: string) => {
    console.log(`[INFO] [${new Date().toISOString()}] - ${msg}`);
  },
  error: (msg: string, err?: any) => {
    console.error(`[ERROR] [${new Date().toISOString()}] - ${msg}`, err || '');
  },
  warn: (msg: string) => {
    console.warn(`[WARN] [${new Date().toISOString()}] - ${msg}`);
  },
  debug: (msg: string) => {
    if (process.env.DEBUG) {
      console.log(`[DEBUG] [${new Date().toISOString()}] - ${msg}`);
    }
  }
};
