const qaUrl = 'https://qa-workpapers.cloudoffis.com.au/auth/login';
const preprodUrl = 'https://preprod-workpapers.cloudoffis.com.au/auth/login';
const prodUrl = 'https://workpapers.cloudoffis.com.au/auth/login';
const buUrl = 'https://bu-workpapers.cloudoffis.com.au/auth/login';

function getBaseUrl() {
  const env = process.env.ENV;
  if (env === 'preprod') {
    return preprodUrl;
  }
  if (env === 'prod') {
    return prodUrl;
  }
  if (env === 'bu') {
    return buUrl;
  }
  return qaUrl; // default environment
}

module.exports = { getBaseUrl };
