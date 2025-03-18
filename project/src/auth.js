// User storage in localStorage
const USERS_STORAGE_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

// Initialize users array in localStorage if it doesn't exist
if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
}

// Auth utility functions
const getUsers = () => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
};

const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    const cookie = cookies.find(c => c.trim().startsWith(`${name}=`));
    return cookie ? cookie.split('=')[1] : null;
};

const deleteCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

// Show notification
const showToast = (message, type = 'success') => {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
};

// Auth state management
const updateAuthState = (user = null) => {
    const authForms = document.getElementById('authForms');
    const mainContent = document.getElementById('mainContent');
    const userControls = document.getElementById('userControls');
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (user) {
        authForms.classList.add('hidden');
        mainContent.classList.remove('hidden');
        userControls.classList.remove('hidden');
        welcomeMessage.textContent = `Welcome, ${user.name}!`;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        setCookie('authToken', user.email, 7);
    } else {
        authForms.classList.remove('hidden');
        mainContent.classList.add('hidden');
        userControls.classList.add('hidden');
        welcomeMessage.textContent = '';
        localStorage.removeItem(CURRENT_USER_KEY);
        deleteCookie('authToken');
    }
};

// Form switching
document.getElementById('showSignup').addEventListener('click', () => {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click', () => {
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
});

// Signup form handling
document.getElementById('signupFormElement').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        showToast('All fields are required', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    if (password.length < 8) {
        showToast('Password must be at least 8 characters long', 'error');
        return;
    }

    const users = getUsers();
    if (users.some(user => user.email === email)) {
        showToast('Email already registered', 'error');
        return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    saveUsers(users);
    
    showToast('Account created successfully!');
    updateAuthState(newUser);
    
    // Reset form
    this.reset();
});

// Login form handling
document.getElementById('loginFormElement').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showToast('Please enter both email and password', 'error');
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        showToast('Logged in successfully!');
        updateAuthState(user);
        this.reset();
    } else {
        showToast('Invalid email or password', 'error');
    }
});

// Logout handling
document.getElementById('logoutBtn').addEventListener('click', () => {
    updateAuthState(null);
    showToast('Logged out successfully!');
});

// Check for existing session
window.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    const authToken = getCookie('authToken');

    if (currentUser && authToken) {
        updateAuthState(JSON.parse(currentUser));
    }
});