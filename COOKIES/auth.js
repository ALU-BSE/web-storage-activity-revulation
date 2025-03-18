// CSRF Token Generation
function generateCSRFToken() {
    return Math.random().toString(36).substr(2);
  }
  
  // Set CSRF token on page load
  document.addEventListener('DOMContentLoaded', () => {
    const csrfTokenField = document.getElementById('csrf-token');
    if (csrfTokenField) {
      const token = generateCSRFToken();
      csrfTokenField.value = token;
      // Store token in session storage for validation
      sessionStorage.setItem('csrfToken', token);
    }
    
    // Check authentication status
    checkAuthStatus();
  });
  
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
    const loggedInSection = document.getElementById('logged-in-section');
    const authCheck = document.getElementById('auth-check');
    const userName = document.getElementById('user-name');
    const shopUserName = document.getElementById('shop-user-name');
    
    if (authToken) {
      // User is logged in
      if (loginSection && loggedInSection) {
        loginSection.classList.add('hidden');
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
        loginSection.classList.remove('hidden');
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
  
  // Login form submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validate CSRF token
      const formToken = document.getElementById('csrf-token').value;
      const storedToken = sessionStorage.getItem('csrfToken');
      
      if (formToken !== storedToken) {
        alert('Security validation failed. Please refresh the page and try again.');
        return;
      }
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      // Simple validation (in real app, this would be server-side)
      if (username && password) {
        // Set auth cookie
        setAuthCookie(username);
        
        // Update UI
        checkAuthStatus();
        
        // Generate new CSRF token for next action
        const newToken = generateCSRFToken();
        document.getElementById('csrf-token').value = newToken;
        sessionStorage.setItem('csrfToken', newToken);
      }
    });
  }
  
  // Logout button in login page
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      deleteAuthCookie();
      checkAuthStatus();
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