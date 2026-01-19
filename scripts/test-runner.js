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

try {
    console.log('Generating report...');
    execSync('npm run report:generate', { stdio: 'inherit' });
    console.log('Report generated successfully.');
} catch (error) {
    console.error('Failed to generate report:', error);
    process.exit(1);
}
