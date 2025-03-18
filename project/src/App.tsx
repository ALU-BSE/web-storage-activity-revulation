import React, { useEffect, useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { ThemeToggle } from './components/ThemeToggle';
import { Cart } from './components/Cart';
import { ProductList } from './components/ProductList';
import { CartItem, ThemeSettings, User } from './types';
import {
  getCookie,
  deleteCookie,
  saveThemeSettings,
  getThemeSettings,
  saveCart,
  getCart
} from './utils/storage';
import { LogOut } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User>({ username: '', isAuthenticated: false });
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(getThemeSettings());
  const [cartItems, setCartItems] = useState<CartItem[]>(getCart());

  useEffect(() => {
    const authToken = getCookie('authToken');
    if (authToken) {
      setUser({ username: authToken, isAuthenticated: true });
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeSettings.theme === 'dark');
    saveThemeSettings(themeSettings);
  }, [themeSettings]);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const handleLogin = (username: string) => {
    setUser({ username, isAuthenticated: true });
  };

  const handleLogout = () => {
    deleteCookie('authToken');
    setUser({ username: '', isAuthenticated: false });
    setCartItems([]);
  };

  const handleThemeToggle = (newSettings: ThemeSettings) => {
    setThemeSettings(newSettings);
  };

  const handleAddToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, item];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className={`min-h-screen ${themeSettings.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">E-Commerce Demo</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle settings={themeSettings} onToggle={handleThemeToggle} />
            {user.isAuthenticated && (
              <div className="flex items-center gap-4">
                <span>Welcome, {user.username}!</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!user.isAuthenticated ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <LoginForm onLogin={handleLogin} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProductList onAddToCart={handleAddToCart} />
            </div>
            <div>
              <Cart
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;