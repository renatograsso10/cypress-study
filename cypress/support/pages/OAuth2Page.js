class OAuth2Page {
    constructor() {
        this.resultSelector = '#oauth-result';
    }

    visit() {
        cy.fixture('urls').then((urls) => {
            cy.visit(urls.oauth2);
        });
    }

    clickProviderButton(provider) {
        cy.get(`#btn-${provider}`).should('be.visible').click();
    }

    completeFlow(provider, options = {}) {
        const {
            shouldDeny = false,
            validateState = true,
            checkStorage = true
        } = options;

        const providerName = provider === 'github' ? 'GitHub' :
            provider.charAt(0).toUpperCase() + provider.slice(1);

        let initialState;
        cy.url().then(currentUrl => {
            const urlParams = new URL(currentUrl).searchParams;
            initialState = urlParams.get('state') || `state_${Date.now()}`;
        });

        this.clickProviderButton(provider);

        if (shouldDeny) {
            cy.url().then(callbackUrl => {
                expect(callbackUrl).to.include('error=access_denied');
            });
            return cy.wrap({ success: false, error: 'access_denied' });
        }

        cy.get(this.resultSelector, { timeout: 10000 })
            .should('contain.text', `Login com ${providerName} realizado!`);

        return cy.get(this.resultSelector).invoke('text').then((resultText) => {
            const tokenMatch = resultText.match(/Token de acesso: (mock_token_\w+)/);
            const token = tokenMatch ? tokenMatch[1] : null;

            const providerMatch = resultText.match(/Provedor: (\w+)/);
            const returnedProvider = providerMatch ? providerMatch[1] : null;

            if (checkStorage) {
                this._validateStorage(token);
            }

            cy.get(this.resultSelector).should('contain.text', '✅');

            return cy.wrap({
                success: true,
                token: token,
                provider: returnedProvider,
                authenticated: true,
                state: initialState
            });
        });
    }

    simulateDenialStub() {
        cy.window().then((win) => {
            win.fazerLogin = function (provider) {
                const resultEl = win.document.getElementById('oauth-result');

                resultEl.innerHTML = `
                    <p style="margin: 0; color: var(--muted); font-size: var(--font-size-sm);">
                        Redirecionando para ${provider.charAt(0).toUpperCase() + provider.slice(1)}...
                    </p>
                `;

                setTimeout(() => {
                    resultEl.innerHTML = `
                        <div class="result-error">
                            <p style="margin: 0; color: #e74c3c;"><strong>❌ Erro de Autenticação</strong></p>
                            <p style="margin: var(--spacing-xs) 0 0 0; color: var(--muted); font-size: var(--font-size-sm);">
                                O usuário negou o acesso (access_denied).
                            </p>
                            <code style="display: block; margin-top: var(--spacing-xs); padding: var(--spacing-xs); background: var(--bg-secondary); border-radius: var(--radius-sm); font-size: var(--font-size-sm);">
                                error: access_denied
                            </code>
                        </div>
                    `;
                    resultEl.style.borderLeftColor = '#e74c3c';
                }, 1500);
            };
        });
    }

    validateDenialState() {
        cy.get(this.resultSelector, { timeout: 5000 })
            .should('contain', 'Erro de Autenticação')
            .and('contain', 'access_denied');

        cy.get(this.resultSelector).should('not.contain', '✅');
        cy.get(this.resultSelector).should('contain', '❌');
    }

    _validateStorage(token) {
        cy.window().then((win) => {
            const storedToken = win.localStorage.getItem('token') ||
                win.localStorage.getItem('access_token');
        });

        cy.getCookies().then((cookies) => {
            const tokenCookie = cookies.find(c =>
                c.name === 'token' || c.name === 'access_token'
            );
        });
    }
}

export default new OAuth2Page();
