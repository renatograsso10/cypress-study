import OAuth2Page from '../support/pages/OAuth2Page';

describe('OAuth2 Authentication Challenge', () => {

    beforeEach(() => {
        OAuth2Page.visit();
    });

    it('Scenario 1: Iniciar Fluxo OAuth2', () => {
        OAuth2Page.clickProviderButton('google');
        cy.get('#oauth-result', { timeout: 10000 })
            .should('contain', 'Login com Google realizado!');
    });

    it('Scenario 2: Autorização no Provider', () => {
        OAuth2Page.clickProviderButton('facebook');
        cy.get('#oauth-result', { timeout: 10000 })
            .should('contain', 'Login com Facebook realizado!');
    });

    it('Scenario 3: Validação de Token', () => {
        OAuth2Page.completeFlow('github', { checkStorage: true }).then((flowData) => {
            expect(flowData.success).to.be.true;
            expect(flowData.token).to.match(/^mock_token_\w+$/);
            expect(flowData.authenticated).to.be.true;
        });
    });

    it('Scenario 4: Negação de Autorização', () => {
        // Stubbing is now handled by the Page Object
        OAuth2Page.simulateDenialStub();

        OAuth2Page.clickProviderButton('google');

        OAuth2Page.validateDenialState();
    });

    it('Scenario 5: Validação de State', () => {
        OAuth2Page.completeFlow('google', { validateState: true }).then((flowData) => {
            expect(flowData.state).to.exist;
            expect(flowData.provider).to.equal('Google');
        });
    });

    it('Extra Challenge: Função de Gerenciamento Completo do Fluxo', () => {
        const providers = ['google', 'facebook', 'github'];

        providers.forEach((provider, index) => {
            if (index > 0) cy.reload();

            OAuth2Page.completeFlow(provider, {
                validateState: true,
                checkStorage: true
            }).then((flowData) => {
                expect(flowData.success, `${provider}: Flow should succeed`).to.be.true;
                expect(flowData.token, `${provider}: Token should exist`).to.match(/^mock_token_\w+$/);
                expect(flowData.authenticated, `${provider}: Should be authenticated`).to.be.true;
                expect(flowData.provider, `${provider}: Provider should match`).to.exist;
            });
        });
    });
});
