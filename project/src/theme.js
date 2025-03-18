// Theme management
const THEME_STORAGE_KEY = 'theme';

const getTheme = () => localStorage.getItem(THEME_STORAGE_KEY) || 'light';

const setTheme = (theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
};

// Theme toggle handling
document.getElementById('themeToggle').addEventListener('click', () => {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// Initialize theme
window.addEventListener('DOMContentLoaded', () => {
    setTheme(getTheme());
});