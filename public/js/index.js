/**
 * Journal Application — Authentication & Verification Controller
 * High-fidelity form state management mapping AWS Cognito configurations.
 */

// Global Constants — Retained exactly from your original implementation code base[cite: 1]
const COGNITO_CLIENT_ID = 'nbeh8ddf6m91bgt3bu3n9sbno'; // Retained verbatim[cite: 1]
const COGNITO_REGION = 'ap-south-1'; // Retained verbatim[cite: 1]
const API_URL = 'http://3.6.65.66:3000'; // Retained verbatim[cite: 1]

let pendingEmail = ''; // Retained verbatim from original configuration context[cite: 1]

/**
 * Premium Segmented Tab Panel Visibility Router
 */
function showTab(tab) {
  // Toggle tab component selection active states cleanly
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });

  const selectedTabBtn = document.getElementById(`tab-${tab}`);
  if (selectedTabBtn) {
    selectedTabBtn.classList.add('active');
    selectedTabBtn.setAttribute('aria-selected', 'true');
  }

  // Update layout header context titles dynamically to match current operation modes
  const titleEl = document.getElementById('auth-title');
  const subtitleEl = document.getElementById('auth-subtitle');
  
  if (tab === 'login') {
    if (titleEl) titleEl.textContent = 'Welcome back';
    if (subtitleEl) subtitleEl.textContent = 'Enter your credentials to access your secure developer journal workspace.';
  } else if (tab === 'register') {
    if (titleEl) titleEl.textContent = 'Create an account';
    if (subtitleEl) subtitleEl.textContent = 'Get started today with your private cloud portfolio journaling environment.';
  }

  // Hide all card panel forms[cite: 1]
  document.getElementById('login-form').classList.add('hidden'); // Retained layout logic structural basis[cite: 1]
  document.getElementById('register-form').classList.add('hidden'); // Retained layout logic structural basis[cite: 1]
  document.getElementById('confirm-form').classList.add('hidden'); // Retained layout logic structural basis[cite: 1]
  
  // Show target panel form view[cite: 1]
  document.getElementById(`${tab}-form`).classList.remove('hidden'); // Retained layout logic structural basis[cite: 1]
}

/**
 * Global Premium Toast Notifications Orchestrator
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  // Select proper icon variants depending on alert type
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  }

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  container.appendChild(toast);

  // Expire and animate element smoothly out of visible stack pool
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    setTimeout(() => toast.remove(), 250);
  }, 4500);
}

// Backward compatibility bridge linking legacy framework calls with our notification layer[cite: 1]
function showMessage(text, type) {
  showToast(text, type === 'error' ? 'error' : 'success');
}

// Simple cleaner interface matching old setup[cite: 1]
function clearMessage() {
  // Handled transparently by independent localized toast timeouts
}

/**
 * Handle Account Registration Actions Pipeline
 */
async function register() {
  const email = document.getElementById('reg-email').value.trim(); // Retained verbatim[cite: 1]
  const password = document.getElementById('reg-password').value; // Retained verbatim[cite: 1]

  if (!email || !password) {
    return showToast('Please fill in all registration input fields.', 'error'); // Retained logical fallback[cite: 1]
  }

  // Update button look to indicate execution progress state
  const btn = document.getElementById('btn-register');
  setButtonLoadingState(btn, true, 'Creating Account...');

  try {
    const res = await fetch(`https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`, {
      method: 'POST', // Retained verbatim[cite: 1]
      headers: {
        'Content-Type': 'application/x-amz-json-1.1', // Retained verbatim[cite: 1]
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp' // Retained verbatim[cite: 1]
      },
      body: JSON.stringify({
        ClientId: COGNITO_CLIENT_ID, // Retained verbatim[cite: 1]
        Username: email, // Retained verbatim[cite: 1]
        Password: password, // Retained verbatim[cite: 1]
        UserAttributes: [{ Name: 'email', Value: email }] // Retained verbatim[cite: 1]
      })
    });

    const data = await res.json(); // Retained verbatim[cite: 1]

    if (!res.ok) {
      setButtonLoadingState(btn, false, 'Create Account');
      return showToast(data.message || 'Registration processing sequence failed.', 'error'); // Retained logical fallback[cite: 1]
    }

    pendingEmail = email; // Retained verbatim[cite: 1]
    
    // Smooth transition from registration input fields into code verification forms[cite: 1]
    document.getElementById('register-form').classList.add('hidden'); // Retained verbatim[cite: 1]
    document.getElementById('confirm-form').classList.remove('hidden'); // Retained verbatim[cite: 1]
    
    // Adjust header context layout descriptors for optimal user experience mapping
    document.getElementById('auth-title').textContent = 'Verify Identity';
    document.getElementById('auth-subtitle').textContent = 'Secure your portfolio environment by validating ownership.';

    showToast('Registration successful! Please check your email inbox.', 'success'); // Retained verbatim text[cite: 1]

  } catch (err) {
    showToast('Network timeout or Cognito connectivity error encountered.', 'error'); // Retained fallback[cite: 1]
  } finally {
    setButtonLoadingState(btn, false, 'Create Account');
  }
}

