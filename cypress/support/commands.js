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

Cypress.Commands.add('findInShadow', { prevSubject: 'element' }, (subject, selector) => {
    return cy.wrap(subject).shadow().find(selector);
});
