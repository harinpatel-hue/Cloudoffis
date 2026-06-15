# Cloudoffis Playwright Test Automation Framework

A modern, robust, and clean boilerplate for Web and API automation testing using Playwright, JavaScript, and Allure Reporting.

---

## 🚀 Features

* **Multi-Environment Support**: Seamlessly run tests against **QA**, **Preprod**, **Prod**, or **BU** (Business Unit) environments using env variables.
* **Modular Page Object Model (POM)**: Separates functional page actions and selectors from executable test assertions.
* **Automated MFA (TOTP)**: Real-time calculation of 6-digit Multi-Factor Authentication codes via the `otplib` algorithm for fully unattended login automation.
* **Project-Based Test Suites**: Structured execution scopes (`all-tests`, `smoke-suite`, `regression-suite`, `ui-suite`, `api-suite`) configured inside `playwright.config.js`.
* **CI/CD Integration**: Out-of-the-box support with pre-configured GitHub Actions (`.github/workflows/playwright.yml`) and local Jenkins (`Jenkinsfile`).
* **Aesthetic Versioned Reports**: Generates Playwright HTML reports and advanced Allure dashboards automatically injected with active environment and framework version metadata.

---

## 📂 Project Structure

```text
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions workflow (dispatch-ready)
├── .vscode/
│   ├── settings.json            # VS Code sidebar filters to hide build noise
│   └── tasks.json               # IDE custom tasks to trigger Jenkins builds
├── src/                         # Framework Core Source
│   ├── config/
│   │   ├── env-config.js        # Environment URLs and dynamic credentials
│   │   └── api-routes.js        # Centralized API endpoints routes
│   ├── page-objects/
│   │   ├── import-clients-page.js # Import Clients screen actions and assertions
│   │   └── login-page.js        # POM page for credentials & MFA handling
│   ├── test-data/
│   │   └── api-payloads/        # Mock payloads for API requests
│   │       └── user-payload.json
│   └── utils/
│       ├── api-utils.js         # API request wrapper helper class
│       ├── common-utils.js      # Shared helper methods
│       ├── mfa-utils.js         # TOTP passcode generator
│       └── trigger-jenkins.js   # HTTP helper to invoke Jenkins builds
├── tests/                       # Test Suites
│   ├── ui/                      # Browser UI Automation Tests
│   │   ├── auth/                # MFA login and authentication tests
│   │   │   └── login.spec.js
│   │   ├── client-list/         # Client table search & filter tests
│   │   │   └── client-list.spec.js
│   │   ├── create-job/          # Client audit job creation tests
│   │   │   └── create-job.spec.js
│   │   ├── import-clients/      # Client CSV import validations
│   │   │   └── import-clients.spec.js
│   │   ├── ledger-connection/   # Xero ledger connections & sync tests
│   │   │   └── ledger-connection.spec.js
│   │   └── workpapers/          # Audit workpapers CRUD tests
│   │       └── workpapers.spec.js
│   └── api/                     # Backend Integration API Tests
│       ├── auth/                # JWT Token API validation
│       │   └── token.spec.js
│       └── users/               # Profile and listing endpoints tests
│           └── users.spec.js
├── Jenkinsfile                  # Jenkins build pipeline script
├── package.json                 # Project dependencies, scripts, and metadata
├── playwright.config.js         # Main test runner config (with versioning metadata)
└── .env.example                 # Environment variables credential template
```

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18 or above recommended).

### 2. Installation
Install the project dependencies and Playwright browser binaries:
```bash
npm install
npx playwright install --with-deps
```

### 3. Environment Configuration
Duplicate `.env.example` as `.env` and configure your target environments and credentials:
```ini
ENV=qa # qa, preprod, prod, bu
NORMAL_USERNAME=your_username
NORMAL_PASSWORD=your_password
NORMAL_TOTP_SECRET=your_totp_secret
XERO_EMAIL=your_xero_email
XERO_PASSWORD=your_xero_password
XERO_TOTP_SECRET=your_xero_totp_secret
```

---

## 🏃 Running Tests

### 1. By Suite Projects (Recommended)

* **Run Smoke Suite**:
  ```bash
  ENV=qa npm run test:smoke
  ```
* **Run Regression Suite**:
  ```bash
  ENV=qa npm run test:regression
  ```
* **Run UI Suite**:
  ```bash
  ENV=qa npm run test:ui
  ```
* **Run Import Clients Suite**:
  ```bash
  ENV=qa npm run test:import-clients
  ```
* **Run API Suite**:
  ```bash
  ENV=qa npm run test:api
  ```
* **Run All Tests**:
  ```bash
  ENV=qa npm run test
  ```

### 2. Targeting Specific Environments
Pass the `ENV` variable (`qa`, `preprod`, `prod`, `bu`) at execution time:
```bash
ENV=preprod npm run test:smoke
ENV=prod npm run test:regression
```

---

## 📊 Allure & Playwright Reports

### 1. Open Playwright HTML Report
```bash
npm run show-report
```

### 2. Open Allure Dashboard
Generate and serve the dashboard locally to see environment properties and version history:
```bash
npm run allure:serve
```

---

## 🚀 Jenkins Integration

The repository includes a declarative `Jenkinsfile` for orchestrating test execution pipelines.

### Setup
1. Create a **Pipeline** job in Jenkins.
2. Select **Pipeline script from SCM** under the pipeline section.
3. Configure Git, enter your repository URL, and set the script path to `Jenkinsfile`.
4. Trigger the build. Jenkins will load the configuration, letting you select the target environment and test suite parameters for all future runs.