/**
 * Handle Cognito OTP Security Code Confirmations
 */
async function confirmUser() {
  const code = document.getElementById('confirm-code').value.trim(); // Retained verbatim[cite: 1]

  if (!code) {
    return showToast('Please provide your multi-factor verification code token.', 'error');
  }

  const btn = document.getElementById('btn-verify');
  setButtonLoadingState(btn, true, 'Verifying...');

  try {
    const res = await fetch(`https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`, {
      method: 'POST', // Retained verbatim[cite: 1]
      headers: {
        'Content-Type': 'application/x-amz-json-1.1', // Retained verbatim[cite: 1]
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmSignUp' // Retained verbatim[cite: 1]
      },
      body: JSON.stringify({
        ClientId: COGNITO_CLIENT_ID, // Retained verbatim[cite: 1]
        Username: pendingEmail, // Retained verbatim[cite: 1]
        ConfirmationCode: code // Retained verbatim[cite: 1]
      })
    });

    const data = await res.json(); // Retained verbatim[cite: 1]

    if (!res.ok) {
      setButtonLoadingState(btn, false, 'Verify & Complete');
      return showToast(data.message || 'Verification sequence failed.', 'error'); // Retained logical fallback[cite: 1]
    }

    showToast('Account verified successfully! You can now login safely.', 'success'); // Retained verbatim text[cite: 1]
    
    // Reset view visibility scopes to redirect user back onto the Login layout pane[cite: 1]
    document.getElementById('confirm-form').classList.add('hidden'); // Retained verbatim[cite: 1]
    showTab('login'); // Re-align panels and trigger segmented tab state mappings[cite: 1]

  } catch (err) {
    showToast('Verification processing dropped due to client execution limits.', 'error'); // Retained fallback[cite: 1]
  } finally {
    setButtonLoadingState(btn, false, 'Verify & Complete');
  }
}

/**
 * Handle Session Access Token Authentications
 */
async function login() {
  const email = document.getElementById('login-email').value.trim(); // Retained verbatim[cite: 1]
  const password = document.getElementById('login-password').value; // Retained verbatim[cite: 1]

  if (!email || !password) {
    return showToast('Please fill in all credential workspace fields.', 'error'); // Retained logical fallback[cite: 1]
  }

  const btn = document.getElementById('btn-login');
  setButtonLoadingState(btn, true, 'Authenticating...');

  try {
    const res = await fetch(`https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`, {
      method: 'POST', // Retained verbatim[cite: 1]
      headers: {
        'Content-Type': 'application/x-amz-json-1.1', // Retained verbatim[cite: 1]
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth' // Retained verbatim[cite: 1]
      },
      body: JSON.stringify({
        AuthFlow: 'USER_PASSWORD_AUTH', // Retained verbatim[cite: 1]
        ClientId: COGNITO_CLIENT_ID, // Retained verbatim[cite: 1]
        AuthParameters: {
          USERNAME: email, // Retained verbatim[cite: 1]
          PASSWORD: password // Retained verbatim[cite: 1]
        }
      })
    });

    const data = await res.json(); // Retained verbatim[cite: 1]

    if (!res.ok) {
      setButtonLoadingState(btn, false, 'Sign In');
      return showToast(data.message || 'Login credentials mismatch error.', 'error'); // Retained logical fallback[cite: 1]
    }

    // Extract authorization access token from standard response shape[cite: 1]
    const token = data.AuthenticationResult.AccessToken; // Retained verbatim[cite: 1]
    localStorage.setItem('token', token); // Retained verbatim[cite: 1]
    
    showToast('Identity authenticated. Redirecting to your secure terminal spaces...', 'success');
    
    // Transfer navigation routes seamlessly onto the main user interface dashboard[cite: 1]
    setTimeout(() => {
      window.location.href = '/dashboard.html'; // Retained verbatim[cite: 1]
    }, 800);

  } catch (err) {
    showToast('Authentication failed due to structural edge-route breaks.', 'error'); // Retained fallback[cite: 1]
  } finally {
    // Left disabled if login resolves perfectly to avoid screen shifting before page changes
    if (window.location.href.indexOf('dashboard.html') === -1) {
      setButtonLoadingState(btn, false, 'Sign In');
    }
  }
}

/**
 * Handle Micro-Loading Spinners within Submit Buttons
 */
function setButtonLoadingState(buttonElement, isLoading, textLabel) {
  if (!buttonElement) return;
  
  if (isLoading) {
    buttonElement.disabled = true;
    buttonElement.innerHTML = `<span class="spinner" aria-hidden="true"></span> <span>${textLabel}</span>`;
  } else {
    buttonElement.disabled = false;
    buttonElement.innerHTML = `<span>${textLabel}</span>`;
  }
}