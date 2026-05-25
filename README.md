# Cloudoffis Playwright Test Automation Framework

This repository contains the systematic end-to-end test automation suite for Cloudoffis QA Workpapers, built using TypeScript and Playwright.

---

## 📂 Project Directory Structure

```text
Playwright_Framework
│
├── .github/
│   └── workflows/
│       └── playwright.yml            # CI/CD GitHub Actions workflow
│
├── tests/                            # Test specs grouped by category
│   ├── smoke/                        # Smoke test suites (login, registration)
│   ├── regression/                   # Regression test suites (dashboard, mfa, xero-sso)
│   └── api/                          # Backend API tests (userAPI)
│
├── pages/                            # Page Object Models (POM)
│   ├── BasePage.ts                   # Page interaction wrappers
│   ├── LoginPage.ts                  # Login page selectors and actions
│   ├── RegistrationPage.ts           # Registration page POM
│   └── DashboardPage.ts              # Dashboard selectors and actions
│
├── fixtures/
│   └── baseFixture.ts                # Custom injectable test fixtures
│
├── test-data/                        # Static test inputs & config parameters
│   ├── users.json                    # User credentials data
│   ├── credentials.json              # Client credentials configurations
│   └── config.json                   # Framework settings config
│
├── utils/                            # Generic helper utilities
│   ├── logger.ts                     # Formatted logging wrapper
│   ├── helper.ts                     # Dynamic data generation and timing
│   ├── apiHelper.ts                  # Playwright API requests wrapper
│   └── randomGenerator.ts            # Alphanumeric data generation helpers
│
├── constants/
│   ├── urls.ts                       # Application route mapping constants
│   ├── messages.ts                   # Validation & error messages
│   └── selectors.ts                  # Centralized UI CSS/XPath selectors
│
├── ai/                               # LLM & AI helper support directories
│   ├── promptTemplates/              # AI instruction prompts
│   ├── generatedTests/               # Auto-generated specs folder
│   └── locatorOptimizer.ts           # Smart locator selector fallback engine
│
├── reports/                          # Local HTML reports output folder
├── screenshots/                      # Diagnostic failure screenshots output
├── videos/                           # Diagnostic failure video recordings
│
├── .env                              # Active environment variables config
├── .env.example                      # Environment variables template
├── playwright.config.ts              # Playwright runner configuration
├── package.json                      # NPM package dependencies and scripts
└── tsconfig.json                     # TypeScript path aliases settings
```

---

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Download browsers**:
   ```bash
   npx playwright install
   ```
3. **Configure environment credentials** (copy `.env.example` to `.env` and fill in active user credentials).
4. **Execute all tests**:
   ```bash
   npx playwright test
   ```
5. **Execute tests in headed UI mode**:
   ```bash
   npx playwright test --ui
   ```
