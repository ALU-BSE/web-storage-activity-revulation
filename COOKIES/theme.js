// Task 2: Theme Preferences with Local Storage
document.addEventListener('DOMContentLoaded', () => {
    // Load and apply saved theme settings
    loadTheme();
    
    // Theme toggle button event listener
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
  });
  
  function loadTheme() {
    // Try to get theme from local storage
    try {
      const settingsStr = localStorage.getItem('userSettings');
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        applyTheme(settings.theme);
        updateToggleButtonText(settings.theme);
      } else {
        // Default to light theme if nothing is saved
        applyTheme('light');
        updateToggleButtonText('light');
        
        // Save default settings
        saveThemeSettings('light');
      }
    } catch (error) {
      console.error('Error loading theme from local storage:', error);
      // Handle local storage errors (e.g., exceeding size limit)
      applyTheme('light');
      updateToggleButtonText('light');
    }
  }
  
  function toggleTheme() {
    // Get current theme
    let currentSettings;
    try {
      const settingsStr = localStorage.getItem('userSettings');
      currentSettings = settingsStr ? JSON.parse(settingsStr) : { theme: 'light', fontSize: 16 };
    } catch (error) {
      console.error('Error reading theme settings:', error);
      currentSettings = { theme: 'light', fontSize: 16 };
    }
    
    // Toggle theme
    const newTheme = currentSettings.theme === 'dark' ? 'light' : 'dark';
    
    // Apply new theme
    applyTheme(newTheme);
    updateToggleButtonText(newTheme);
    
    // Save new theme
    saveThemeSettings(newTheme, currentSettings.fontSize);
  }
  
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
  
  function updateToggleButtonText(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
  }
  
  function saveThemeSettings(theme, fontSize = 16) {
    try {
      // Use a settings object to demonstrate JSON stringify/parse
      const settings = {
        theme: theme,
        fontSize: fontSize
      };
      
      localStorage.setItem('userSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving theme to local storage:', error);
      // Handle local storage errors
      alert('Could not save your theme preference. Your browser storage might be full.');
    }
  }