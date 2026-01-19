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

    // --- CUSTOMIZATION STEP (BANHO DE LOJA) ---
    console.log('Applying custom theme (Dark Mode & PT-BR)...');

    const reportIndex = path.join('allure-report', 'index.html');
    let htmlContent = fs.readFileSync(reportIndex, 'utf8');

    const customStyle = `
      <style>
        /* Modern Dark Theme */
        :root {
          --primary: #6c5ce7; 
          --bg-dark: #1e1e2e;
          --bg-card: #2d2d44;
          --text-main: #e0e0e0;
        }
        
        body, .app { background-color: var(--bg-dark) !important; color: var(--text-main) !important; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important; }
        
        /* Sidebar */
        .side-nav { background: #181825 !important; }
        .side-nav__item-text { text-transform: none !important; font-size: 14px !important; }
        
        /* Cards & Containers */
        .widget, .pane, .dashboard__widget { 
          background: var(--bg-card) !important; 
          border-radius: 12px !important; 
          box-shadow: 0 4px 6px rgba(0,0,0,0.3) !important;
          border: none !important;
        }
        
        /* Texts */
        h1, h2, h3, .pane__title, .widget__title { color: white !important; text-transform: none !important; font-weight: 600 !important; }
        .text-muted { color: #a0a0b0 !important; }
        
        /* Charts */
        .chart__plot { opacity: 0.9; }
        
        /* Remove default uppercase */
        * { text-transform: none !important; }
        .label { text-transform: none !important; border-radius: 4px !important; }
        
        /* Logo replacement (Optional) */
        .side-nav__brand { background: none !important; }
        .side-nav__brand:after { content: 'QA SQUAD'; color: white; font-weight: bold; font-size: 18px; margin-left: 10px; }
        .side-nav__brand-text { display: none !important; }
      </style>
    `;

    const customScript = `
      <script>
        // Dictionary for translation
        const ptBR = {
          'Overview': 'Visão Geral',
          'Suites': 'Suítes de Teste',
          'Behaviors': 'Comportamentos',
          'Packages': 'Pacotes',
          'Graphs': 'Gráficos',
          'Timeline': 'Linha do Tempo',
          'Executor': 'Executor',
          'History': 'Histórico',
          'Unknown': 'Desconhecido',
          'Passed': 'Passou',
          'Failed': 'Falhou',
          'Broken': 'Quebrado',
          'Skipped': 'Pulado',
           'Filter': 'Filtrar',
           'Status': 'Status'
        };

        // Observer to translate dynamic content
        const observer = new MutationObserver(() => {
          document.querySelectorAll('*').forEach(el => {
            // Translate direct text nodes
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
              const text = el.innerText.trim();
              if (ptBR[text]) {
                el.innerText = ptBR[text];
              }
            }
            // Translate tooltips or attributes if needed
          });
          
          // Force fix specific Allure elements
          const title = document.querySelector('.side-nav__brand span');
          if(title) title.innerText = 'QA Squad';
        });

        observer.observe(document.body, { childList: true, subtree: true });
      </script>
    `;

    // Inject before </head> and </body>
    htmlContent = htmlContent.replace('</head>', `${customStyle}</head>`);
    htmlContent = htmlContent.replace('</body>', `${customScript}</body>`);

    fs.writeFileSync(reportIndex, htmlContent);
    console.log('Report customized successfully.');

    console.log('Report generated successfully.');
} catch (error) {
    console.error('Failed to generate report:', error);
    process.exit(1);
}
