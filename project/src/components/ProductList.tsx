import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

const PRODUCTS = [
  { id: '1', name: 'Laptop', price: 999.99, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=300' },
  { id: '2', name: 'Smartphone', price: 699.99, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=300' },
  { id: '3', name: 'Headphones', price: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300' },
];

interface ProductListProps {
  onAddToCart: (item: CartItem) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PRODUCTS.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
            <button
              onClick={() => onAddToCart({ ...product, quantity: 1 })}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};