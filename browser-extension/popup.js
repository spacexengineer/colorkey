// ColorKey MetaMask Integration Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('toggle');
  const statusIcon = document.getElementById('status-icon');
  const statusText = document.getElementById('status-text');
  const statusDescription = document.getElementById('status-description');
  
  // Load current settings
  chrome.storage.sync.get(['colorkey-enabled'], (result) => {
    const enabled = result['colorkey-enabled'] !== false;
    toggle.classList.toggle('active', enabled);
  });
  
  // Toggle functionality
  toggle.addEventListener('click', () => {
    const isActive = toggle.classList.contains('active');
    const newState = !isActive;
    
    toggle.classList.toggle('active', newState);
    
    chrome.storage.sync.set({ 'colorkey-enabled': newState }, () => {
      console.log('ColorKey enabled:', newState);
      updateStatus();
    });
  });
  
  // Check MetaMask status
  async function checkMetaMaskStatus() {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentTab = tabs[0];
      
      // Check if MetaMask is installed by looking for the extension
      const metamaskInstalled = await checkMetaMaskInstalled();
      
      if (!metamaskInstalled) {
        setStatus('error', 'MetaMask Not Found', 'Please install MetaMask extension to use ColorKey integration');
        return;
      }
      
      // Check if we're on a MetaMask page
      if (currentTab.url?.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn')) {
        setStatus('success', 'MetaMask Detected', 'ColorKey is ready to secure your password input');
      } else {
        setStatus('info', 'Ready to Activate', 'Navigate to MetaMask to see ColorKey in action');
      }
      
    } catch (error) {
      setStatus('error', 'Check Failed', 'Unable to verify MetaMask status');
    }
  }
  
  async function checkMetaMaskInstalled() {
    try {
      // Try to check if MetaMask extension exists
      const response = await fetch('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/manifest.json');
      return response.ok;
    } catch {
      return false;
    }
  }
  
  function setStatus(type, text, description) {
    statusText.textContent = text;
    statusDescription.textContent = description;
    
    // Update icon based on status type
    let iconPath = '';
    switch (type) {
      case 'success':
        iconPath = 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
        break;
      case 'error':
        iconPath = 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
        break;
      case 'info':
        iconPath = 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
        break;
      default:
        iconPath = 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z';
    }
    
    statusIcon.innerHTML = `<path d="${iconPath}"/>`;
  }
  
  function updateStatus() {
    chrome.storage.sync.get(['colorkey-enabled'], (result) => {
      const enabled = result['colorkey-enabled'] !== false;
      
      if (!enabled) {
        setStatus('info', 'ColorKey Disabled', 'Enable ColorKey to secure MetaMask password inputs');
      } else {
        checkMetaMaskStatus();
      }
    });
  }
  
  // Initial status check
  updateStatus();
  
  // Refresh status every 3 seconds
  setInterval(updateStatus, 3000);
});