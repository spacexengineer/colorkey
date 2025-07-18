// ColorKey MetaMask Integration Content Script
console.log('ColorKey: Content script loaded');

class ColorKeyMetaMaskIntegration {
  constructor() {
    this.isActive = false;
    this.observer = null;
    this.interceptedInputs = new Set();
    this.init();
  }

  init() {
    // Check if we're in MetaMask extension context
    if (this.isMetaMaskContext()) {
      console.log('ColorKey: MetaMask context detected');
      this.startMonitoring();
    }
  }

  isMetaMaskContext() {
    return window.location.href.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn') ||
           window.location.href.includes('moz-extension://') ||
           document.querySelector('[data-testid="unlock-page"]') ||
           document.querySelector('.unlock-page') ||
           document.querySelector('#password') ||
           document.title.includes('MetaMask');
  }

  startMonitoring() {
    // Monitor for password inputs
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.scanForPasswordInputs(node);
            }
          });
        }
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['type', 'placeholder', 'class', 'id']
    });

    // Initial scan
    this.scanForPasswordInputs(document.body);
    
    // Periodic scan in case DOM changes aren't caught
    setInterval(() => this.scanForPasswordInputs(document.body), 1000);
  }

  scanForPasswordInputs(container) {
    const selectors = [
      'input[type="password"]',
      'input[placeholder*="password" i]',
      'input[placeholder*="Password" i]',
      'input[data-testid*="password"]',
      'input#password',
      '.unlock-page input',
      '[data-testid="unlock-page"] input'
    ];

    selectors.forEach(selector => {
      const inputs = container.querySelectorAll ? container.querySelectorAll(selector) : [];
      inputs.forEach(input => {
        if (!this.interceptedInputs.has(input) && this.shouldInterceptInput(input)) {
          this.interceptPasswordInput(input);
        }
      });
    });
  }

  shouldInterceptInput(input) {
    // Additional checks to ensure we're targeting MetaMask password inputs
    const parent = input.closest('.unlock-page, [data-testid="unlock-page"], .login, .password-container');
    const hasPasswordHints = input.placeholder && 
      (input.placeholder.toLowerCase().includes('password') || 
       input.placeholder.toLowerCase().includes('enter'));
    
    return (parent || hasPasswordHints) && input.type !== 'hidden';
  }

  interceptPasswordInput(input) {
    console.log('ColorKey: Intercepting password input', input);
    this.interceptedInputs.add(input);

    // Create ColorKey button
    const colorKeyButton = this.createColorKeyButton(input);
    
    // Insert ColorKey button after the input
    input.parentNode.insertBefore(colorKeyButton, input.nextSibling);
    
    // Hide original input but keep it for form submission
    input.style.display = 'none';
    
    // Add indicator that ColorKey is active
    this.addColorKeyIndicator(input.parentNode);
  }

  createColorKeyButton(originalInput) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'colorkey-unlock-btn';
    button.innerHTML = `
      <div class="colorkey-btn-content">
        <svg class="colorkey-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span>Unlock with ColorKey</span>
      </div>
    `;
    
    button.addEventListener('click', () => {
      this.launchColorKey(originalInput);
    });

    return button;
  }

  addColorKeyIndicator(container) {
    const indicator = document.createElement('div');
    indicator.className = 'colorkey-indicator';
    indicator.innerHTML = `
      <div class="colorkey-indicator-content">
        <svg class="colorkey-indicator-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span>Password input secured by ColorKey</span>
      </div>
    `;
    container.appendChild(indicator);
  }

  async launchColorKey(originalInput) {
    console.log('ColorKey: Launching ColorKey authentication');
    
    try {
      // Create and show ColorKey modal
      const modal = this.createColorKeyModal();
      document.body.appendChild(modal);
      
      // Wait for user to complete ColorKey authentication
      const password = await this.showColorKeyInterface();
      
      if (password) {
        // Fill the original input with the generated password
        this.fillPasswordAndSubmit(originalInput, password);
      }
      
      // Remove modal
      document.body.removeChild(modal);
      
    } catch (error) {
      console.error('ColorKey: Error during authentication', error);
    }
  }

  createColorKeyModal() {
    const modal = document.createElement('div');
    modal.className = 'colorkey-modal';
    modal.innerHTML = `
      <div class="colorkey-modal-content">
        <div class="colorkey-header">
          <h2>ColorKey Authentication</h2>
          <button class="colorkey-close" onclick="this.closest('.colorkey-modal').remove()">×</button>
        </div>
        <div class="colorkey-body">
          <p>Complete your visual authentication to unlock MetaMask</p>
          <div id="colorkey-demo-container">
            <!-- ColorKey demo will be loaded here -->
          </div>
        </div>
      </div>
    `;
    return modal;
  }

  async showColorKeyInterface() {
    return new Promise((resolve) => {
      // For this demo, we'll simulate the ColorKey process
      // In production, this would load the actual ColorKey component
      
      const demoContainer = document.getElementById('colorkey-demo-container');
      demoContainer.innerHTML = `
        <div class="colorkey-demo">
          <h3>Enter your visual password</h3>
          <p>Select the quadrant containing your password character</p>
          
          <div class="hyperplane-grid">
            <div class="quadrant" data-char="A">
              <div class="chars">A B C D E F</div>
              <div class="quadrant-label">Quadrant 1</div>
            </div>
            <div class="quadrant" data-char="M">
              <div class="chars">G H I J K L</div>
              <div class="quadrant-label">Quadrant 2</div>
            </div>
            <div class="quadrant" data-char="S">
              <div class="chars">M N O P Q R</div>
              <div class="quadrant-label">Quadrant 3</div>
            </div>
            <div class="quadrant" data-char="Z">
              <div class="chars">S T U V W X</div>
              <div class="quadrant-label">Quadrant 4</div>
            </div>
          </div>
          
          <div class="password-display">
            <input type="text" id="visual-password" placeholder="Your password will appear here..." readonly>
          </div>
          
          <button id="submit-colorkey" class="colorkey-submit">Complete Authentication</button>
        </div>
      `;

      let selectedPassword = '';
      
      // Add click handlers for quadrants
      document.querySelectorAll('.quadrant').forEach(quadrant => {
        quadrant.addEventListener('click', () => {
          const char = quadrant.dataset.char;
          selectedPassword += char;
          document.getElementById('visual-password').value = selectedPassword;
          
          // Visual feedback
          quadrant.style.background = '#4CAF50';
          setTimeout(() => {
            quadrant.style.background = '';
          }, 300);
        });
      });

      // Submit button
      document.getElementById('submit-colorkey').addEventListener('click', () => {
        if (selectedPassword.length > 0) {
          resolve(selectedPassword);
        } else {
          alert('Please select at least one character');
        }
      });
    });
  }

  fillPasswordAndSubmit(input, password) {
    console.log('ColorKey: Filling password and submitting');
    
    // Set the password value
    input.value = password;
    
    // Trigger input events to ensure MetaMask recognizes the value
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Find and click submit button
    const submitSelectors = [
      'button[type="submit"]',
      'button:contains("Unlock")',
      'button:contains("Log in")',
      '.btn-primary',
      '[data-testid="unlock-submit"]'
    ];
    
    let submitButton = null;
    for (const selector of submitSelectors) {
      submitButton = document.querySelector(selector);
      if (submitButton) break;
    }
    
    if (submitButton) {
      console.log('ColorKey: Clicking submit button');
      submitButton.click();
    } else {
      // Try to submit the form
      const form = input.closest('form');
      if (form) {
        console.log('ColorKey: Submitting form');
        form.submit();
      }
    }
  }
}

// Initialize ColorKey integration when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ColorKeyMetaMaskIntegration();
  });
} else {
  new ColorKeyMetaMaskIntegration();
}

// Also try after a short delay to catch dynamic content
setTimeout(() => {
  new ColorKeyMetaMaskIntegration();
}, 2000);