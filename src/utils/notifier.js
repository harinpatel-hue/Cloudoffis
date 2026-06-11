const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();

const resultsPath = path.join(__dirname, '../../test-results/results.json');
const webhookUrl = process.env.SLACK_WEBHOOK_URL;

if (!webhookUrl) {
  console.log('SLACK_WEBHOOK_URL is not configured in .env. Skipping notification.');
  process.exit(0);
}

if (!fs.existsSync(resultsPath)) {
  console.error(`Test results file not found at: ${resultsPath}. Cannot send notification.`);
  process.exit(1);
}

try {
  const data = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  const stats = data.stats || {};
  
  const total = (stats.expected || 0) + (stats.unexpected || 0) + (stats.skipped || 0);
  const passed = stats.expected || 0;
  const failed = stats.unexpected || 0;
  const skipped = stats.skipped || 0;
  const flaky = stats.flaky || 0;
  const durationSec = ((stats.duration || 0) / 1000).toFixed(2);
  const env = process.env.ENV || 'qa';
  
  const isSuccess = failed === 0;
  const statusEmoji = isSuccess ? '🟢' : '🔴';
  const statusText = isSuccess ? 'PASSED' : 'FAILED';
  
  const payload = {
    text: `${statusEmoji} Playwright Test Run *${statusText}* on *${env.toUpperCase()}*`,
    attachments: [
      {
        color: isSuccess ? '#10b981' : '#f43f5e',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Environment:* ${env.toUpperCase()}\n*Duration:* ${durationSec} seconds`
            }
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*Total Tests:* ${total}` },
              { type: 'mrkdwn', text: `*Passed:* ${passed}` },
              { type: 'mrkdwn', text: `*Failed:* ${failed}` },
              { type: 'mrkdwn', text: `*Skipped:* ${skipped}` },
              { type: 'mrkdwn', text: `*Flaky:* ${flaky}` }
            ]
          }
        ]
      }
    ]
  };

  const payloadString = JSON.stringify(payload);
  const url = new URL(webhookUrl);
  
  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payloadString.length
    }
  };

  console.log(`Sending notification to Slack webhook...`);
  const req = https.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => { responseBody += chunk; });
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('Slack notification sent successfully.');
      } else {
        console.error(`Slack webhook returned status: ${res.statusCode}. Response: ${responseBody}`);
      }
    });
  });

  req.on('error', (e) => {
    console.error('Error sending Slack notification:', e.message);
  });

  req.write(payloadString);
  req.end();

} catch (error) {
  console.error('Failed to parse test results or send notification:', error.message);
  process.exit(1);
}
