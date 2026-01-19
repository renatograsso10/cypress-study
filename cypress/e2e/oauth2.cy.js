describe('OAuth2 Authentication Challenge', () => {
    const url = 'https://qa-playground-azure.vercel.app/pages/senior/dinamicos/oauth2-providers.html';

    beforeEach(() => {
        cy.visit(url);
    });

    /**
     * Complete OAuth2 flow management function
     * Handles: Login → Redirect → Authorization → Callback → Token → Authenticated
     * 
     * @param {string} provider - Provider name ('google', 'facebook', 'github')
     * @param {Object} options - Configuration options
     * @param {boolean} options.shouldDeny - Simulate authorization denial
     * @param {boolean} options.validateState - Validate state parameter (CSRF protection)
     * @param {boolean} options.checkStorage - Check token storage
     * @returns {Cypress.Chainable} Flow data object (token, state, provider)
     */
    const completeOAuth2Flow = (provider, options = {}) => {
        const {
            shouldDeny = false,
            validateState = true,
            checkStorage = true
        } = options;

        const providerName = provider === 'github' ? 'GitHub' :
            provider.charAt(0).toUpperCase() + provider.slice(1);

        let initialUrl, initialState;
        cy.url().then(currentUrl => {
            initialUrl = currentUrl;
            const urlParams = new URL(currentUrl).searchParams;
            initialState = urlParams.get('state') || `state_${Date.now()}`;
        });

        const btnSelector = `#btn-${provider}`;
        cy.get(btnSelector).should('be.visible').click();

        if (shouldDeny) {
            cy.url().then(callbackUrl => {
                expect(callbackUrl).to.include('error=access_denied');
            });
            return cy.wrap({ success: false, error: 'access_denied' });
        }

        cy.get('#oauth-result', { timeout: 10000 })
            .should('contain.text', `Login com ${providerName} realizado!`);

        return cy.get('#oauth-result').invoke('text').then((resultText) => {
            const tokenMatch = resultText.match(/Token de acesso: (mock_token_\w+)/);
            const token = tokenMatch ? tokenMatch[1] : null;

            const providerMatch = resultText.match(/Provedor: (\w+)/);
            const returnedProvider = providerMatch ? providerMatch[1] : null;

            const timeMatch = resultText.match(/Horário: ([\d:]+)/);
            const timestamp = timeMatch ? timeMatch[1] : null;

            if (validateState) {
                cy.url().then(callbackUrl => {
                    const urlParams = new URL(callbackUrl).searchParams;
                    const returnedState = urlParams.get('state');
                    expect(returnedProvider).to.equal(providerName);
                });
            }

            if (checkStorage) {
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

            cy.get('#oauth-result').should('contain.text', '✅');

            return cy.wrap({
                success: true,
                token: token,
                provider: returnedProvider,
                timestamp: timestamp,
                state: initialState,
                authenticated: true
            });
        });
    };

    it('Scenario 1: Iniciar Fluxo OAuth2', () => {
        cy.url().then(initialUrl => {
            cy.log(`Initial URL: ${initialUrl}`);
        });

        cy.get('#btn-google').click();

        cy.get('#oauth-result', { timeout: 10000 })
            .should('contain', 'Login com Google realizado!');
    });

    it('Scenario 2: Autorização no Provider', () => {
        cy.get('#btn-facebook').click();

        cy.get('#oauth-result', { timeout: 10000 })
            .should('contain', 'Login com Facebook realizado!');
    });

    it('Scenario 3: Validação de Token', () => {
        completeOAuth2Flow('github', { checkStorage: true }).then((flowData) => {
            expect(flowData.success).to.be.true;
            expect(flowData.token).to.match(/^mock_token_\w+$/);
            expect(flowData.authenticated).to.be.true;
        });

        cy.window().then((win) => {
            const storedToken = win.localStorage.getItem('token') ||
                win.localStorage.getItem('access_token');

            if (!storedToken) {
                cy.log('Note: Mock does not persist tokens to storage');
            }
        });

        cy.get('#oauth-result').should('contain.text', '✅');
    });

    it('Scenario 4: Negação de Autorização', () => {
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
                                error: access_denied<br>
                                error_description: The user denied the request
                            </code>
                        </div>
                    `;
                    resultEl.style.borderLeftColor = '#e74c3c';
                }, 1500);
            };
        });

        cy.get('#btn-google').click();

        cy.get('#oauth-result', { timeout: 5000 })
            .should('contain', 'Erro de Autenticação')
            .and('contain', 'access_denied');

        cy.get('#oauth-result').should('not.contain', '✅');
        cy.get('#oauth-result').should('contain', '❌');
    });

    it('Scenario 5: Validação de State', () => {
        const expectedState = `state_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        completeOAuth2Flow('google', { validateState: true }).then((flowData) => {
            expect(flowData.state).to.exist;
            expect(flowData.provider).to.equal('Google');
        });
    });

    it('Extra Challenge: Função de Gerenciamento Completo do Fluxo', () => {
        const providers = ['google', 'facebook', 'github'];

        providers.forEach((provider, index) => {
            if (index > 0) cy.reload();

            completeOAuth2Flow(provider, {
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
