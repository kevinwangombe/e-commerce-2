// Shopping Cart Functionality
class ShoppingCart {
  constructor() {
    this.cart = [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateCartUI();
  }

  setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    if (menuToggle && menu) {
      menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        // Toggle between ☰ and ✕
        menuToggle.textContent = menu.classList.contains('active') ? '✕' : '☰';
      });
    }

    // Cart button
    const cartBtn = document.querySelector('.cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.querySelector('.close-cart');

    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCart();
      });
    }

    if (closeCart) {
      closeCart.addEventListener('click', () => this.closeCart());
    }

    if (cartModal) {
      cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) this.closeCart();
      });
    }

    // Add to cart buttons
    document.querySelectorAll('.add-cart-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (card) {
          const product = {
            name: card.querySelector('.product-name').textContent,
            price: card.querySelector('.product-price').textContent,
            image: card.querySelector('img').src,
            quantity: 1,
          };
          this.addToCart(product);
        }
      });
    });

    // Hero CTA
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        document
          .getElementById('products')
          ?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('.menu a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          document.querySelector('.menu')?.classList.remove('active');
          document.querySelector('.menu-toggle')?.classList.remove('active');
          document.querySelector('.menu-toggle').textContent = '☰';
        }
      });
    });

    // Checkout
    document
      .querySelector('.checkout-btn')
      ?.addEventListener('click', () => this.checkout());
  }

  addToCart(product) {
    const existing = this.cart.find((item) => item.name === product.name);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ ...product });
    }
    this.updateCartUI();
    this.showNotification(`${product.name} added to cart!`);
  }

  removeFromCart(name) {
    this.cart = this.cart.filter((item) => item.name !== name);
    this.updateCartUI();
  }

  updateQuantity(name, qty) {
    const item = this.cart.find((i) => i.name === name);
    if (item) {
      if (qty <= 0) this.removeFromCart(name);
      else {
        item.quantity = qty;
        this.updateCartUI();
      }
    }
  }

  calculateTotal() {
    return this.cart.reduce((total, item) => {
      // Remove "KSh " and commas, then parse
      const price = parseFloat(
        item.price.replace('KSh ', '').replace(/,/g, ''),
      );
      return total + price * item.quantity;
    }, 0);
  }

  updateCartUI() {
    // Update count
    const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;

    // Update items
    const container = document.querySelector('.cart-items');
    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
      container.innerHTML = this.cart
        .map(
          (item) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price}</div>
                        <div class="cart-item-qty">
                            <button class="qty-btn" onclick="cart.updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="cart.updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
                            <button class="remove-btn" onclick="cart.removeFromCart('${item.name}')">Remove</button>
                        </div>
                    </div>
                </div>
            `,
        )
        .join('');
    }

    // Update total
    const totalEl = document.querySelector('.total-amount');
    if (totalEl) {
      const total = this.calculateTotal().toLocaleString();
      totalEl.textContent = `KSh ${total}`;
    }
  }

  openCart() {
    document.getElementById('cart-modal')?.classList.add('active');
  }

  closeCart() {
    document.getElementById('cart-modal')?.classList.remove('active');
  }

  showNotification(message) {
    const notif = document.querySelector('.notification');
    if (notif) {
      notif.textContent = message;
      notif.classList.add('show');
      setTimeout(() => notif.classList.remove('show'), 2500);
    }
  }

  checkout() {
    if (this.cart.length === 0) {
      this.showNotification('Your cart is empty!');
      return;
    }
    const total = this.calculateTotal().toLocaleString();
    alert(`Thank you for your order! Total: KSh ${total}`);
    this.cart = [];
    this.updateCartUI();
    this.closeCart();
  }
}

// Initialize cart
const cart = new ShoppingCart();
