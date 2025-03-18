// Task 3: Session-Specific Shopping Cart
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated before initializing cart
    if (document.getElementById('auth-check') && 
        document.getElementById('auth-check').dataset.authenticated === 'true') {
      // Load and display cart
      loadCart();
      
      // Add to cart buttons
      const addToCartButtons = document.querySelectorAll('.add-to-cart');
      addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
      });
      
      // Clear cart button
      const clearCartButton = document.getElementById('clear-cart');
      if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
      }
      
      // Checkout button
      const checkoutButton = document.getElementById('checkout-btn');
      if (checkoutButton) {
        checkoutButton.addEventListener('click', checkout);
      }
    }
  });
  
  function loadCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartItemsElement || !cartTotalElement) return;
    
    try {
      // Get cart from session storage
      const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
      
      if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p>Your cart is empty</p>';
        cartTotalElement.textContent = 'Total: $0.00';
        return;
      }
      
      // Calculate total
      let total = 0;
      let cartHTML = '';
      
      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        // Sanitize item name before rendering to prevent XSS
        const sanitizedName = encodeURIComponent(item.product);
        const decodedName = decodeURIComponent(sanitizedName);
        
        cartHTML += `
          <div class="cart-item">
            <div class="cart-item-image">
              <img src="/api/placeholder/50/50" alt="${decodedName}" />
            </div>
            <div class="cart-item-details">
              <div>${decodedName}</div>
              <div>$${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <div class="cart-item-controls">
              <span>$${itemTotal.toFixed(2)}</span>
              <button class="remove-item" data-index="${index}">x</button>
            </div>
          </div>
        `;
      });
      
      cartItemsElement.innerHTML = cartHTML;
      cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
      
      // Add event listeners to remove buttons
      const removeButtons = document.querySelectorAll('.remove-item');
      removeButtons.forEach(button => {
        button.addEventListener('click', removeCartItem);
      });
      
    } catch (error) {
      console.error('Error loading cart from session storage:', error);
      cartItemsElement.innerHTML = '<p>Error loading cart</p>';
    }
  }
  
  function addToCart(event) {
    try {
      const button = event.target;
      const product = button.dataset.product;
      const price = parseFloat(button.dataset.price);
      const image = button.dataset.image || null;
      
      // Get current cart or initialize new one
      const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
      
      // Check if product already exists in cart
      const existingItemIndex = cart.findIndex(item => item.product === product);
      
      if (existingItemIndex !== -1) {
        // Increment quantity if item exists
        cart[existingItemIndex].quantity += 1;
      } else {
        // Add new item to cart
        cart.push({
          product: product,
          price: price,
          quantity: 1,
          image: image
        });
      }
      
      // Save updated cart
      sessionStorage.setItem('cart', JSON.stringify(cart));
      
      // Update cart display
      loadCart();
      
      // Provide feedback
      showNotification(`Added ${product} to cart`);
      
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Could not add item to cart. Please try again.');
    }
  }
  
  function removeCartItem(event) {
    try {
      const index = parseInt(event.target.dataset.index);
      
      // Get current cart
      const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
      
      // Remove the item
      if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        
        // Save updated cart
        sessionStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart display
        loadCart();
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  }
  
  function clearCart() {
    try {
      // Clear cart in session storage
      sessionStorage.removeItem('cart');
      
      // Update cart display
      loadCart();
      
      showNotification('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }
  
  function checkout() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    alert('Thank you for your purchase! In a real app, you would proceed to payment.');
    clearCart();
  }
  
  function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Apply styles
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--primary-color)';
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
    }, 2000);
  }