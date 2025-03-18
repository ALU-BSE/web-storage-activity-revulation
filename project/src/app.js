// Cart storage in sessionStorage
const CART_STORAGE_KEY = 'cart';

// Initialize cart in sessionStorage if it doesn't exist
if (!sessionStorage.getItem(CART_STORAGE_KEY)) {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
}

// Product data
const PRODUCTS = [
    {
        id: '1',
        name: 'Laptop',
        price: 999.99,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=300',
        description: 'Powerful laptop for all your computing needs'
    },
    {
        id: '2',
        name: 'Smartphone',
        price: 699.99,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=300',
        description: 'Latest smartphone with amazing features'
    },
    {
        id: '3',
        name: 'Headphones',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300',
        description: 'High-quality wireless headphones'
    }
];

// Cart management
const getCart = () => {
    const cart = sessionStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
};

const saveCart = (cart) => {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

const updateCartBadge = () => {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.toggle('hidden', totalItems === 0);
    }
};

const addToCart = (productId) => {
    const cart = getCart();
    const product = PRODUCTS.find(p => p.id === productId);
    
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartBadge();
    showToast('Item added to cart', 'success');
    renderCart();
};

const updateQuantity = (productId, change) => {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            const index = cart.indexOf(item);
            cart.splice(index, 1);
        }
    }
    
    saveCart(cart);
    updateCartBadge();
    renderCart();
};

const renderCart = () => {
    const cartContainer = document.getElementById('cartContainer');
    const cart = getCart();
    
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-gray-500">Your cart is empty</p>';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartContainer.innerHTML = `
        <div class="space-y-4">
            ${cart.map(item => `
                <div class="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 class="font-medium">${item.name}</h3>
                        <p class="text-gray-600">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <button onclick="updateQuantity('${item.id}', -1)" class="px-2 py-1 bg-gray-100 rounded">-</button>
                            <span class="w-8 text-center">${item.quantity}</span>
                            <button onclick="updateQuantity('${item.id}', 1)" class="px-2 py-1 bg-gray-100 rounded">+</button>
                        </div>
                    </div>
                </div>
            `).join('')}
            <div class="mt-6 pt-4 border-t">
                <div class="flex justify-between items-center">
                    <span class="font-semibold">Total:</span>
                    <span class="text-xl font-bold">$${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
};

// Render products
const renderProducts = () => {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    productGrid.innerHTML = PRODUCTS.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn btn-primary" onclick="addToCart('${product.id}')">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
};

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
    updateCartBadge();
});

// Make functions available globally
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;