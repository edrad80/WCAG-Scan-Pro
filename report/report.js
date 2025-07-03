const params = new URLSearchParams(location.search);
try {
  const { url, issues } = JSON.parse(params.get('data'));
  
  document.body.innerHTML = `
    <div class="report-header">
      <h1>WCAG Scan Pro Report</h1>
      <div class="scan-info">
        <div><strong>URL:</strong> <a href="${url}" target="_blank">${url}</a></div>
        <div><strong>Scanned:</strong> ${new Date().toLocaleString()}</div>
      </div>
    </div>

    <div class="results-summary ${issues[0].type === 'no-issues' ? 'success' : ''}">
      ${issues[0].type === 'no-issues' ? '✅' : '🔍'} 
      ${issues.length} ${issues.length === 1 ? 'issue' : 'issues'} found
    </div>

    <ul class="issue-list">
      ${issues.map(issue => `
        <li class="issue ${issue.severity}">
          <div class="issue-header">
            <span class="severity-badge">${issue.severity.toUpperCase()}</span>
            <span class="issue-type">${issue.type.replace('-', ' ')}</span>
          </div>
          <div class="issue-message">${issue.message}</div>
          <div class="issue-details">
            <div><strong>Element:</strong> <code>${issue.element}</code></div>
            <div><strong>WCAG:</strong> ${issue.wcagRef}</div>
            <div class="fix-guide"><strong>How to fix:</strong> ${issue.howToFix}</div>
          </div>
        </li>
      `).join('')}
    </ul>

    <style>
      /* CSS styles from previous version */
      body { font-family: 'Segoe UI', system-ui, sans-serif; line-height: 1.6; }
      .report-header { margin-bottom: 20px; }
      .scan-info { background: #f5f5f5; padding: 10px; border-radius: 4px; }
      .results-summary {
        padding: 10px;
        margin: 15px 0;
        border-radius: 4px;
        font-weight: bold;
      }
      .results-summary.success {
        background: #e8f5e9;
        color: #2e7d32;
      }
      .issue { margin-bottom: 15px; border-left: 4px solid; padding-left: 10px; }
      .critical { border-color: #d32f2f; }
      .moderate { border-color: #ff9800; }
      .success { border-color: #2e7d32; }
      .severity-badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8em;
        font-weight: bold;
        margin-right: 8px;
      }
      .critical .severity-badge { background: #d32f2f; color: white; }
      .moderate .severity-badge { background: #ff9800; }
      .success .severity-badge { background: #2e7d32; color: white; }
      .issue-type {
        font-size: 0.9em;
        color: #555;
        text-transform: capitalize;
      }
      .issue-message { margin: 8px 0; font-weight: 500; }
      .issue-details { font-size: 0.9em; color: #555; }
      .fix-guide { margin-top: 5px; padding: 8px; background: #f5f5f5; border-radius: 4px; }
      code { background: #eee; padding: 2px 4px; border-radius: 3px; }
    </style>
  `;
} catch (e) {
  document.body.innerHTML = `
    <h1>Report Error</h1>
    <pre>${e.message}</pre>
  `;
}
