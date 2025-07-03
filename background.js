chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Show loading state in popup
    await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => {
        const overlay = document.createElement('div');
        overlay.id = 'wcag-scan-loading';
        overlay.innerHTML = 'Scanning page...';
        overlay.style.position = 'fixed';
        overlay.style.top = '10px';
        overlay.style.right = '10px';
        overlay.style.background = 'white';
        overlay.style.padding = '10px';
        overlay.style.zIndex = '999999';
        document.body.appendChild(overlay);
      }
    });

    // Run the actual scan
    await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['content-script.js']
    });

  } catch (error) {
    console.error("Scan failed:", error);
    // Show error directly on page
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => {
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `WCAG Scan Error: ${error.message}`;
        errorDiv.style.color = 'red';
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '10px';
        errorDiv.style.right = '10px';
        errorDiv.style.zIndex = '999999';
        document.body.appendChild(errorDiv);
      }
    });
  }
});