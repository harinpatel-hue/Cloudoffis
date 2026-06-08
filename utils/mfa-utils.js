const { authenticator } = require('otplib');

function generateTotp(secret) {
  if (!secret) {
    return '';
  }
  const cleanSecret = secret.replace(/\s+/g, '');
  return authenticator.generate(cleanSecret);
}

module.exports = { generateTotp };
