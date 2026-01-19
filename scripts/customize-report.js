const fs = require('fs');
const path = require('path');

try {
    console.log('Applying custom theme (Dark Mode & PT-BR)...');

    // Check if report exists
    const reportIndex = path.join('allure-report', 'index.html');
    if (!fs.existsSync(reportIndex)) {
        console.log('Report index.html not found. Skipping customization.');
        return;
    }

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
        
        /* Logo replacement */
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
          'Status': 'Status',
          'Total': 'Total'
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
          });
          
          const title = document.querySelector('.side-nav__brand span');
          if(title) title.innerText = 'QA Squad';
        });

        observer.observe(document.body, { childList: true, subtree: true });
      </script>
    `;

    // Inject before </head> and </body>
    if (!htmlContent.includes('<!-- CUSTOM_THEME_APPLIED -->')) {
        htmlContent = htmlContent.replace('</head>', `${customStyle}<!-- CUSTOM_THEME_APPLIED --></head>`);
        htmlContent = htmlContent.replace('</body>', `${customScript}</body>`);
        fs.writeFileSync(reportIndex, htmlContent);
        console.log('Report customized successfully.');
    } else {
        console.log('Report already customized.');
    }

} catch (error) {
    console.error('Failed to generate report customization:', error);
    // Don't exit 1, just log error, so pipeline doesn't break just because of CSS
}
