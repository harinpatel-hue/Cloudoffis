# Cloudoffis Playwright Test Automation Framework

A modern, robust, and clean boilerplate for Web and API automation testing using Playwright, JavaScript, and Allure Reporting.

---

## 🚀 Features

* **Dependency-Injected Fixtures**: Native Playwright custom fixtures (`loginPage`, `clientsPage`, `apiUtils`) eliminating manual instantiation boilerplates.
* **Semantic User-Facing Locators**: Selectors written from the user's perspective (`getByRole()`, `getByLabel()`, `getByPlaceholder()`) with stable fallbacks.
* **Dynamic Wait Execution**: Brittle sleep timers (`waitForTimeout`) replaced with dynamic API response triggers (`waitForResponse`) and auto-waiting assertions.
* **Multi-Environment Support**: Seamlessly run tests against **QA**, **Preprod**, **Prod**, or **BU** (Business Unit) environments using env variables.
* **Automated MFA (TOTP)**: Real-time calculation of 6-digit Multi-Factor Authentication codes via the `otplib` algorithm for fully unattended login automation.
* **Project-Based Test Suites**: Structured execution scopes (`all-tests`, `smoke-suite`, `regression-suite`, `ui-suite`, `api-suite`) configured inside `playwright.config.js`.
* **CI/CD Integration**: Out-of-the-box support with pre-configured GitHub Actions (`.github/workflows/playwright.yml`) and local Jenkins (`Jenkinsfile`).
* **Aesthetic Versioned Reports**: Generates Playwright HTML reports and advanced Allure dashboards automatically injected with active environment and framework version metadata.

---

## 📂 Project Structure

```text
├── config/                             # Environment and endpoint configurations
│   ├── qa.env.js
│   ├── dev.env.js
│   ├── staging.env.js
│   ├── prod.env.js
│   ├── bu.env.js
│   ├── env-config.js                  # Dynamic config/base URL loader
│   └── api-routes.js                  # Centralized API endpoints routes
├── pages/                              # Page Object Models (POM)
│   ├── LoginPage.js
│   └── ClientsPage.js
├── tests/                              # Structured test suites
│   ├── setup/
│   │   └─ auth.setup.js               # Global authenticated session setup
│   ├── api/
│   │   └─ users.spec.js               # Consolidated User API tests (GET & POST)
│   ├── smoke/
│   │   └── auth/
│   │       └─ login-screen.spec.js    # UI Smoke tests
│   ├── regression/                    # UI Regression tests (grouped by module)
│   │   ├── clients/
│   │   │   └─ client-list.spec.js
│   │   └── xero/
│   │       ├─ xero-consent.spec.js
│   │       ├─ xero-mfa.spec.js
│   │       ├─ xero-portal.spec.js
│   │       └─ xero-trust-device.spec.js
│   └── e2e/
│       └─ placeholder.spec.js         # End-to-End integration scenarios
├── utils/                              # Utilities and custom reporters
│   ├── api-utils.js                   # API request wrapper helper class
│   ├── fixtures.js                    # Custom Playwright fixtures (POM & API injection)
│   ├── mfa-utils.js                   # TOTP passcode generator
│   ├── notifier.js                    # Google Chat custom reporter notifications
│   ├── trigger-jenkins.js             # HTTP helper to invoke Jenkins builds
│   └── generate-allure.js             # Metadata injector for Allure report
├── Jenkinsfile                         # Jenkins build pipeline script
├── package.json                        # Project dependencies, scripts, and metadata
├── playwright.config.js                # Main test runner config (with versioning metadata)
└── .env.example                        # Environment variables credential template
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
* **Run API Suite**:
  ```bash
  ENV=qa npm run test:api
  ```
* **Run All Tests**:
  ```bash
  ENV=qa npm run test
  ```

### 2. Targeting Specific Environments
Pass the `ENV` variable (`qa`, `dev`, `staging`, `prod`, `bu`) at execution time:
```bash
ENV=staging npm run test:smoke
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
