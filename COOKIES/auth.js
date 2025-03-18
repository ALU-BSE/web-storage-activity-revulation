// CSRF Token Generation
function generateCSRFToken() {
  return Math.random().toString(36).substr(2);
}

// Set CSRF token on page load
document.addEventListener('DOMContentLoaded', () => {
  // Set CSRF tokens for both login and signup forms
  const csrfTokenField = document.getElementById('csrf-token');
  if (csrfTokenField) {
    const token = generateCSRFToken();
    csrfTokenField.value = token;
    // Store token in session storage for validation
    sessionStorage.setItem('csrfToken', token);
  }
  
  const signupCsrfTokenField = document.getElementById('signup-csrf-token');
  if (signupCsrfTokenField) {
    const signupToken = generateCSRFToken();
    signupCsrfTokenField.value = signupToken;
    // Store token in session storage for validation
    sessionStorage.setItem('signupCsrfToken', signupToken);
  }
  
  // Check authentication status
  checkAuthStatus();
  
  // Setup tab switching functionality
  setupAuthTabs();
});

// Setup authentication tabs (login/signup)
function setupAuthTabs() {
  const loginTab = document.getElementById('login-tab');
  const signupTab = document.getElementById('signup-tab');
  const loginSection = document.getElementById('login-section');
  const signupSection = document.getElementById('signup-section');
  
  if (loginTab && signupTab) {
    loginTab.addEventListener('click', () => {
      loginTab.classList.add('active');
      signupTab.classList.remove('active');
      loginSection.classList.remove('hidden');
      signupSection.classList.add('hidden');
    });
    
    signupTab.addEventListener('click', () => {
      signupTab.classList.add('active');
      loginTab.classList.remove('active');
      signupSection.classList.remove('hidden');
      loginSection.classList.add('hidden');
    });
  }
}

// User Storage Functions
function saveUser(userData) {
  try {
    // Get existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Add new user
    users.push(userData);
    
    // Save back to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
}

function findUser(username) {
  try {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(user => user.username === username);
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}

function validateUser(username, password) {
  const user = findUser(username);
  if (user && user.password === password) {
    return true;
  }
  return false;
}

// Check if username is already taken
function isUsernameTaken(username) {
  const user = findUser(username);
  return !!user;
}

// Task 1: User Authentication with Cookies
function setAuthCookie(username) {
  // Sanitize username to prevent XSS
  const sanitizedUsername = encodeURIComponent(username);
  
  // Calculate expiration date (7 days from now)
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);
  
  // Set the authentication cookie with HttpOnly and Secure flags
  // Note: In a real app, HttpOnly would be set server-side
  document.cookie = `authToken=${sanitizedUsername}; expires=${expirationDate.toUTCString()}; path=/; Secure`;
  
  // Store username for display purposes (separate from auth token)
  localStorage.setItem('username', sanitizedUsername);
}

function deleteAuthCookie() {
  // Delete the auth cookie by setting expiration to past date
  document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  localStorage.removeItem('username');
}

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

function checkAuthStatus() {
  const authToken = getCookie('authToken');
  const loginSection = document.getElementById('login-section');
  const signupSection = document.getElementById('signup-section');
  const loggedInSection = document.getElementById('logged-in-section');
  const authCheck = document.getElementById('auth-check');
  const userName = document.getElementById('user-name');
  const shopUserName = document.getElementById('shop-user-name');
  
  if (authToken) {
    // User is logged in
    if (loginSection && loggedInSection) {
      loginSection.classList.add('hidden');
      if (signupSection) signupSection.classList.add('hidden');
      loggedInSection.classList.remove('hidden');
      
      // Display username (from localStorage for display only)
      const username = localStorage.getItem('username') || 'User';
      if (userName) {
        userName.textContent = decodeURIComponent(username);
      }
    }
    
    // For shop page user display
    if (shopUserName) {
      const username = localStorage.getItem('username') || 'User';
      shopUserName.textContent = `Welcome, ${decodeURIComponent(username)}`;
    }
    
    // For shop page, indicate logged in status
    if (authCheck) {
      authCheck.classList.remove('hidden');
      authCheck.dataset.authenticated = 'true';
    }
  } else {
    // User is not logged in
    if (loginSection && loggedInSection) {
      // Check if we were on signup tab
      const signupTab = document.getElementById('signup-tab');
      if (signupTab && signupTab.classList.contains('active') && signupSection) {
        signupSection.classList.remove('hidden');
        loginSection.classList.add('hidden');
      } else {
        loginSection.classList.remove('hidden');
        if (signupSection) signupSection.classList.add('hidden');
      }
      loggedInSection.classList.add('hidden');
    }
    
    // For shop page auth check
    if (authCheck && window.location.href.includes('shop.html')) {
      authCheck.dataset.authenticated = 'false';
      // Redirect to login page if attempting to access shop when not logged in
      window.location.href = 'index.html?authRequired=true';
    }
  }
}

// Form validation helpers
function showError(input, message) {
  const formGroup = input.parentElement;
  
  // Remove existing error messages
  const existingError = formGroup.querySelector('.error-message');
  if (existingError) {
    formGroup.removeChild(existingError);
  }
  
  // Add error class to input
  input.classList.add('error');
  
  // Create and append error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerText = message;
  formGroup.appendChild(errorDiv);
}

function clearError(input) {
  const formGroup = input.parentElement;
  input.classList.remove('error');
  
  // Remove error message if it exists
  const errorMessage = formGroup.querySelector('.error-message');
  if (errorMessage) {
    formGroup.removeChild(errorMessage);
  }
}

function validatePassword(password) {
  return password.length >= 6;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Login form submission
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate CSRF token
    const formToken = document.getElementById('csrf-token').value;
    const storedToken = sessionStorage.getItem('csrfToken');
    
    if (formToken !== storedToken) {
      showNotification('Security validation failed. Please refresh the page and try again.', 'warning');
      return;
    }
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Clear previous errors
    clearError(document.getElementById('username'));
    clearError(document.getElementById('password'));
    
    // Simple validation
    let isValid = true;
    
    if (!username) {
      showError(document.getElementById('username'), 'Username is required');
      isValid = false;
    }
    
    if (!password) {
      showError(document.getElementById('password'), 'Password is required');
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Check if user exists and password matches
    if (validateUser(username, password)) {
      // Set auth cookie
      setAuthCookie(username);
      
      // Update UI
      checkAuthStatus();
      
      // Generate new CSRF token for next action
      const newToken = generateCSRFToken();
      document.getElementById('csrf-token').value = newToken;
      sessionStorage.setItem('csrfToken', newToken);
      
      showNotification('Login successful!');
    } else {
      showNotification('Invalid username or password', 'warning');
    }
  });
}

