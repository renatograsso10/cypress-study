describe('Shadow DOM Challenge', () => {
    const url = 'https://qa-playground-azure.vercel.app/pages/senior/dinamicos/shadow-dom.html';

    beforeEach(() => {
        cy.visit(url);
    });

    it('Scenario 1: Fail to locate element using traditional selector', () => {
        cy.get('#shadow-btn').should('not.exist');
    });

    it('Scenario 2: Access Shadow Root (Open Mode)', () => {
        cy.get('#shadow-host')
            .shadow()
            .find('#shadow-btn')
            .should('exist')
            .and('be.visible');
    });

    /**
     * Custom command for recursive Shadow DOM traversal
     * Handles arbitrarily nested shadow roots
     */
    Cypress.Commands.add('findInShadowRecursive', { prevSubject: 'element' }, (subject, selector) => {
        const findInShadow = (root, selector) => {
            const found = root.querySelector(selector);
            if (found) return found;

            const children = Array.from(root.querySelectorAll('*'));
            for (const child of children) {
                if (child.shadowRoot) {
                    const result = findInShadow(child.shadowRoot, selector);
                    if (result) return result;
                }
            }
            return null;
        };

        return cy.wrap(subject).then($el => {
            const root = $el[0].shadowRoot || $el[0];
            const result = findInShadow(root, selector);
            if (!result) {
                throw new Error(`Element '${selector}' not found in any Shadow DOM level.`);
            }
            return cy.wrap(result);
        });
    });

    it('Scenario 3: Interact with Encapsulated Elements', () => {
        cy.get('#shadow-host').shadow().within(() => {
            cy.get('#shadow-btn').click();
            cy.get('#shadow-input').type('Test Input');
            cy.get('#shadow-input').should('have.value', 'Test Input');
        });
    });

    it('Scenario 4: Nested Shadow DOMs (Recursive Search)', () => {
        cy.get('#shadow-host')
            .findInShadowRecursive('#shadow-btn')
            .click();

        cy.get('#shadow-host')
            .findInShadowRecursive('#shadow-input')
            .type('Advanced Search Success');
    });

    it('Scenario 5: State Validation', () => {
        cy.get('#shadow-host').shadow().within(() => {
            cy.get('#shadow-input').clear().type('Verificando Estado');
            cy.get('#shadow-input').should('have.value', 'Verificando Estado');
        });
    });

    /**
     * Helper command for simple shadow DOM access
     */
    Cypress.Commands.add('findInShadow', { prevSubject: 'element' }, (subject, selector) => {
        return cy.wrap(subject).shadow().find(selector);
    });

    it('Extra: Reusable Helper', () => {
        cy.get('#shadow-host')
            .findInShadow('#shadow-btn')
            .click();
    });
});
