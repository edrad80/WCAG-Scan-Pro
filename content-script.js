// 1. Remove any existing loading indicator
const loadingIndicator = document.getElementById('wcag-scan-loading');
if (loadingIndicator) loadingIndicator.remove();

// 2. Show REAL results (modify with your actual scanning code)
function showResults(issues) {
  const resultsPanel = document.createElement('div');
  resultsPanel.id = 'wcag-scan-results';
  resultsPanel.style.position = 'fixed';
  resultsPanel.style.top = '10px';
  resultsPanel.style.right = '10px';
  resultsPanel.style.background = 'white';
  resultsPanel.style.padding = '20px';
  resultsPanel.style.zIndex = '999999';
  resultsPanel.style.maxWidth = '300px';
  resultsPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';

  resultsPanel.innerHTML = `
    <h3 style="margin-top:0">WCAG Scan Results</h3>
    ${issues.map(issue => `
      <div style="margin-bottom:10px;color:${
        issue.severity === 'critical' ? 'red' : 'orange'
      }">
        <strong>${issue.message}</strong><br>
        <small>${issue.element || 'N/A'}</small>
      </div>
    `).join('')}
    <button onclick="document.getElementById('wcag-scan-results').remove()" 
            style="margin-top:10px; padding:5px 10px;">
      Close
    </button>
  `;

  document.body.appendChild(resultsPanel);
}

// 3. Run your scan and display results (example with test data)
const testResults = [
  {
    message: "Missing alt text on header image",
    severity: "critical",
    element: "img.banner"
  },
  {
    message: "Low contrast on submit button",
    severity: "moderate",
    element: "button.submit"
  }
];

showResults(testResults);

// 4. Send data to background for report generation (optional)
chrome.runtime.sendMessage({
  action: "scanComplete",
  data: {
    url: window.location.href,
    issues: testResults
  }
});