// Signup form submission
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate CSRF token
    const formToken = document.getElementById('signup-csrf-token').value;
    const storedToken = sessionStorage.getItem('signupCsrfToken');
    
    if (formToken !== storedToken) {
      showNotification('Security validation failed. Please refresh the page and try again.', 'warning');
      return;
    }
    
    const username = document.getElementById('new-username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Clear previous errors
    clearError(document.getElementById('new-username'));
    clearError(document.getElementById('email'));
    clearError(document.getElementById('new-password'));
    clearError(document.getElementById('confirm-password'));
    
    // Form validation
    let isValid = true;
    
    if (!username) {
      showError(document.getElementById('new-username'), 'Username is required');
      isValid = false;
    } else if (isUsernameTaken(username)) {
      showError(document.getElementById('new-username'), 'Username is already taken');
      isValid = false;
    }
    
    if (!email) {
      showError(document.getElementById('email'), 'Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      showError(document.getElementById('email'), 'Please enter a valid email');
      isValid = false;
    }
    
    if (!password) {
      showError(document.getElementById('new-password'), 'Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      showError(document.getElementById('new-password'), 'Password must be at least 6 characters');
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      showError(document.getElementById('confirm-password'), 'Passwords do not match');
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Save user
    const userData = {
      username,
      email,
      password,
      createdAt: new Date().toISOString()
    };
    
    const saved = saveUser(userData);
    
    if (saved) {
      // Auto-login the user
      setAuthCookie(username);
      
      // Update UI
      checkAuthStatus();
      
      // Generate new CSRF tokens
      const newLoginToken = generateCSRFToken();
      document.getElementById('csrf-token').value = newLoginToken;
      sessionStorage.setItem('csrfToken', newLoginToken);
      
      const newSignupToken = generateCSRFToken();
      document.getElementById('signup-csrf-token').value = newSignupToken;
      sessionStorage.setItem('signupCsrfToken', newSignupToken);
      
      // Reset form
      signupForm.reset();
      
      showNotification('Account created successfully!');
    } else {
      showNotification('Error creating account. Please try again.', 'warning');
    }
  });
}

// Logout button in login page
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    deleteAuthCookie();
    checkAuthStatus();
    showNotification('You have been logged out');
  });
}

// Logout button in shop page
const shopLogoutBtn = document.getElementById('shop-logout-btn');
if (shopLogoutBtn) {
  shopLogoutBtn.addEventListener('click', () => {
    deleteAuthCookie();
    window.location.href = 'index.html';
  });
}

// Check for authentication required message
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('authRequired') === 'true') {
    showNotification('Please log in to access the shop', 'warning');
  }
});

// Notification function (reused from cart.js)
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Apply styles
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = type === 'warning' ? 'var(--accent-color)' : 'var(--primary-color)';
  notification.style.color = 'white';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  notification.style.zIndex = '1000';
  notification.style.transition = 'opacity 0.3s ease';
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}