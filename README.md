# Playwright Test Automation Framework

A modern, robust, and clean boilerplate for Web and API automation testing using Playwright, JavaScript, and Allure Reporting.

## Features

- **Multi-Environment Support**: Seamlessly run tests against **QA**, **Preprod**, **Prod**, or **BU** (Business Unit) environments using env variables.
- **Categorized Test Suites**: Organized directories and tagging conventions to support **Smoke**, **Regression**, **UI**, and **API** tests.
- **Automated MFA (TOTP)**: Built-in support for Multi-Factor Authentication (MFA) using dynamic TOTP generation via the `otplib` library.
- **CI/CD Integration**: Out-of-the-box support with pre-configured GitHub Actions (`.github/workflows/playwright.yml`) and CircleCI (`.circleci/config.yml`) allowing dynamic environment and test type inputs.
- **AWS CI/CD Ready**: Includes `buildspec.yml` configuration for running tests in **AWS CodeBuild**.
- **Jenkins Integration**: Out-of-the-box support with a declarative `Jenkinsfile` for parameterized execution pipelines.
- **Reporting**: Pre-configured Playwright HTML reports and advanced third-party reporting using **Allure Report**.

## Project Structure

```text
├── .circleci/
│   └── config.yml               # CircleCI configuration
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions workflow (dispatch-ready & AWS OIDC supported)
├── config/
│   ├── env-config.js            # Environment URLs and dynamic credential loading
│   └── api-routes.js            # Centralized API endpoints routes
├── page-objects/                # Page Object Model classes
│   └── login-page.js            # LoginPage with credentials & MFA handling
├── test-data/                   # Test data files
│   └── api-payloads/            # Request payloads for API testing
│       └── user-payload.json
├── tests/                       # Test suites
│   ├── ui/                      # UI tests (e.g., login.spec.js)
│   └── api/                     # API tests (e.g., users.spec.js)
├── utils/                       # Common utilities
│   ├── common-utils.js          # Shared helper methods
│   ├── api-utils.js             # API request builder helper class
│   └── mfa-utils.js             # Dynamic TOTP generation helper
├── .env.example                 # Environment variables template file
├── .env                         # Active local environment variables file
├── buildspec.yml                # AWS CodeBuild configuration file
├── Jenkinsfile                  # Jenkins pipeline configuration file
├── package.json                 # Dependencies and execution scripts
└── playwright.config.js         # Playwright config (dotenv, baseURL & Allure integration)
```

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v14 or above recommended).

### Installation

Install the project dependencies and Playwright browser binaries:

```bash
npm install
npx playwright install
```

## Configuration

Duplicate `.env.example` as `.env` and configure your credentials and TOTP secrets:

```bash
ENV=qa # qa, preprod, prod, bu
NORMAL_USERNAME=your_username
NORMAL_PASSWORD=your_password
NORMAL_TOTP_SECRET=your_totp_secret
```

## Running Tests

### By Test Type / Tags

- **Run Smoke Tests**:
  ```bash
  ENV=qa npm run test:smoke
  ```

- **Run Regression Tests**:
  ```bash
  ENV=qa npm run test:regression
  ```

- **Run UI Tests**:
  ```bash
  ENV=qa npm run test:ui
  ```

- **Run API Tests**:
  ```bash
  ENV=qa npm run test:api
  ```

### By Environment

Switch the target environment by passing the `ENV` variable (`qa`, `preprod`, `prod`, `bu`):

```bash
ENV=preprod npm run test:smoke
ENV=prod npm run test:regression
```

---

## Allure Reporting

Generate and view Allure Reports after test execution:

1. **Generate Report**:
   ```bash
   npm run allure:generate
   ```

2. **Serve Report Locally (recommended)**:
   ```bash
   npm run allure:serve
   ```

3. **Open Generated Report**:
   ```bash
   npm run allure:open
   ```

---

## AWS Integration

### Running in AWS CodeBuild
The repository includes a `buildspec.yml` file to run your tests inside AWS CodePipeline/CodeBuild.
1. Create a CodeBuild project in AWS Console.
2. Select Node.js environment image.
3. Configure the environment variable `ENV` (e.g. `qa`, `preprod`, `prod`, `bu`). CodeBuild will execute `buildspec.yml` and produce execution reports.

### Static Report Hosting on S3
To easily share reports (Playwright HTML or Allure HTML) with your team:
1. Create an S3 Bucket (e.g. `cloudoffis-test-reports`).
2. Enable **Static Website Hosting** on the bucket.
3. Configure your CI/CD pipeline to copy the folder `playwright-report/` or `allure-report/` to the S3 bucket:
   ```bash
   aws s3 sync allure-report/ s3://cloudoffis-test-reports/latest --delete
   ```

---

## Jenkins Integration

The repository includes a declarative `Jenkinsfile` for orchestrating test execution pipelines in Jenkins.

### 1. Prerequisites (Required Jenkins Plugins)
Make sure the following plugins are installed on your Jenkins instance:
- **NodeJS Plugin** (to automatically manage node environments)
- **HTML Publisher Plugin** (to host and view the Playwright HTML Report)
- **Allure Jenkins Plugin** (to compile and view Allure Reports)

### 2. Global Tool Configuration
1. Navigate to **Manage Jenkins** -> **Global Tool Configuration**.
2. Find the **NodeJS** section, click **Add NodeJS**.
3. Name it **`node`** (matching the name in the `Jenkinsfile`).
4. Select **Install automatically** and choose a stable version (e.g. `NodeJS 18+`).

### 3. Pipeline Setup
1. Create a new **Pipeline** job in Jenkins.
2. Under the **Pipeline** section, choose **Pipeline script from SCM**.
3. Select **Git** and enter your repository URL.
4. Set the script path to **`Jenkinsfile`**.
5. Save the job and click **Build Now** once to register parameters. Subsequent builds will show the **Build with Parameters** option allowing environment and test type selections.
