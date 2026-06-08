const fs = require('fs');
const path = require('path');
require('dotenv').config();

const jiraService = require('./jira-service');

const RESULTS_PATH = path.join(__dirname, '..', '..', 'test-results', 'results.json');

// Check if JIRA is enabled/configured
const isJiraConfigured = process.env.JIRA_HOST && 
                        process.env.JIRA_PROJECT_KEY && 
                        process.env.JIRA_EMAIL && 
                        process.env.JIRA_API_TOKEN;

if (!isJiraConfigured) {
  console.log('JIRA configuration is incomplete or missing. Skipping JIRA ticket reporting.');
  process.exit(0);
}

/**
 * Recursively extracts failed tests from the Playwright JSON report structure
 */
function extractFailedTests(suite, failedList = []) {
  if (suite.specs) {
    for (const spec of suite.specs) {
      if (spec.tests) {
        for (const test of spec.tests) {
          // If the test outcome is unexpected (e.g., failed)
          const result = test.results && test.results[0];
          const isFailed = result && result.status !== 'passed' && result.status !== 'skipped';
          if (isFailed) {
            const title = spec.titlePath ? spec.titlePath.join(' > ') : spec.title;
            
            // Collect errors
            let errorText = '';
            if (result.errors && result.errors.length > 0) {
              errorText = result.errors.map(err => err.message).join('\n\n');
            } else if (result.error) {
              errorText = result.error.message;
            }
            
            failedList.push({
              title: title,
              error: errorText,
              duration: result.duration
            });
          }
        }
      }
    }
  }

  if (suite.suites) {
    for (const childSuite of suite.suites) {
      extractFailedTests(childSuite, failedList);
    }
  }

  return failedList;
}

async function processFailures() {
  console.log(`Reading Playwright results from: ${RESULTS_PATH}`);
  
  if (!fs.existsSync(RESULTS_PATH)) {
    console.warn(`Test results file not found at ${RESULTS_PATH}. Make sure tests ran and output is configured.`);
    return;
  }

  let reportData;
  try {
    const rawContent = fs.readFileSync(RESULTS_PATH, 'utf8');
    reportData = JSON.parse(rawContent);
  } catch (e) {
    console.error(`Error parsing test results JSON: ${e.message}`);
    return;
  }

  // Extract failures
  const failedTests = [];
  if (reportData.suites) {
    for (const suite of reportData.suites) {
      extractFailedTests(suite, failedTests);
    }
  }

  console.log(`Found ${failedTests.length} failed tests.`);

  if (failedTests.length === 0) {
    console.log('All tests passed! No JIRA updates required.');
    return;
  }

  for (const failed of failedTests) {
    console.log(`Processing JIRA ticket for: "${failed.title}"`);
    try {
      // 1. Search for existing ticket
      const existingTicket = await jiraService.findExistingTicket(failed.title);
      
      if (existingTicket) {
        // 2. Add comment if it already exists
        const issueKey = existingTicket.key;
        const comment = `Test failed again in the latest CI/CD pipeline run.\n\nError details:\n${failed.error}`;
        console.log(`Ticket already exists (${issueKey}). Adding update comment...`);
        await jiraService.addCommentToTicket(issueKey, comment);
      } else {
        // 3. Create a new bug if it doesn't exist
        console.log('No existing ticket found. Creating a new JIRA Bug...');
        await jiraService.createBugTicket(failed.title, failed.error);
      }
    } catch (err) {
      console.error(`Failed to process JIRA integration for "${failed.title}": ${err.message}`);
    }
  }
}

processFailures().then(() => {
  console.log('JIRA reporting completed.');
}).catch((err) => {
  console.error('Fatal error in JIRA reporting script:', err);
});
