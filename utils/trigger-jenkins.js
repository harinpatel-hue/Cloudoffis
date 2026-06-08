const http = require('http');

// Configs for Jenkins
const JENKINS_URL = 'http://localhost:8080';
const JOB_NAME = 'cloudoffis-playwright-tests';
const USERNAME = 'harinpatel';
// Generate this token from Jenkins: click your username -> Configure -> API Token -> Add new Token
const API_TOKEN = process.env.JENKINS_API_TOKEN || 'Harin123@'; // Can fall back to password or a generated API token

const env = process.argv[2] || 'qa';
const testType = process.argv[3] || 'smoke';

const url = `${JENKINS_URL}/job/${JOB_NAME}/buildWithParameters?ENV=${env}&TEST_TYPE=${testType}`;

console.log(`Triggering Jenkins build for job '${JOB_NAME}' on ${JENKINS_URL}...`);
console.log(`Parameters: ENV=${env}, TEST_TYPE=${testType}`);

const auth = Buffer.from(`${USERNAME}:${API_TOKEN}`).toString('base64');

const req = http.request(url, {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${auth}`
  }
}, (res) => {
  if (res.statusCode === 201 || res.statusCode === 200 || res.statusCode === 302) {
    console.log('Successfully triggered Jenkins pipeline build!');
  } else {
    console.error(`Failed to trigger build. Status code: ${res.statusCode}`);
    res.resume();
  }
});

req.on('error', (err) => {
  console.error('Error triggering Jenkins build:', err.message);
});

req.end();
