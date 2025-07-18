// ColorKey MetaMask Integration Background Script

chrome.runtime.onInstalled.addListener(() => {
  console.log('ColorKey MetaMask Integration installed');
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);
  
  if (request.action === 'colorkey-auth-complete') {
    console.log('ColorKey authentication completed');
    sendResponse({ success: true });
  }
  
  if (request.action === 'get-settings') {
    chrome.storage.sync.get(['colorkey-enabled'], (result) => {
      sendResponse({ enabled: result['colorkey-enabled'] !== false });
    });
    return true; // Will respond asynchronously
  }
  
  if (request.action === 'set-settings') {
    chrome.storage.sync.set({ 'colorkey-enabled': request.enabled }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Monitor for MetaMask extension contexts
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && 
      (tab.url?.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn') ||
       tab.url?.includes('moz-extension://'))) {
    console.log('MetaMask extension detected:', tab.url);
    
    // Inject our content script if not already present
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content-script.js']
    }).catch(err => {
      // Script might already be injected
      console.log('Script injection skipped:', err.message);
    });
  }
});