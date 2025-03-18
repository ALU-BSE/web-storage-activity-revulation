// Task 4: Security Implementation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize CSRF protection for all forms
    initializeCsrfProtection();
    
    // Apply XSS protection to all user-generated content
    protectAgainstXss();
  });
  
  // CSRF Protection
  function initializeCsrfProtection() {
    // Add CSRF token to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      if (!form.querySelector('input[name="csrfToken"]')) {
        const csrfToken = generateCsrfToken();
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'csrfToken';
        tokenInput.value = csrfToken;
        form.appendChild(tokenInput);
        
        // Store token in session storage for validation
        sessionStorage.setItem('csrfToken', csrfToken);
      }
    });
    
    // Check CSRF token on form submission
    forms.forEach(form => {
      form.addEventListener('submit', validateCsrfToken);
    });
  }
  
  function generateCsrfToken() {
    return Math.random().toString(36).substr(2);
  }
  
  function validateCsrfToken(e) {
    const form = e.target;
    const formToken = form.querySelector('input[name="csrfToken"]').value;
    const storedToken = sessionStorage.getItem('csrfToken');
    
    if (!formToken || formToken !== storedToken) {
      e.preventDefault();
      alert('Security validation failed. Please refresh the page and try again.');
    }
  }
  
  // XSS Protection
  function protectAgainstXss() {
    // Find all elements that might contain user-generated content
    const userContentElements = document.querySelectorAll('[data-user-content]');
    userContentElements.forEach(element => {
      const rawContent = element.textContent;
      // Sanitize the content
      element.textContent = sanitizeInput(rawContent);
    });
  }
  
  function sanitizeInput(input) {
    if (!input) return '';
    
    // Basic sanitization - in a real app, use a library like DOMPurify
    return encodeURIComponent(input);
  }
  
  // Function to sanitize and display user input safely
  function displayUserContent(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
      // Sanitize content before displaying
      const sanitizedContent = sanitizeInput(content);
      element.textContent = decodeURIComponent(sanitizedContent);
    }
  }
  
  // Example of how to handle user input securely
  function handleUserInput(input) {
    // 1. Sanitize the input
    const sanitizedInput = sanitizeInput(input);
    
    // 2. Store sanitized input
    sessionStorage.setItem('userInput', sanitizedInput);
    
    // 3. Use the sanitized input
    return decodeURIComponent(sanitizedInput);
  }
  
  // Example of secure data encryption for sensitive data
  function encryptSensitiveData(data) {
    // In a real app, use a proper encryption library like CryptoJS
    // This is a simple obfuscation for demonstration purposes only
    const encoded = btoa(data);
    return encoded;
  }
  
  function decryptSensitiveData(encryptedData) {
    // Simple decoding for demonstration
    try {
      const decoded = atob(encryptedData);
      return decoded;
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  }
  
  // Example of storing sensitive data securely
  function storeUserEmail(email) {
    if (!email) return;
    
    // Encrypt before storing
    const encrypted = encryptSensitiveData(email);
    localStorage.setItem('userEmail', encrypted);
  }
  
  function getUserEmail() {
    const encrypted = localStorage.getItem('userEmail');
    if (!encrypted) return null;
    
    // Decrypt when retrieving
    return decryptSensitiveData(encrypted);
  }