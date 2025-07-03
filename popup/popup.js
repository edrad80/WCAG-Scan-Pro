document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('status');
  const loadingEl = document.getElementById('loading');
  
  // Show loading state
  statusEl.style.display = 'none';
  loadingEl.style.display = 'block';
  
  // Send scan command to background
  chrome.runtime.sendMessage({action: "startScan"});
});
