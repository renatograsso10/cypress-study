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

## Ferramentas de Qualidade (QA Tools)

Este projeto utiliza ferramentas de ponta para garantir a excelência do código.

### Clean Code & Padronização
Mantemos a casa limpa com **ESLint** (análise estática) e **Prettier** (formatação).
O **Husky** garante que nada fora do padrão seja commitado.

```bash
npm run lint      # Verificar problemas
npm run lint:fix  # Corrigir automaticamente
```

### Relatórios (Allure Reports) 📊
Geramos relatórios visuais detalhados de cada execução.
**Nota:** É necessário ter o **Java (JDK 8+)** instalado para gerar os relatórios localmente.

```bash
npm run test:report  # Executa testes + Gera relatório
npm run report:open  # Abre o relatório no navegador
```

**Online (GitHub Pages):**
O workflow automaticamente publica o relatório na branch `gh-pages`.
Configure em **Settings > Pages > Build and deployment > Source: Deploy from a branch > gh-pages**.
O link aparecerá lá (ex: `https://seu-usuario.github.io/repo/`).

### Docker 🐳
Para garantir que tudo funcione igual na sua máquina e na minha:

```bash
docker-compose up --build
```

