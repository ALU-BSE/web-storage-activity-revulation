export interface User {
  username: string;
  isAuthenticated: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ThemeSettings {
  theme: 'light' | 'dark';
  fontSize: number;
}