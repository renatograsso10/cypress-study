const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: 'https://qa-playground-azure.vercel.app',
        setupNodeEvents(on, config) {
            require('allure-cypress/reporter').allureCypress(on, config, {
                resultsDir: "allure-results",
            });
            return config;
        },
        // Ensure shadow DOM traversal is manual for the sake of the challenge
        includeShadowDom: false,
    },
});
