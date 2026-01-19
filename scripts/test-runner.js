const { execSync } = require('child_process');

try {
    console.log('Cleaning reports...');
    execSync('npm run report:clean', { stdio: 'inherit' });

    console.log('Running tests...');
    execSync('npm test', { stdio: 'inherit' });
} catch (error) {
    // Tests failed, but we still want to generate the report
    console.log('Tests finished with errors. Proceeding to report generation...');
}

const fs = require('fs');
const path = require('path');

// Add professional environment info
try {
    const envContent = `Projeto=Estudo Cypress (Automação)
Ambiente=Homologação (Mock)
Time=Squad de Engenharia & Qualidade
Tipo_de_Teste=E2E (Ponta a Ponta)
Navegador=Chrome
SO=${process.platform}
Executor=GitHub Actions CI/CD
`;
    if (!fs.existsSync('allure-results')) {
        fs.mkdirSync('allure-results');
    }
    fs.writeFileSync(path.join('allure-results', 'environment.properties'), envContent);
    console.log('Environment info added to report.');
} catch (err) {
    console.error('Could not write environment info:', err);
}

try {
    console.log('Generating report...');
    execSync('npm run report:generate', { stdio: 'inherit' });
    console.log('Report generated successfully.');
} catch (error) {
    console.error('Failed to generate report:', error);
    process.exit(1);
}
