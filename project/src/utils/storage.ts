import { CartItem, ThemeSettings, User } from '../types';

// Cookie utilities
export const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/; Secure; SameSite=Strict`;
};

export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';');
  const cookie = cookies.find(c => c.trim().startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1] : null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};

// Local Storage utilities
export const saveThemeSettings = (settings: ThemeSettings) => {
  localStorage.setItem('themeSettings', JSON.stringify(settings));
};

export const getThemeSettings = (): ThemeSettings => {
  const settings = localStorage.getItem('themeSettings');
  return settings ? JSON.parse(settings) : { theme: 'light', fontSize: 16 };
};

// Session Storage utilities
export const saveCart = (items: CartItem[]) => {
  sessionStorage.setItem('cart', JSON.stringify(items));
};

export const getCart = (): CartItem[] => {
  const cart = sessionStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

// Security utilities
export const sanitizeInput = (input: string): string => {
  return encodeURIComponent(input);
};

export const generateCSRFToken = (): string => {
  const token = Math.random().toString(36).substring(2);
  sessionStorage.setItem('csrfToken', token);
  return token;
};