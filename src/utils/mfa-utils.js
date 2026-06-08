const { generateSync, createGuardrails } = require('otplib');

function generateTotp(secret) {
  if (!secret) {
    return '';
  }
  const cleanSecret = secret.replace(/\s+/g, '');
  // Google Authenticator secrets are often shorter than otplib's default 16-byte limit.
  // We configure a guardrail override to support base32 secrets of any length (e.g. 10 bytes).
  return generateSync({
    secret: cleanSecret,
    guardrails: createGuardrails({ MIN_SECRET_BYTES: 4 })
  });
}

module.exports = { generateTotp };
