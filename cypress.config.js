const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: 'https://qa-playground-azure.vercel.app',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        // Ensure shadow DOM traversal is manual for the sake of the challenge
        includeShadowDom: false,
    },
});
