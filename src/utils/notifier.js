const https = require('https');
require('dotenv').config();

class GoogleChatReporter {
  constructor() {
    this.suite = null;
    this.startTime = Date.now();
  }

  onBegin(config, suite) {
    this.suite = suite;
    this.startTime = Date.now();
  }

  async onEnd(result) {
    const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL;
    if (!webhookUrl) {
      console.log('GOOGLE_CHAT_WEBHOOK_URL is not configured in .env. Skipping Google Chat notification.');
      return;
    }

    if (!this.suite) {
      console.error('No test suite found. Skipping Google Chat notification.');
      return;
    }

    try {
      const allTests = this.suite.allTests();
      let passed = 0;
      let failed = 0;
      let skipped = 0;
      let flaky = 0;

      for (const test of allTests) {
        const outcome = test.outcome();
        if (outcome === 'expected') {
          passed++;
        } else if (outcome === 'unexpected') {
          failed++;
        } else if (outcome === 'skipped') {
          skipped++;
        } else if (outcome === 'flaky') {
          flaky++;
        }
      }

      const total = passed + failed + skipped + flaky;
      const durationSec = ((Date.now() - this.startTime) / 1000).toFixed(2);
      const env = (process.env.ENV || 'qa').toUpperCase();
      
      const isSuccess = result.status === 'passed';
      const statusEmoji = isSuccess ? '🟢' : '🔴';
      const statusText = isSuccess ? 'PASSED' : 'FAILED';

      const payload = {
        cardsV2: [
          {
            cardId: 'playwrightTestRun',
            card: {
              header: {
                title: `Playwright Test Run — ${statusText}`,
                subtitle: `Environment: ${env}`,
                imageUrl: isSuccess 
                  ? 'https://raw.githubusercontent.com/google/material-design-icons/master/png/action/check_circle/materialiconspng/48dp/2x/baseline_check_circle_green_48dp.png'
                  : 'https://raw.githubusercontent.com/google/material-design-icons/master/png/alert/error/materialiconspng/48dp/2x/baseline_error_red_48dp.png',
                imageType: 'CIRCLE'
              },
              sections: [
                {
                  header: 'Execution Details',
                  widgets: [
                    {
                      decoratedText: {
                        topLabel: 'Status',
                        text: `<b>${statusEmoji} ${statusText}</b>`
                      }
                    },
                    {
                      decoratedText: {
                        topLabel: 'Duration',
                        text: `<b>${durationSec} seconds</b>`
                      }
                    }
                  ]
                },
                {
                  header: 'Test Summary Statistics',
                  widgets: [
                    {
                      textParagraph: {
                        text: `🟢 <b>Passed:</b> ${passed}<br>` +
                              `🔴 <b>Failed:</b> ${failed}<br>` +
                              `🟡 <b>Skipped:</b> ${skipped}<br>` +
                              `🟠 <b>Flaky:</b> ${flaky}<br>` +
                              `📊 <b>Total:</b> ${total}`
                      }
                    }
                  ]
                }
              ]
            }
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
          'Content-Length': Buffer.byteLength(payloadString, 'utf-8')
        }
      };

      console.log('Sending notification to Google Chat...');
      
      await new Promise((resolve) => {
        const req = https.request(options, (res) => {
          let responseBody = '';
          res.on('data', (chunk) => { responseBody += chunk; });
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              console.log('Google Chat notification sent successfully.');
            } else {
              console.error(`Google Chat webhook returned status: ${res.statusCode}. Response: ${responseBody}`);
            }
            resolve();
          });
        });

        req.on('error', (e) => {
          console.error('Error sending notification to Google Chat:', e.message);
          resolve();
        });

        req.write(payloadString);
        req.end();
      });

    } catch (error) {
      console.error('Failed to process test results or send notification:', error.message);
    }
  }
}

module.exports = GoogleChatReporter;
