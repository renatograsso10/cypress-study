import cypress from "eslint-plugin-cypress/flat";
import prettier from "eslint-config-prettier";

export default [
    cypress.configs.recommended,
    prettier,
    {
        rules: {
            "cypress/no-assigning-return-values": "error",
            "cypress/no-unnecessary-waiting": "error",
            "cypress/assertion-before-screenshot": "warn",
            "cypress/no-force": "warn",
            "cypress/no-async-tests": "error",
            "cypress/no-pause": "error"
        }
    }
];
