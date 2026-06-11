// @ts-check
const { devices } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const packageJson = require('./package.json');

// Read environment variables from .env file
require('dotenv').config();
const { getBaseUrl } = require('./src/config/env-config');
const baseUrl = getBaseUrl();
const env = process.env.ENV || 'qa';
const authFile = `playwright/.auth/workpapers-${env}.json`;

console.log('Running tests against base URL: ' + baseUrl);

// Write environment details for Allure Report
try {
    const allureResultsDir = path.join(__dirname, 'allure-results');
    if (!fs.existsSync(allureResultsDir)) {
        fs.mkdirSync(allureResultsDir, { recursive: true });
    }
    const envProps = `Framework-Version=${packageJson.version}\nEnvironment=${process.env.ENV || 'qa'}\nBrowser=Firefox\n`;
    fs.writeFileSync(path.join(allureResultsDir, 'environment.properties'), envProps);
} catch (e) {
    console.warn('Could not write Allure environment properties:', e instanceof Error ? e.message : String(e));
}


/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
    metadata: {
        'Framework Version': packageJson.version,
        'Environment': process.env.ENV || 'qa',
    },

    /* This is the location where all test cases are present. */
    testDir: './tests',

    /* Maximum time one test can run for. */
    timeout: 60 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 5000
    },
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,

    /* Retry on CI only */
    //retries: process.env.CI ? 2 : 0,
    retries: 1, //Failed test case will retry for 1 time


    /* Opt out of parallel tests on CI. */
    //workers: process.env.CI ? 1 : undefined,
    /* This will start 10 instances will start parallely of any browser */
    workers: 7, // Default is 5 


    reporter: [
        ['list'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['allure-playwright', { detail: true, outputFolder: 'allure-results' }]
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {

        /* This is for handling SSL certificates */
        //  ignoreHTTPSErrors:true,

        /* This is to set the permissions */
        // geolocation -> For Location
        // permissions:['geolocation'],

        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: baseUrl,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        //trace: 'on-first-retry',
        //trace: 'on',
        trace: 'retain-on-failure',
        //trace:'on-first-retry',
        //trace:'off'

        /* This can change the mode of Execution - Headless/Headed*/
        //headless:true // Headless
        //headless:false // Headed

        /* This is for the screenshots (will be attached in the Reports) */
        screenshot: 'on',

        /* This is for recording the videos */
        video: 'on',
        //video:'retry-with-video',

    },

    /* Configure projects for major browsers and test suites */
    projects: [
        {
            name: 'setup',
            testMatch: /workpapers\.setup\.js/,
            use: {
                ...devices['Desktop Firefox'],
            },
        },
        {
            name: 'all-tests',
            use: {
                ...devices['Desktop Firefox'],
                storageState: authFile,
            },
            dependencies: ['setup'],
        },
        {
            name: 'smoke-suite',
            use: {
                ...devices['Desktop Firefox'],
                storageState: authFile,
            },
            dependencies: ['setup'],
            grep: /@smoke/,
        },
        {
            name: 'regression-suite',
            use: {
                ...devices['Desktop Firefox'],
                storageState: authFile,
            },
            dependencies: ['setup'],
            grep: /@regression/,
        },
        {
            name: 'ui-suite',
            use: {
                ...devices['Desktop Firefox'],
                storageState: authFile,
            },
            dependencies: ['setup'],
            grep: /@ui/,
        },
        {
            name: 'api-suite',
            use: {
                ...devices['Desktop Firefox'],
                storageState: authFile,
            },
            dependencies: ['setup'],
            grep: /@api/,
        },
    ],

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    // outputDir: 'test-results/',

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   port: 3000,
    // },
};

module.exports = config;
