const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const resultsDir = path.join(__dirname, '../allure-results');
const reportDir = path.join(__dirname, '../allure-report');

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

console.log('--- Preserving Allure Report History ---');
const sourceHistory = path.join(reportDir, 'history');
const destHistory = path.join(resultsDir, 'history');

if (fs.existsSync(sourceHistory)) {
  console.log(`Copying history from ${sourceHistory} to ${destHistory}...`);
  try {
    copyFolderSync(sourceHistory, destHistory);
    console.log('Allure history copied successfully.');
  } catch (error) {
    console.warn('Failed to copy Allure history:', error.message);
  }
} else {
  console.log('No previous Allure history found. Starting new trend line.');
}

console.log('Generating Allure report...');
try {
  execSync('npx allure generate allure-results --clean', { stdio: 'inherit' });
  console.log('Allure report generated successfully.');
} catch (error) {
  console.error('Error generating Allure report:', error.message);
  process.exit(1);
}
