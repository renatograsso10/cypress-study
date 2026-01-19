import ShadowDomPage from '../support/pages/ShadowDomPage';

describe('Shadow DOM Challenge', () => {

    beforeEach(() => {
        ShadowDomPage.visit();
    });

    it('Scenario 1: Fail to locate element using traditional selector', () => {
        ShadowDomPage.verifyButtonNotFoundTraditionally();
    });

    it('Scenario 2: Access Shadow Root (Open Mode)', () => {
        ShadowDomPage.verifyButtonVisibleInShadow();
    });

    it('Scenario 3: Interact with Encapsulated Elements', () => {
        ShadowDomPage.interactWithEncapsulatedElements();
    });

    it('Scenario 4: Nested Shadow DOMs (Recursive Search)', () => {
        ShadowDomPage.performRecursiveSearch();
    });

    it('Scenario 5: State Validation', () => {
        ShadowDomPage.validateState('Verificando Estado');
    });

    it('Extra: Reusable Helper', () => {
        ShadowDomPage.useSimpleHelper();
    });
});
