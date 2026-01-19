import './commands';
import 'allure-cypress';

// Hide fetch/XHR requests from command log
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
    const style = app.document.createElement('style');
    style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
    style.setAttribute('data-hide-command-log-request', '');
    app.document.head.appendChild(style);
}

// Prevent tests from failing on uncaught exceptions from the application
Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});
