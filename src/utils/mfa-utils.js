const { generateSync, createGuardrails } = require('otplib');

// The QA server clock runs 30 seconds ahead of local time.
// We add this fixed offset so our generated TOTP code matches what the server expects.
const SERVER_CLOCK_OFFSET_MS = 30 * 1000; // 30 seconds in milliseconds

function generateTotp(secret) {
  if (!secret) {
    return '';
  }

  // Remove any spaces from the secret (some secrets are formatted with spaces)
  const cleanSecret = secret.replace(/\s+/g, '');

  // Adjust local time to match the server's clock before generating the code
  const serverTimeMs = Date.now() + SERVER_CLOCK_OFFSET_MS;
  const serverTimeSec = Math.floor(serverTimeMs / 1000);

  // Generate the 6-digit TOTP code using the server-adjusted time
  const code = generateSync({
    secret: cleanSecret,
    epoch: serverTimeSec,
    guardrails: createGuardrails({ MIN_SECRET_BYTES: 4 })
  });

  console.log(`Generated TOTP: ${code}`);
  return code;
}

module.exports = { generateTotp };
