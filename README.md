# Cypress Automation Framework

[![Cypress Tests](https://github.com/renatograsso10/cypress-study/actions/workflows/cypress.yml/badge.svg)](https://github.com/renatograsso10/cypress-study/actions/workflows/cypress.yml)

Automated testing project using Cypress to validate Shadow DOM interactions and OAuth2 authentication flows. Refactored to use Page Object Model (POM) for better maintainability.

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Running Tests

Run all tests in headless mode:
```bash
npm test
```

Open Cypress interactive runner:
```bash
npm run test:open
```

Run specific suites:
```bash
npm run test:shadow
npm run test:oauth
```

## Architecture

The project follows the Page Object Model (POM) design pattern.

```
cypress/
├── e2e/                      # Test specifications
│   ├── shadow-dom.cy.js
│   └── oauth2.cy.js
├── fixtures/                 # Test data configuration
│   └── urls.json
├── support/
│   ├── pages/                # Page Objects (Logic & Selectors)
│   │   ├── ShadowDomPage.js
│   │   └── OAuth2Page.js
│   ├── commands.js           # Custom commands
│   └── e2e.js                # Global configuration
```

## Features

### Custom Commands
- `cy.findInShadowRecursive(selector)`: Traverses nested shadow DOMs to find elements.
- `cy.findInShadow(selector)`: Simple shadow DOM traversal helper.

### CI/CD
Configured with GitHub Actions to run tests on push and pull requests to main branches. Artifacts (screenshots/videos) are uploaded on test failure.
