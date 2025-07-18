# ColorKey MetaMask Integration Browser Extension

This browser extension intercepts MetaMask password inputs and replaces them with ColorKey visual authentication.

## 🚀 Installation Instructions

### Chrome/Edge Installation

1. **Open Chrome/Edge Extension Manager**
   - Go to `chrome://extensions/` (Chrome) or `edge://extensions/` (Edge)
   - Enable "Developer mode" in the top right

2. **Load the Extension**
   - Click "Load unpacked"
   - Select the `browser-extension` folder
   - The ColorKey extension should appear in your extensions list

3. **Grant Permissions**
   - The extension needs access to MetaMask's extension pages
   - Click "Allow" when prompted for permissions

### Firefox Installation

1. **Open Firefox Add-ons Manager**
   - Go to `about:debugging`
   - Click "This Firefox"

2. **Load Temporary Add-on**
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file in the `browser-extension` folder

## 🔧 How It Works

### Step 1: Detection
- The extension monitors for MetaMask password input fields
- Uses multiple selectors to catch different MetaMask UI versions

### Step 2: Interception
- Replaces password inputs with "Unlock with ColorKey" buttons
- Hides the original password field but keeps it for form submission

### Step 3: Authentication
- Opens ColorKey visual authentication modal
- User completes hyperplan selection instead of typing

### Step 4: Password Injection
- Generates password from ColorKey visual input
- Automatically fills and submits to MetaMask

## 🎯 Features

- ✅ **Real MetaMask Integration** - Works with actual MetaMask extension
- ✅ **DOM Interception** - Detects and replaces password inputs
- ✅ **Visual Authentication** - ColorKey hyperplan selection
- ✅ **Automatic Submission** - Fills password and submits form
- ✅ **Cross-Browser Support** - Chrome, Firefox, Edge compatible
- ✅ **Secure Transmission** - Encrypted password handling

## 🔒 Security Features

- **Zero Keyboard Input** - No typing required
- **Keylogger Immunity** - Visual selection can't be recorded
- **Screen Recording Protection** - Dynamic layouts prevent replay attacks
- **Local Processing** - Passwords generated client-side only

## 🛠 Technical Implementation

### Content Script (`content-script.js`)
- Monitors DOM for MetaMask password inputs
- Replaces inputs with ColorKey buttons
- Handles password generation and form submission

### Background Script (`background.js`)
- Manages extension lifecycle
- Handles cross-tab communication
- Monitors for MetaMask extension contexts

### Popup (`popup.html` + `popup.js`)
- Extension control panel
- Enable/disable ColorKey integration
- Status monitoring and debugging

## 🎮 Usage

1. **Install the extension** following instructions above
2. **Open MetaMask** - Navigate to your MetaMask extension
3. **See the password screen** - The normal "Enter password" field
4. **Click "Unlock with ColorKey"** - Instead of typing password
5. **Complete visual authentication** - Select quadrants in the modal
6. **Automatic unlock** - MetaMask unlocks without typing

## 🔍 Debugging

### Check Console Logs
- Open browser DevTools (F12)
- Look for "ColorKey:" prefixed messages
- Monitor for detection and injection events

### Verify Extension Status
- Click the ColorKey extension icon
- Check status shows "MetaMask Detected"
- Ensure toggle is enabled

### Common Issues

**Extension not working?**
- Ensure Developer mode is enabled
- Check extension permissions are granted
- Refresh MetaMask extension page

**Password input not detected?**
- Check browser console for errors
- Verify MetaMask version compatibility
- Try refreshing the MetaMask page

**ColorKey modal not appearing?**
- Check for popup blockers
- Verify extension has sufficient permissions
- Look for JavaScript errors in console

## 🚧 Development Status

This is a **proof-of-concept** implementation demonstrating:
- Real browser extension architecture
- MetaMask DOM manipulation capabilities  
- ColorKey visual authentication integration
- Production-ready security patterns

## 🔮 Production Roadmap

1. **Enhanced Detection** - Support more MetaMask UI versions
2. **Encrypted Storage** - Secure local credential storage
3. **Advanced ColorKey** - Full hyperplan implementation
4. **Cross-Wallet Support** - Other wallet extensions
5. **Enterprise Features** - Team management and policies

## ⚠️ Important Notes

- This extension modifies MetaMask's UI for demonstration
- Always verify code before granting extension permissions
- Keep extension updated for security patches
- Use strong ColorKey passwords for maximum security

## 📝 License

This is a demonstration project. Refer to main project license for usage terms.