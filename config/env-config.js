const path = require('path');

function getBaseUrl() {
  const env = process.env.ENV || 'qa';
  let targetEnv = env;
  if (env === 'preprod') {
    targetEnv = 'staging';
  }
  
  try {
    const configPath = path.resolve(__dirname, `./${targetEnv}.env.js`);
    const config = require(configPath);
    return config.baseUrl;
  } catch (error) {
    console.warn(`Could not load configuration for environment "${env}". Falling back to QA.`);
    return 'https://qa-workpapers.cloudoffis.com.au/auth/login';
  }
}

module.exports = { getBaseUrl };
