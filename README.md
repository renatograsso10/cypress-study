# Cypress E2E Test Automation

[![Cypress Tests](https://github.com/renatograsso10/cypress-study/actions/workflows/cypress.yml/badge.svg)](https://github.com/renatograsso10/cypress-study/actions/workflows/cypress.yml)

End-to-end test automation using Cypress for Shadow DOM and OAuth2 authentication flow challenges.

## Running Tests

### Local Execution

```bash
# Install dependencies
npm install

# Run all tests (headless)
npm test

# Open Cypress Test Runner
npm run test:open

# Run specific test suites
npm run test:shadow
npm run test:oauth
```

## CI/CD Pipeline

Automated testing pipeline using GitHub Actions. Tests run automatically on:
- Push to main, master, or develop branches
- Pull requests
- Manual workflow dispatch

### Pipeline Configuration
- Platform: GitHub Actions
- Browser: Chrome
- Execution: Parallel (2 containers)
- Artifacts: Screenshots and videos saved on failure (7 day retention)

## Test Coverage

### Shadow DOM Tests
- Traditional selector failure validation
- Shadow Root access
- Encapsulated element interaction
- Nested Shadow DOM handling (recursive)
- State validation

### OAuth2 Tests
- Flow initialization
- Provider authorization
- Token validation
- Authorization denial (simulated)
- State parameter validation
- Complete flow management function

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── cypress.yml
├── cypress/
│   ├── e2e/
│   │   ├── shadow-dom.cy.js
│   │   └── oauth2.cy.js
│   └── support/
├── cypress.config.js
└── package.json
```

## Technology Stack

- Cypress 15.9.0
- Node.js 20+
- GitHub Actions for CI/CD

