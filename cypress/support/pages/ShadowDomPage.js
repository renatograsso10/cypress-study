class ShadowDomPage {
    constructor() {
        this.hostSelector = '#shadow-host';
        this.btnSelector = '#shadow-btn';
        this.inputSelector = '#shadow-input';
    }

    visit() {
        cy.fixture('urls').then((urls) => {
            cy.visit(urls.shadowDom);
        });
    }

    verifyButtonNotFoundTraditionally() {
        cy.get(this.btnSelector).should('not.exist');
    }

    verifyButtonVisibleInShadow() {
        cy.get(this.hostSelector)
            .shadow()
            .find(this.btnSelector)
            .should('exist')
            .and('be.visible');
    }

    interactWithEncapsulatedElements() {
        cy.get(this.hostSelector).shadow().within(() => {
            cy.get(this.btnSelector).click();
            cy.get(this.inputSelector).type('Test Input');
            cy.get(this.inputSelector).should('have.value', 'Test Input');
        });
    }

    performRecursiveSearch() {
        cy.get(this.hostSelector)
            .findInShadowRecursive(this.btnSelector)
            .click();

        cy.get(this.hostSelector)
            .findInShadowRecursive(this.inputSelector)
            .type('Advanced Search Success');
    }

    validateState(text) {
        cy.get(this.hostSelector).shadow().within(() => {
            cy.get(this.inputSelector).clear();
            cy.get(this.inputSelector).type(text);
            cy.get(this.inputSelector).should('have.value', text);
        });
    }

    useSimpleHelper() {
        cy.get(this.hostSelector)
            .findInShadow(this.btnSelector)
            .click();
    }
}

export default new ShadowDomPage();
