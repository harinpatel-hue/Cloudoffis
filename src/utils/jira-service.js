const https = require('https');

// Load JIRA configurations
const JIRA_HOST = process.env.JIRA_HOST;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

/**
 * Encodes JIRA credentials for Basic Authentication
 */
function getAuthHeader() {
  if (!JIRA_EMAIL || !JIRA_API_TOKEN) {
    throw new Error('JIRA_EMAIL and JIRA_API_TOKEN must be configured in environment variables.');
  }
  return 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
}

/**
 * Sends a request to the JIRA REST API
 */
function jiraRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    if (!JIRA_HOST) {
      return reject(new Error('JIRA_HOST environment variable is not defined.'));
    }

    const options = {
      hostname: JIRA_HOST,
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': getAuthHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js JIRA Service'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        let parsed = null;
        if (data) {
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            // Not JSON
            parsed = data;
          }
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(parsed);
        } else {
          reject(new Error(`JIRA request failed with status ${res.statusCode}: ${JSON.stringify(parsed || data)}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

/**
 * Searches for an existing open Bug matching the test title
 */
async function findExistingTicket(testTitle) {
  const summary = `Failed Test: ${testTitle}`;
  // JQL to search for open issues with matching summary in our project
  const jql = `project = "${JIRA_PROJECT_KEY}" AND summary ~ "${summary.replace(/"/g, '\\"')}" AND statusCategory != Done`;
  
  try {
    const response = await jiraRequest('POST', '/rest/api/3/search', {
      jql: jql,
      maxResults: 1,
      fields: ['key', 'summary', 'status']
    });
    if (response && response.issues && response.issues.length > 0) {
      return response.issues[0];
    }
    return null;
  } catch (error) {
    console.error(`Error searching JIRA ticket: ${error.message}`);
    return null;
  }
}

/**
 * Creates a new Bug ticket in JIRA for a failed test case
 */
async function createBugTicket(testTitle, errorDetails) {
  const summary = `Failed Test: ${testTitle}`;
  
  // JIRA Document Format (ADF) description for API v3
  const description = {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'This issue was automatically created by the Playwright CI/CD test suite because the following test failed.'
          }
        ]
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [
          {
            type: 'text',
            text: 'Error details:'
          }
        ]
      },
      {
        type: 'codeBlock',
        attrs: { language: 'text' },
        content: [
          {
            type: 'text',
            text: errorDetails || 'No error details provided.'
          }
        ]
      }
    ]
  };

  const body = {
    fields: {
      project: {
        key: JIRA_PROJECT_KEY
      },
      summary: summary,
      description: description,
      issuetype: {
        name: 'Bug'
      }
    }
  };

  try {
    const response = await jiraRequest('POST', '/rest/api/3/issue', body);
    console.log(`Successfully created JIRA bug ticket: ${response.key}`);
    return response;
  } catch (error) {
    console.error(`Failed to create JIRA bug: ${error.message}`);
    throw error;
  }
}

/**
 * Adds a comment to an existing ticket
 */
async function addCommentToTicket(issueKey, commentText) {
  const body = {
    body: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: commentText
            }
          ]
        }
      ]
    }
  };

  try {
    const response = await jiraRequest('POST', `/rest/api/3/issue/${issueKey}/comment`, body);
    console.log(`Successfully added comment to JIRA ticket ${issueKey}`);
    return response;
  } catch (error) {
    console.error(`Failed to add comment to JIRA ticket ${issueKey}: ${error.message}`);
    throw error;
  }
}

module.exports = {
  findExistingTicket,
  createBugTicket,
  addCommentToTicket
};
