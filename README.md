# Automação Cypress - Shadow DOM & OAuth2

[![Cypress Tests](https://github.com/renatograsso10/cypress-study/actions/workflows/cypress.yml/badge.svg)](https://github.com/renatograsso10/cypress-study/actions/workflows/cypress.yml)

Este repositório contém a suíte de testes automatizados E2E para validação de cenários complexos, focando especificamente em **Shadow DOM aninhado** e fluxos de **autenticação OAuth2**.

O projeto foi estruturado utilizando padrões de mercado para garantir escalabilidade, facilidade de manutenção e integração contínua.

## Setup Local

### Pré-requisitos
- **Node.js**: Versão 20 ou superior.

### Instalação
```bash
npm install
```

### Execução dos Testes
Scripts facilitadores configurados no `package.json`:

```bash
# Executa todos os testes (Headless)
npm test

# Abre o Interactive Runner do Cypress
npm run test:open

# Executa apenas a suíte de Shadow DOM
npm run test:shadow
```

## Arquitetura do Projeto

A solução adota o **Page Object Model (POM)** para separar a lógica de teste da implementação técnica da página.

```
cypress/
├── e2e/               # Especificações de teste (Cenários)
├── fixtures/          # Massa de dados estática
├── support/
│   ├── pages/         # Page Objects (Mapeamento de elementos e ações)
│   ├── commands.js    # Comandos customizados globais
│   └── e2e.js         # Configurações globais de execução
```

## Soluções Técnicas

### Shadow DOM Recursivo
Para lidar com elementos encapsulados em múltiplos níveis de Shadow DOM, implementamos um comando personalizado (`cy.findInShadowRecursive`). Ele atravessa a árvore DOM dinamicamente até localizar o elemento alvo, abstraindo a complexidade dos testes.

### Mock Híbrido de OAuth2
A validação de login social é realizada através de simulação controlada (mock), garantindo estabilidade na execução sem dependência de provedores externos (Google/Facebook) durante os testes de regressão.

## Garantia de Qualidade

Mantemos o padrão de código através de ferramentas de análise estática e formatação.

1.  **Code Check**:
    O projeto utiliza **ESLint** e **Prettier**. O **Husky** impede commits fora do padrão.
    ```bash
    npm run lint      # Verifica violações
    npm run lint:fix  # Corrige formatação automaticamente
    ```

2.  **Relatórios de Execução**:
    Utilizamos o **Allure Report** para evidências detalhadas.
    ```bash
    npm run test:report
    npm run report:open
    # Nota: Requer Java instalado localmente.
    ```

3.  **Execução via Docker**:
    Para garantir paridade de ambiente, utilize o Docker Compose:
    ```bash
    docker-compose up --build
    ```
