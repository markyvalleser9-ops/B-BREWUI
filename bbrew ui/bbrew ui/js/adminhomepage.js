document.addEventListener('DOMContentLoaded', function() {
    // Initialize data
    function initializeData() {
        // Initialize custom categories
        let customCategories = JSON.parse(sessionStorage.getItem('bigbrewCustomCategories')) || [];
        sessionStorage.setItem('bigbrewCustomCategories', JSON.stringify(customCategories));

        const inventory = JSON.parse(sessionStorage.getItem('bigbrewInventory')) || [];
        const existingIds = inventory.map(item => item.id);
        let needsUpdate = false;
        
        const allItems = [
            // Milk Tea
            { id: 1, name: 'Wintermelon', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
            { id: 2, name: 'Matcha', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
            { id: 26, name: 'Dark Choco', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
            { id: 27, name: 'Okinawa', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
            { id: 28, name: 'Taro', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
            { id: 29, name: 'Red Velvet', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
            
            // Coffee
            { id: 3, name: 'Spanish Latte', category: 'Coffee', price: 39, stock: 20, unit: 'pcs' },
            
            // Fruit Tea
            { id: 4, name: 'Lychee', category: 'Fruit Tea', price: 29, stock: 20, unit: 'pcs' },
            
            // Praf
            { id: 5, name: 'Coffee Jelly', category: 'Praf', price: 49, stock: 20, unit: 'pcs' },
            { id: 6, name: 'Caramel Macchiato', category: 'Praf', price: 49, stock: 20, unit: 'pcs' },
            { id: 7, name: 'Mocha', category: 'Praf', price: 49, stock: 20, unit: 'pcs' },
            { id: 8, name: 'Vanilla Coffee', category: 'Praf', price: 49, stock: 20, unit: 'pcs' },
            { id: 9, name: 'Java Chip', category: 'Praf', price: 49, stock: 20, unit: 'pcs' },
            { id: 10, name: 'Cheesecake', category: 'Praf', price: 49, stock: 20, unit: 'pcs' },
            { id: 11, name: 'Cookies & Cream', category: 'Praf', price: 49, stock: 20, unit: 'pcs' },
            { id: 12, name: 'Creamy Avocado', category: 'Praf', price: 49, stock: 20, unit: 'pcs' },
            { id: 13, name: 'Chocolate', category: 'Praf', price: 49, stock: 20, unit: 'pcs' },
            { id: 14, name: 'Matcha', category: 'Praf', price: 49, stock: 20, unit: 'pcs' },
            { id: 15, name: 'Strawberry', category: 'Praf', price: 49, stock: 20, unit: 'pcs' },
            { id: 16, name: 'Taro', category: 'Praf', price: 49, stock: 20, unit: 'pcs' },
            
            // Brosty
            { id: 17, name: 'Lychee', category: 'Brosty', price: 49, stock: 20, unit: 'pcs' },
            { id: 18, name: 'Green Apple', category: 'Brosty', price: 49, stock: 20, unit: 'pcs' },
            { id: 19, name: 'Blueberry', category: 'Brosty', price: 49, stock: 20, unit: 'pcs' },
            { id: 20, name: 'Lemon', category: 'Brosty', price: 49, stock: 20, unit: 'pcs' },
            { id: 21, name: 'Strawberry', category: 'Brosty', price: 49, stock: 20, unit: 'pcs' },
            { id: 22, name: 'Kiwi', category: 'Brosty', price: 49, stock: 20, unit: 'pcs' },
            { id: 23, name: 'Mango', category: 'Brosty', price: 49, stock: 20, unit: 'pcs' },
            { id: 24, name: 'Honey Peach', category: 'Brosty', price: 49, stock: 20, unit: 'pcs' },
            
            // Add-ons
            { id: 25, name: 'Pearl', category: 'Toppings', price: 9, stock: 20, unit: 'pcs' }
        ];
        
        allItems.forEach(item => {
            if (!existingIds.includes(item.id)) {
                inventory.push(item);
                needsUpdate = true;
            }
        });
        
        if (needsUpdate || inventory.length === 0) {
            sessionStorage.setItem('bigbrewInventory', JSON.stringify(inventory));
        }
        
        // Initialize raw materials
        let rawMaterials = JSON.parse(sessionStorage.getItem('bigbrewRawMaterials')) || [];
        if (rawMaterials.length === 0) {
            rawMaterials = [
                { id: 1, name: 'Milk', price: 50, quantity: 1000, unit: 'ml' },
                { id: 2, name: 'Coffee Ground', price: 200, quantity: 500, unit: 'g' },
                { id: 3, name: 'Whip Cream', price: 80, quantity: 300, unit: 'ml' },
                { id: 4, name: 'Cups', price: 0.5, quantity: 100, unit: 'pcs' },
                { id: 5, name: 'Straws', price: 0.2, quantity: 200, unit: 'pcs' },
                { id: 6, name: 'Syrup', price: 120, quantity: 500, unit: 'ml' }
            ];
            sessionStorage.setItem('bigbrewRawMaterials', JSON.stringify(rawMaterials));
        }
    }
    
    // Global variables
    let cart = [];
    let orderHistory = JSON.parse(sessionStorage.getItem('bigbrewOrderHistory')) || [];
    let lastOrderNumber = parseInt(sessionStorage.getItem('bigbrewLastOrderNumber')) || 0;
    let salesChart = null;
    let currentManageOrderFilter = 'preparing'; // Changed from 'pending' to 'preparing'
    let selectedOrder = null;
    let deleteCallback = null;
    
    // DOM Elements
    const navItems = document.querySelectorAll('.nav-item');
    const categoryTabs = document.getElementById('categoryTabs');
    const cartSection = document.getElementById('cartSection');
    const floatingCart = document.getElementById('floatingCart');
    const orderDetailsPanel = document.getElementById('orderDetailsPanel');
    const panelContent = document.getElementById('panelContent');
    const panelFooter = document.getElementById('panelFooter');
    const closePanelBtn = document.getElementById('closePanelBtn');
    
    // Initialize
    initializeData();
    loadCustomCategoriesOnStartup();
    loadMenuItems();
    updateCart();
    
    // Initialize tab listeners on page load
    attachTabListeners();
    
    // Function to load custom categories on page load
    function loadCustomCategoriesOnStartup() {
        const customCategories = JSON.parse(sessionStorage.getItem('bigbrewCustomCategories')) || [];
        customCategories.forEach(categoryName => {
            addCategoryToUI(categoryName);
        });
        updateProductCategoryDropdown();
    }

    // Function to add a category to the UI
    function addCategoryToUI(categoryName) {
        const slug = slugify(categoryName);
        const emoji = '☕';
        
        // Get the custom categories from sessionStorage to determine color index
        const customCategories = JSON.parse(sessionStorage.getItem('bigbrewCustomCategories')) || [];

        // 1. Create and insert the new tab button
        const newTabBtn = document.createElement('button');
        newTabBtn.className = 'tab-btn';
        newTabBtn.setAttribute('data-category', slug);
        newTabBtn.textContent = `${emoji} ${categoryName}`;
        
        const addOnsTab = document.querySelector('.tab-btn[data-category="add-ons"]');
        const tabsContainer = document.querySelector('.tabs-container');
        tabsContainer.insertBefore(newTabBtn, addOnsTab);

        // 2. Create and insert the new menu content section
        const newMenuContent = document.createElement('div');
        newMenuContent.className = 'menu-content';
        newMenuContent.id = slug;
        
        // Add click event to category header for color change
        const newHeader = document.createElement('div');
        newHeader.className = `category-header ${slug}-header dynamic-category`;
        
        // Assign a color from predefined colors - FIXED VERSION
        const colorIndex = (customCategories.indexOf(categoryName) % 6) + 1;
        newHeader.style.setProperty('--category-color', `var(--category-color-${colorIndex})`);
        
        newHeader.innerHTML = `
            <div class="header-content">
                <h2 class="content-title">${emoji} ${categoryName}</h2>
                <div class="price-info">₱29 / ₱39</div>
            </div>
        `;
        newMenuContent.appendChild(newHeader);

        const newItemsContainer = document.createElement('div');
        newItemsContainer.className = 'menu-items';
        newMenuContent.appendChild(newItemsContainer);

        const addOnsContent = document.getElementById('add-ons');
        addOnsContent.parentNode.insertBefore(newMenuContent, addOnsContent);
        
        // 3. Re-attach tab listeners to include the new tab
        attachTabListeners();
        
        // 4. Load menu items for the new category
        loadMenuItemsForCategory(slug, categoryName);
    }
    
    // Helper to create a URL-friendly slug from a string
    function slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (!page) return;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.page-content, .menu-content').forEach(content => {
                content.classList.remove('active');
            });
            
            if (page === 'menu') {
                document.getElementById('milktea').classList.add('active');
                document.querySelector('.tab-btn[data-category="milktea"]').classList.add('active');
                categoryTabs.style.display = 'flex';
                cartSection.classList.remove('collapsed');
                cartSection.classList.add('expanded');
                floatingCart.classList.remove('visible');
                
                // Load items for all categories when menu is opened
                loadAllMenuItems();
            } else {
                categoryTabs.style.display = 'none';
                const pageElement = document.getElementById(page);
                if (pageElement) {
                    pageElement.classList.add('active');
                    cartSection.classList.remove('expanded');
                    cartSection.classList.add('collapsed');
                    floatingCart.classList.add('visible');
                    
                    // Update product category dropdown when 'create-product' page is opened
                    if (page === 'create-product') {
                        updateProductCategoryDropdown();
                    }
                    
                    const pageLoaders = {
                        'order-history': loadOrderHistory,
                        'products': loadInventory,
                        'users': loadUsers,
                        'sales-report': initializeSalesReport,
                        'manage-orders': loadManageOrders,
                        'raw-materials': loadRawMaterials
                    };
                    
                    if (pageLoaders[page]) pageLoaders[page]();
                }
            }
        });
    });
    
    // Tab functionality - FIXED VERSION
    function attachTabListeners() {
        // Use event delegation for dynamically created tabs
        categoryTabs.addEventListener('click', function(e) {
            if (e.target.classList.contains('tab-btn')) {
                const category = e.target.getAttribute('data-category');
                
                // Update active states
                document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
                e.target.classList.add('active');
                
                // Show corresponding content
                document.querySelectorAll('.menu-content').forEach(content => {
                    content.classList.remove('active');
                    if (content.id === category) {
                        content.classList.add('active');
                        
                        // Load items for this category if it's a custom category
                        const customCategories = JSON.parse(sessionStorage.getItem('bigbrewCustomCategories')) || [];
                        const customCategory = customCategories.find(cat => slugify(cat) === category);
                        
                        if (customCategory) {
                            loadMenuItemsForCategory(category, customCategory);
                        }
                    }
                });
            }
        });
    }
    
    // Helper function to get display name for category
    function getCategoryDisplayName(categoryId) {
        const categoryMap = {
            'milktea': 'Milk Tea',
            'coffee': 'Coffee',
            'fruit-tea': 'Fruit Tea',
            'brosty': 'Brosty',
            'praf': 'Praf',
            'add-ons': 'Toppings'
        };
        return categoryMap[categoryId] || categoryId;
    }
    
    // Floating cart
    floatingCart.addEventListener('click', function() {
        cartSection.classList.remove('collapsed');
        cartSection.classList.add('expanded');
        floatingCart.classList.remove('visible');
    });
    
    // Add to cart
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const menuItem = e.target.closest('.menu-item');
            const name = menuItem.getAttribute('data-name');
            const size = e.target.getAttribute('data-size');
            
            // Determine category
            let category = 'Toppings';
            const activeMenuContent = document.querySelector('.menu-content.active');
            if (activeMenuContent) {
                const categoryId = activeMenuContent.id;
                const categoryMap = {
                    'milktea': 'Milk Tea',
                    'coffee': 'Coffee',
                    'fruit-tea': 'Fruit Tea',
                    'brosty': 'Brosty',
                    'praf': 'Praf',
                    'add-ons': 'Toppings'
                };
                // Check for custom categories
                const customCategories = JSON.parse(sessionStorage.getItem('bigbrewCustomCategories')) || [];
                const customCategory = customCategories.find(cat => slugify(cat) === categoryId);
                category = customCategory || categoryMap[categoryId] || 'Toppings';
            }
            
            let price = parseInt(menuItem.getAttribute(`data-price-${size}`) || 
                                       menuItem.getAttribute('data-price') || 9);
            
            const inventory = getInventoryItem(name);
            if (inventory && inventory.stock <= 0) {
                showMessage(`${name} is out of stock!`, 'error');
                return;
            }
            
            const existingItem = cart.find(item => item.name === name && item.size === size && item.category === category);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, size, price, quantity: 1, category });
            }
            
            updateCart();
            
            // Visual feedback
            const originalText = e.target.textContent;
            e.target.textContent = 'Added!';
            e.target.style.backgroundColor = '#4CAF50';
            setTimeout(() => {
                e.target.textContent = originalText;
                e.target.style.backgroundColor = '';
            }, 1000);
        }
    });
    
    // Update cart
    function updateCart() {
        const cartItems = document.getElementById('cartItems');
        const totalPriceElement = document.getElementById('totalPrice');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const cartBadge = document.getElementById('cartBadge');
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            checkoutBtn.disabled = true;
            cartBadge.textContent = '0';
        } else {
            cartItems.innerHTML = '';
            let total = 0;
            let itemCount = 0;
            
            cart.forEach((item, index) => {
                const sizeText = item.size === 'medio' ? 'Medio' : 
                                item.size === 'grande' ? 'Grande' : 
                                item.size === 'hot' ? 'Hot' : 
                                item.size === 'regular' ? 'Add-on' : 
                                `Iced ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-size">${sizeText}</div>
                    </div>
                    <div class="item-price">₱${item.price}</div>
                    <div class="item-quantity">
                        <button class="quantity-btn"><i class="fas fa-minus"></i></button>
                        <div class="quantity-value">${item.quantity}</div>
                        <button class="quantity-btn"><i class="fas fa-plus"></i></button>
                        <button class="remove-btn"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                
                cartItems.appendChild(cartItem);
                
                total += item.price * item.quantity;
                itemCount += item.quantity;
                
                // Add event listeners
                cartItem.querySelector('.fa-minus').parentElement.addEventListener('click', () => {
                    if (item.quantity > 1) {
                        item.quantity--;
                        updateCart();
                    }
                });
                
                cartItem.querySelector('.fa-plus').parentElement.addEventListener('click', () => {
                    item.quantity++;
                    updateCart();
                });
                
                cartItem.querySelector('.fa-trash').parentElement.addEventListener('click', () => {
                    cart.splice(index, 1);
                    updateCart();
                });
            });
            
            totalPriceElement.textContent = `₱${total}`;
            checkoutBtn.disabled = false;
            cartBadge.textContent = itemCount;
        }
    }
    
    // Checkout
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        if (cart.length === 0) return;
        
        const total = parseInt(document.getElementById('totalPrice').textContent.replace('₱', ''));
        
        // Check stock
        let outOfStockItems = [];
        cart.forEach(item => {
            const inventory = getInventoryItem(item.name);
            if (inventory && inventory.stock < item.quantity) {
                outOfStockItems.push(item.name);
            }
        });
        
        if (outOfStockItems.length > 0) {
            showMessage(`The following items are out of stock: ${outOfStockItems.join(', ')}`, 'error');
            return;
        }
        
        // Generate order summary
        const orderSummary = document.getElementById('orderSummary');
        orderSummary.innerHTML = '';
        let orderTotal = 0;
        
        cart.forEach(item => {
            const sizeText = item.size === 'medio' ? 'Medio' : 
                            item.size === 'grande' ? 'Grande' : 
                            item.size === 'hot' ? 'Hot' : 
                            item.size === 'regular' ? 'Add-on' : 
                            `Iced ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`;
            
            orderSummary.innerHTML += `
                <div class="order-item">
                    <div>${item.name} (${sizeText}) x${item.quantity}</div>
                    <div>₱${item.price * item.quantity}</div>
                </div>
            `;
            orderTotal += item.price * item.quantity;
        });
        
        document.getElementById('totalAmount').textContent = `₱${orderTotal}`;
        
        // Generate order number
        lastOrderNumber++;
        const formattedOrderNumber = lastOrderNumber.toString().padStart(2, '0');
        document.getElementById('orderNumber').textContent = formattedOrderNumber;
        document.getElementById('checkoutBtn').setAttribute('data-order-number', formattedOrderNumber);
        sessionStorage.setItem('bigbrewLastOrderNumber', lastOrderNumber.toString());
        
        // Reset payment mode to cash by default
        document.querySelector('input[name="paymentMode"][value="cash"]').checked = true;
        togglePaymentMode('cash');
        
        // Reset payment inputs
        document.getElementById('modalCashAmount').value = '';
        document.getElementById('gcashAmount').value = '';
        document.getElementById('gcashReference').value = '';
        document.getElementById('modalChangeAmount').textContent = '₱0';
        
        document.getElementById('checkoutModal').classList.add('active');
    });
    
    // Payment mode toggle
    document.querySelectorAll('input[name="paymentMode"]').forEach(radio => {
        radio.addEventListener('change', function() {
            togglePaymentMode(this.value);
        });
    });
    
    function togglePaymentMode(mode) {
        const cashSection = document.getElementById('cashPaymentSection');
        const gcashSection = document.getElementById('gcashPaymentSection');
        
        if (mode === 'cash') {
            cashSection.style.display = 'block';
            gcashSection.style.display = 'none';
        } else {
            cashSection.style.display = 'none';
            gcashSection.style.display = 'block';
        }
    }
    
    // Cash amount input change
    document.getElementById('modalCashAmount').addEventListener('input', function() {
        const total = parseInt(document.getElementById('totalAmount').textContent.replace('₱', '')) || 0;
        const cash = parseInt(this.value) || 0;
        const changeAmount = document.getElementById('modalChangeAmount');
        
        if (cash > 0) {
            const change = cash - total;
            if (cash >= total) {
                changeAmount.textContent = `₱${change}`;
                changeAmount.style.color = 'var(--success-green)';
                document.getElementById('confirmBtn').disabled = false;
            } else {
                changeAmount.textContent = `₱${Math.abs(change)} (Insufficient)`;
                changeAmount.style.color = 'var(--error-red)';
                document.getElementById('confirmBtn').disabled = true;
            }
        } else {
            changeAmount.textContent = '₱0';
            changeAmount.style.color = 'var(--success-green)';
            document.getElementById('confirmBtn').disabled = true;
        }
    });
    
    // GCash amount input change
    document.getElementById('gcashAmount').addEventListener('input', function() {
        const total = parseInt(document.getElementById('totalAmount').textContent.replace('₱', '')) || 0;
        const amount = parseInt(this.value) || 0;
        const reference = document.getElementById('gcashReference').value.trim();
        
        if (amount >= total && reference) {
            document.getElementById('confirmBtn').disabled = false;
        } else {
            document.getElementById('confirmBtn').disabled = true;
        }
    });
    
    // GCash reference input change
    document.getElementById('gcashReference').addEventListener('input', function() {
        const total = parseInt(document.getElementById('totalAmount').textContent.replace('₱', '')) || 0;
        const amount = parseInt(document.getElementById('gcashAmount').value) || 0;
        const reference = this.value.trim();
        
        if (amount >= total && reference) {
            document.getElementById('confirmBtn').disabled = false;
        } else {
            document.getElementById('confirmBtn').disabled = true;
        }
    });
    
    // Confirm checkout
    document.getElementById('confirmBtn').addEventListener('click', function() {
        document.getElementById('checkoutModal').classList.remove('active');
        
        // Update inventory
        cart.forEach(item => {
            updateInventoryStock(item.name, item.quantity);
        });
        
        // Get payment details
        const paymentMode = document.querySelector('input[name="paymentMode"]:checked').value;
        let paymentDetails = {};
        
        if (paymentMode === 'cash') {
            const cash = parseInt(document.getElementById('modalCashAmount').value) || 0;
            const total = parseInt(document.getElementById('totalAmount').textContent.replace('₱', ''));
            const change = cash - total;
            
            paymentDetails = {
                mode: 'Cash',
                amount: cash,
                change: change,
                reference: null
            };
        } else {
            const amount = parseInt(document.getElementById('gcashAmount').value) || 0;
            const reference = document.getElementById('gcashReference').value.trim();
            
            paymentDetails = {
                mode: 'GCash',
                amount: amount,
                change: 0,
                reference: reference
            };
        }
        
        // Save order
        const orderNumber = document.getElementById('checkoutBtn').getAttribute('data-order-number');
        const orderDate = new Date();
        const orderTotal = document.getElementById('totalAmount').textContent;
        
        const order = {
            orderNumber,
            date: orderDate.toISOString(),
            items: [...cart],
            total: orderTotal,
            payment: paymentDetails,
            status: 'Preparing' // Changed from 'Pending' to 'Preparing'
        };
        
        orderHistory.push(order);
        sessionStorage.setItem('bigbrewOrderHistory', JSON.stringify(orderHistory));
        
        // Generate receipt
        generateReceiptContent(orderNumber, orderDate, cart, orderTotal, paymentDetails);
        document.getElementById('receiptModal').classList.add('active');
        
        // Clear cart
        cart = [];
        updateCart();

        // Refresh manage orders if it's the active page
        if (document.getElementById('manage-orders').classList.contains('active')) {
            loadManageOrders();
        }
    });
    
    // Cancel checkout
    document.getElementById('cancelBtn').addEventListener('click', function() {
        document.getElementById('checkoutModal').classList.remove('active');
    });
    
    // Receipt functionality
    document.getElementById('orderAgainBtn').addEventListener('click', function() {
        document.getElementById('receiptModal').classList.remove('active');
    });
    
    document.getElementById('printReceiptBtn').addEventListener('click', function() {
        window.print();
    });
    
    document.getElementById('downloadReceiptBtn').addEventListener('click', function() {
        generateReceiptPDF();
    });
    
    // Generate receipt content
    function generateReceiptContent(orderNumber, orderDate, items, total, paymentDetails) {
        const receiptContent = document.getElementById('receiptContent');
        
        let itemsHtml = '';
        items.forEach(item => {
            const sizeText = item.size === 'medio' ? 'Medio' : 
                            item.size === 'grande' ? 'Grande' : 
                            item.size === 'hot' ? 'Hot' : 
                            item.size === 'regular' ? 'Add-on' : 
                            `Iced ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`;
            
            itemsHtml += `
                <div class="receipt-item">
                    <div class="receipt-item-qty">${item.quantity}</div>
                    <div class="receipt-item-name">
                        <div class="item-name">${item.name}</div>
                        <div class="item-size">${sizeText}</div>
                    </div>
                    <div class="receipt-item-price">₱${item.price * item.quantity}</div>
                </div>
            `;
        });
        
        let subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = Math.round(subtotal * 0.12);
        
        receiptContent.innerHTML = `
            <div class="receipt-header">
                <div class="receipt-logo">
                    <img src="logo.png" alt="BIGBREW Logo">
                    <div class="receipt-title">BIGBREW</div>
                    <div class="receipt-subtitle">Your Favorite Milk Tea Shop</div>
                    <div class="receipt-address">123 Milk Tea Street, Tea City</div>
                </div>
                <div class="receipt-details">
                    <div class="receipt-number">Order #${orderNumber}</div>
                    <div class="receipt-date">${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}</div>
                </div>
            </div>
            <div class="receipt-items">${itemsHtml}</div>
            <div class="receipt-summary">
                <div class="receipt-summary-row">
                    <div>Subtotal</div>
                    <div>₱${subtotal}</div>
                </div>
                <div class="receipt-summary-row">
                    <div>Tax (12%)</div>
                    <div>₱${tax}</div>
                </div>
                <div class="receipt-summary-row total">
                    <div>Total</div>
                    <div class="receipt-total-amount">${total}</div>
                </div>
            </div>
            <div class="receipt-payment-info">
                <div class="receipt-payment-row">
                    <div>Payment Mode:</div>
                    <div class="receipt-payment-mode ${paymentDetails.mode.toLowerCase()}">
                        ${paymentDetails.mode === 'Cash' ? 
                            '<i class="fas fa-money-bill-wave"></i> Cash' : 
                            '<i class="fas fa-mobile-alt"></i> GCash'}
                    </div>
                </div>
                <div class="receipt-payment-row">
                    <div>Amount Paid:</div>
                    <div>₱${paymentDetails.amount}</div>
                </div>
                ${paymentDetails.mode === 'Cash' ? 
                    `<div class="receipt-payment-row">
                        <div>Change:</div>
                        <div>₱${paymentDetails.change}</div>
                    </div>` : 
                    `<div class="receipt-payment-row">
                        <div>Reference No:</div>
                        <div>${paymentDetails.reference}</div>
                    </div>`
                }
            </div>
            <div class="receipt-footer">
                <div class="receipt-thank-you">Thank you for your purchase!</div>
                <div class="receipt-visit-again">Please visit us again</div>
                <div class="receipt-contact">Follow us @bigbrewph</div>
            </div>
        `;
    }
    
    // Generate receipt PDF
    function generateReceiptPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const orderNumber = document.querySelector('#receiptContent .receipt-number').textContent;
        const orderDate = document.querySelector('#receiptContent .receipt-date').textContent;
        const paymentMode = document.querySelector('.receipt-payment-mode').textContent.trim();
        const amountPaid = document.querySelectorAll('.receipt-payment-row')[1].querySelector('div:last-child').textContent;
        
        doc.setFont('courier');
        doc.setFontSize(18);
        doc.text('BIGBREW', 105, 15, { align: 'center' });
        
        doc.setFontSize(10);
        doc.text('Your Favorite Milk Tea Shop', 105, 22, { align: 'center' });
        doc.text('123 Milk Tea Street, Tea City', 105, 28, { align: 'center' });
        doc.text(orderNumber, 20, 40);
        doc.text(orderDate, 20, 46);
        
        doc.setLineWidth(0.2);
        doc.line(15, 52, 195, 52);
        
        doc.text('QTY', 20, 60);
        doc.text('ITEM', 40, 60);
        doc.text('PRICE', 170, 60, { align: 'right' });
        
        doc.setLineWidth(0.1);
        doc.line(15, 63, 195, 63);
        
        let yPosition = 70;
        const receiptItems = document.querySelectorAll('#receiptContent .receipt-item');
        
        receiptItems.forEach(item => {
            const qty = item.querySelector('.receipt-item-qty').textContent;
            const name = item.querySelector('.item-name').textContent;
            const size = item.querySelector('.item-size').textContent;
            const price = item.querySelector('.receipt-item-price').textContent;
            
            doc.text(qty, 20, yPosition);
            doc.text(`${name} (${size})`, 40, yPosition);
            doc.text(price, 170, yPosition, { align: 'right' });
            yPosition += 8;
        });
        
        doc.setLineWidth(0.2);
        doc.line(15, yPosition, 195, yPosition);
        yPosition += 8;
        
        const summaryRows = document.querySelectorAll('#receiptContent .receipt-summary-row');
        summaryRows.forEach(row => {
            const label = row.querySelector('div:first-child').textContent;
            const value = row.querySelector('div:last-child').textContent;
            
            if (row.classList.contains('total')) {
                doc.setFontSize(12);
                doc.setFont('courier', 'bold');
            } else {
                doc.setFontSize(10);
                doc.setFont('courier', 'normal');
            }
            
            doc.text(label, 25, yPosition);
            doc.text(value, 170, yPosition, { align: 'right' });
            yPosition += 8;
        });
        
        // Add payment information
        doc.setLineWidth(0.1);
        doc.line(15, yPosition, 195, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('courier', 'normal');
        
        doc.text('Payment Mode:', 25, yPosition);
        doc.text(paymentMode, 170, yPosition, { align: 'right' });
        yPosition += 6;
        
        doc.text('Amount Paid:', 25, yPosition);
        doc.text(amountPaid, 170, yPosition, { align: 'right' });
        yPosition += 6;
        
        if (paymentMode === 'Cash') {
            const changeAmount = document.querySelectorAll('.receipt-payment-row')[2].querySelector('div:last-child').textContent;
            doc.text('Change:', 25, yPosition);
            doc.text(changeAmount, 170, yPosition, { align: 'right' });
        } else {
            const referenceNo = document.querySelectorAll('.receipt-payment-row')[2].querySelector('div:last-child').textContent;
            doc.text('Reference No:', 25, yPosition);
            doc.text(referenceNo, 170, yPosition, { align: 'right' });
        }
        
        doc.save(`BIGBREW_Receipt_${orderNumber.replace('Order #', '')}.pdf`);
    }
    
    // Sales Report
    function initializeSalesReport() {
        generateSalesReport();
    }
    
    document.getElementById('refreshReportBtn').addEventListener('click', generateSalesReport);
    document.getElementById('reportPeriod').addEventListener('change', generateSalesReport);
    
    function generateSalesReport() {
        const period = document.getElementById('reportPeriod').value;
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        let filteredOrders = [...orderHistory];
        
        // Filter orders based on the selected period
        switch (period) {
            case 'today':
                const todayStart = new Date(today);
                todayStart.setHours(0, 0, 0, 0);
                filteredOrders = orderHistory.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= todayStart && orderDate <= today;
                });
                break;
            case '7days':
                const sevenDaysAgo = new Date(today);
                sevenDaysAgo.setDate(today.getDate() - 7);
                sevenDaysAgo.setHours(0, 0, 0, 0);
                filteredOrders = orderHistory.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= sevenDaysAgo && orderDate <= today;
                });
                break;
            case '30days':
                const thirtyDaysAgo = new Date(today);
                thirtyDaysAgo.setDate(today.getDate() - 30);
                thirtyDaysAgo.setHours(0, 0, 0, 0);
                filteredOrders = orderHistory.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= thirtyDaysAgo && orderDate <= today;
                });
                break;
            case 'all':
            default:
                // No filtering needed, use all orders
                break;
        }
        
        // Only include orders marked as "Done" in sales report
        filteredOrders = filteredOrders.filter(order => order.status === 'Prepared');
        
        // Calculate sales by category
        const categorySales = {
            'Milk Tea': 0,
            'Coffee': 0,
            'Fruit Tea': 0,
            'Brosty': 0,
            'Praf': 0
        };
        
        // Include custom categories in sales report
        const customCategories = JSON.parse(sessionStorage.getItem('bigbrewCustomCategories')) || [];
        customCategories.forEach(cat => categorySales[cat] = 0);

        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                if (item.category && categorySales.hasOwnProperty(item.category)) {
                    categorySales[item.category] += item.price * item.quantity;
                }
            });
        });
        
        const labels = Object.keys(categorySales);
        const data = Object.values(categorySales);
        
        const maxSales = Math.max(...data, 0);
        const bestSellerIndex = data.indexOf(maxSales);
        const bestSeller = labels[bestSellerIndex] || '-';
        
        const totalSales = data.reduce((sum, val) => sum + val, 0);
        const totalOrders = filteredOrders.length;
        
        document.getElementById('totalSales').textContent = `₱${totalSales}`;
        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('bestSeller').textContent = bestSeller;
        
        // Create chart
        const ctx = document.getElementById('salesChart').getContext('2d');
        
        if (salesChart) {
            salesChart.destroy();
        }
        
        salesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sales (₱)',
                    data: data,
                    backgroundColor: [
                        'rgba(210, 125, 45, 0.5)',
                        'rgba(139, 69, 19, 0.5)',
                        'rgba(255, 99, 71, 0.5)',
                        'rgba(135, 206, 235, 0.5)',
                        'rgba(255, 182, 193, 0.5)'
                    ],
                    borderColor: [
                        'rgba(210, 125, 45, 1)',
                        'rgba(139, 69, 19, 1)',
                        'rgba(255, 99, 71, 1)',
                        'rgba(135, 206, 235, 1)',
                        'rgba(255, 182, 193, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₱' + value;
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Sales: ₱' + context.parsed.y;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Users Management
    function loadUsers() {
        const users = JSON.parse(sessionStorage.getItem('bigbrewCashierAccounts')) || [];
        const usersGrid = document.getElementById('usersGrid');
        
        if (users.length === 0) {
            usersGrid.innerHTML = '<div class="empty-state"><i class="fas fa-users"></i><p>No users found</p></div>';
            return;
        }
        
        usersGrid.innerHTML = '';
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <div class="user-actions">
                    <button class="edit-user-btn" data-id="${user.username}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-user-btn" data-id="${user.username}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <h4>${user.name}</h4>
                <p><strong>Username:</strong> <span class="username">${user.username}</span></p>
                <p><strong>Age:</strong> ${user.age}</p>
                <p><strong>Gender:</strong> ${user.gender}</p>
            `;
            usersGrid.appendChild(userCard);
        });
        
        document.querySelectorAll('.edit-user-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const username = this.getAttribute('data-id');
                openEditUserModal(username);
            });
        });
        
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const username = this.getAttribute('data-id');
                showDeleteConfirm(`user ${username}`, () => deleteUser(username));
            });
        });
    }
    
    function openEditUserModal(username) {
        const users = JSON.parse(sessionStorage.getItem('bigbrewCashierAccounts')) || [];
        const user = users.find(u => u.username === username);
        
        if (!user) return;
        
        document.getElementById('editUserName').value = user.name;
        document.getElementById('editUserAge').value = user.age;
        document.querySelector(`input[name="editGender"][value="${user.gender}"]`).checked = true;
        document.getElementById('editUserUsername').value = user.username;
        document.getElementById('editUserPassword').value = '';
        
        document.getElementById('editUserMessage').className = 'message';
        document.getElementById('editUserModal').classList.add('active');
    }
    
    document.getElementById('saveEditUserBtn').addEventListener('click', function() {
        const users = JSON.parse(sessionStorage.getItem('bigbrewCashierAccounts')) || [];
        const userIndex = users.findIndex(u => u.username === document.getElementById('editUserUsername').value.trim());
        
        if (userIndex === -1) return;
        
        users[userIndex] = {
            ...users[userIndex],
            name: document.getElementById('editUserName').value.trim(),
            age: parseInt(document.getElementById('editUserAge').value),
            gender: document.querySelector('input[name="editGender"]:checked').value,
            username: document.getElementById('editUserUsername').value.trim(),
            password: document.getElementById('editUserPassword').value || users[userIndex].password
        };
        
        sessionStorage.setItem('bigbrewCashierAccounts', JSON.stringify(users));
        
        document.getElementById('editUserMessage').textContent = 'User updated successfully!';
        document.getElementById('editUserMessage').className = 'message success';
        
        setTimeout(() => {
            document.getElementById('editUserModal').classList.remove('active');
            loadUsers();
        }, 1500);
    });
    
    document.getElementById('cancelEditUserBtn').addEventListener('click', function() {
        document.getElementById('editUserModal').classList.remove('active');
    });
    
    function deleteUser(username) {
        const users = JSON.parse(sessionStorage.getItem('bigbrewCashierAccounts')) || [];
        const updatedUsers = users.filter(u => u.username !== username);
        sessionStorage.setItem('bigbrewCashierAccounts', JSON.stringify(updatedUsers));
        loadUsers();
    }
    
    // Order History - IMPROVED VERSION
    function loadOrderHistory(filterDate = null, orderId = null) {
        let filteredOrders = [...orderHistory];
        
        filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (filterDate) {
            const filterDateObj = new Date(filterDate);
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate.toDateString() === filterDateObj.toDateString();
            });
        }
        
        if (orderId) {
            filteredOrders = filteredOrders.filter(order => 
                order.orderNumber.toLowerCase().includes(orderId.toLowerCase())
            );
        }
        
        const historyList = document.getElementById('historyList');
        
        if (filteredOrders.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <p>No orders found</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = '';
        
        filteredOrders.forEach(order => {
            const orderDate = new Date(order.date);
            const formattedDate = orderDate.toLocaleDateString();
            const formattedTime = orderDate.toLocaleTimeString();
            
            let itemsHtml = '';
            order.items.forEach(item => {
                const sizeText = item.size === 'medio' ? 'Medio' : 
                                item.size === 'grande' ? 'Grande' : 
                                item.size === 'hot' ? 'Hot' : 
                                item.size === 'regular' ? 'Add-on' : 
                                `Iced ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`;
                
                itemsHtml += `<span class="order-item-tag">${item.name} (${sizeText}) x${item.quantity}</span>`;
            });
            
            const statusBadgeHtml = `<span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>`;
            
            const paymentModeHtml = `<span class="payment-mode-badge payment-mode-${order.payment.mode.toLowerCase()}">
                ${order.payment.mode === 'Cash' ? 
                    '<i class="fas fa-money-bill-wave"></i> Cash' : 
                    '<i class="fas fa-mobile-alt"></i> GCash'}
            </span>`;
            
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.setAttribute('data-order-number', order.orderNumber);
            historyItem.innerHTML = `
                <div class="history-header">
                    <div class="order-number">Order #${order.orderNumber}</div>
                    <div class="order-date">${formattedDate} ${formattedTime}</div>
                </div>
                <div class="order-items">${itemsHtml}</div>
                <div class="order-total">
                    <span>Total: ${order.total}</span>
                    ${statusBadgeHtml}
                </div>
                <div class="order-payment">
                    <span>${paymentModeHtml}</span>
                </div>
            `;
            
            // Add click event to show order details
            historyItem.addEventListener('click', function() {
                showOrderDetailsModal(order);
            });
            
            historyList.appendChild(historyItem);
        });
    }
    
    // NEW: Function to show order details in a modal
    function showOrderDetailsModal(order) {
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString();
        const formattedTime = orderDate.toLocaleTimeString();
        
        let itemsHtml = '';
        order.items.forEach(item => {
            const sizeText = item.size === 'medio' ? 'Medio' : 
                            item.size === 'grande' ? 'Grande' : 
                            item.size === 'hot' ? 'Hot' : 
                            item.size === 'regular' ? 'Add-on' : 
                            `Iced ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`;
            
            itemsHtml += `
                <div class="order-details-item">
                    <div class="order-details-item-name">
                        ${item.name}
                        <span class="order-details-item-size">(${sizeText})</span>
                        <span class="order-details-item-qty">x${item.quantity}</span>
                    </div>
                    <div class="order-details-item-price">₱${item.price * item.quantity}</div>
                </div>
            `;
        });
        
        const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = Math.round(subtotal * 0.12);
        
        document.getElementById('orderDetailsContent').innerHTML = `
            <div class="order-details-header">
                <div class="order-details-number">Order #${order.orderNumber}</div>
                <div class="order-details-date">${formattedDate} ${formattedTime}</div>
            </div>
            <div class="order-details-items">
                ${itemsHtml}
            </div>
            <div class="order-details-summary">
                <div class="order-details-summary-row">
                    <span>Subtotal:</span>
                    <span>₱${subtotal}</span>
                </div>
                <div class="order-details-summary-row">
                    <span>Tax (12%):</span>
                    <span>₱${tax}</span>
                </div>
                <div class="order-details-summary-row">
                    <span>Total:</span>
                    <span>${order.total}</span>
                </div>
            </div>
            <div class="order-details-payment">
                <div class="order-details-payment-row">
                    <span>Payment Mode:</span>
                    <span class="order-details-payment-mode payment-mode-${order.payment.mode.toLowerCase()}">
                        ${order.payment.mode === 'Cash' ? 
                            '<i class="fas fa-money-bill-wave"></i> Cash' : 
                            '<i class="fas fa-mobile-alt"></i> GCash'}
                    </span>
                </div>
                <div class="order-details-payment-row">
                    <span>Amount Paid:</span>
                    <span>₱${order.payment.amount}</span>
                </div>
                ${order.payment.mode === 'Cash' ? 
                    `<div class="order-details-payment-row">
                        <span>Change:</span>
                        <span>₱${order.payment.change}</span>
                    </div>` : 
                    `<div class="order-details-payment-row">
                        <span>Reference No:</span>
                        <span>${order.payment.reference}</span>
                    </div>`
                }
            </div>
            <div class="order-details-summary-row">
                <span>Status:</span>
                <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
            </div>
        `;
        
        // Add event listeners for print and download buttons
        document.getElementById('printOrderBtn').onclick = function() {
            printOrderDetails(order);
        };
        
        document.getElementById('downloadOrderBtn').onclick = function() {
            downloadOrderDetails(order);
        };
        
        document.getElementById('orderDetailsModal').classList.add('active');
    }
    
    // NEW: Function to print order details
    function printOrderDetails(order) {
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString();
        const formattedTime = orderDate.toLocaleTimeString();
        
        let itemsHtml = '';
        order.items.forEach(item => {
            const sizeText = item.size === 'medio' ? 'Medio' : 
                            item.size === 'grande' ? 'Grande' : 
                            item.size === 'hot' ? 'Hot' : 
                            item.size === 'regular' ? 'Add-on' : 
                            `Iced ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`;
            
            itemsHtml += `
                <div class="receipt-item">
                    <div class="receipt-item-qty">${item.quantity}</div>
                    <div class="receipt-item-name">
                        <div class="item-name">${item.name}</div>
                        <div class="item-size">${sizeText}</div>
                    </div>
                    <div class="receipt-item-price">₱${item.price * item.quantity}</div>
                </div>
            `;
        });
        
        const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = Math.round(subtotal * 0.12);
        
        const printContent = `
            <div class="receipt-content">
                <div class="receipt-header">
                    <div class="receipt-logo">
                        <div class="receipt-title">BIGBREW</div>
                        <div class="receipt-subtitle">Your Favorite Milk Tea Shop</div>
                        <div class="receipt-address">123 Milk Tea Street, Tea City</div>
                    </div>
                    <div class="receipt-details">
                        <div class="receipt-number">Order #${order.orderNumber}</div>
                        <div class="receipt-date">${formattedDate} ${formattedTime}</div>
                    </div>
                </div>
                <div class="receipt-items">${itemsHtml}</div>
                <div class="receipt-summary">
                    <div class="receipt-summary-row">
                        <div>Subtotal</div>
                        <div>₱${subtotal}</div>
                    </div>
                    <div class="receipt-summary-row">
                        <div>Tax (12%)</div>
                        <div>₱${tax}</div>
                    </div>
                    <div class="receipt-summary-row total">
                        <div>Total</div>
                        <div class="receipt-total-amount">${order.total}</div>
                    </div>
                </div>
                <div class="receipt-payment-info">
                    <div class="receipt-payment-row">
                        <div>Payment Mode:</div>
                        <div class="receipt-payment-mode ${order.payment.mode.toLowerCase()}">
                            ${order.payment.mode === 'Cash' ? 
                                '<i class="fas fa-money-bill-wave"></i> Cash' : 
                                '<i class="fas fa-mobile-alt"></i> GCash'}
                        </div>
                    </div>
                    <div class="receipt-payment-row">
                        <div>Amount Paid:</div>
                        <div>₱${order.payment.amount}</div>
                    </div>
                    ${order.payment.mode === 'Cash' ? 
                        `<div class="receipt-payment-row">
                            <div>Change:</div>
                            <div>₱${order.payment.change}</div>
                        </div>` : 
                        `<div class="receipt-payment-row">
                            <div>Reference No:</div>
                            <div>${order.payment.reference}</div>
                        </div>`
                    }
                </div>
                <div class="receipt-footer">
                    <div class="receipt-thank-you">Thank you for your purchase!</div>
                    <div class="receipt-visit-again">Please visit us again</div>
                    <div class="receipt-contact">Follow us @bigbrewph</div>
                </div>
            </div>
        `;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Order #${order.orderNumber}</title>
                    <style>
                        body {
                            font-family: 'Courier New', monospace;
                            margin: 0;
                            padding: 20px;
                        }
                        .receipt-content {
                            background-color: white;
                            padding: 20px;
                            border-radius: 8px 8px 0 0;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                            max-width: 300px;
                            margin: 0 auto;
                            background-image: 
                                repeating-linear-gradient(
                                    0deg,
                                    rgba(0,0,0,0.03) 0px,
                                    transparent 1px,
                                    transparent 2px,
                                    rgba(0,0,0,0.03) 3px
                                );
                        }
                        .receipt-header {
                            text-align: center;
                            padding-bottom: 15px;
                            border-bottom: 1px dashed #ccc;
                            margin-bottom: 15px;
                        }
                        .receipt-logo {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            margin-bottom: 10px;
                        }
                        .receipt-title {
                            font-size: 18px;
                            font-weight: bold;
                            color: #654321;
                            margin: 0;
                            letter-spacing: 1px;
                        }
                        .receipt-subtitle {
                            font-size: 10px;
                            color: #666;
                            margin: 2px 0;
                        }
                        .receipt-address {
                            font-size: 9px;
                            color: #666;
                            margin: 2px 0;
                        }
                        .receipt-details {
                            display: flex;
                            flex-direction: column;
                            margin-bottom: 15px;
                            font-size: 10px;
                            text-align: left;
                        }
                        .receipt-number {
                            font-weight: bold;
                            margin-bottom: 3px;
                        }
                        .receipt-date {
                            margin-bottom: 3px;
                        }
                        .receipt-items {
                            margin: 15px 0;
                            border-bottom: 1px dashed #ccc;
                            padding-bottom: 15px;
                        }
                        .receipt-item {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 8px;
                            font-size: 10px;
                        }
                        .receipt-item-qty {
                            flex: 0.5;
                            text-align: left;
                            font-weight: bold;
                        }
                        .receipt-item-name {
                            flex: 2;
                            padding-left: 10px;
                        }
                        .item-name {
                            font-weight: bold;
                        }
                        .item-size {
                            font-size: 8px;
                            color: #666;
                        }
                        .receipt-item-price {
                            flex: 1;
                            text-align: right;
                            font-weight: bold;
                        }
                        .receipt-summary {
                            margin-top: 15px;
                            padding-top: 15px;
                            border-top: 1px dashed #ccc;
                        }
                        .receipt-summary-row {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 5px;
                            font-size: 10px;
                        }
                        .receipt-summary-row.total {
                            font-weight: bold;
                            font-size: 12px;
                            border-top: 1px solid #ccc;
                            padding-top: 5px;
                            margin-top: 5px;
                        }
                        .receipt-total-amount {
                            font-weight: bold;
                        }
                        .receipt-payment-info {
                            margin-top: 10px;
                            padding-top: 10px;
                            border-top: 1px dashed #ccc;
                        }
                        .receipt-payment-row {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 3px;
                            font-size: 9px;
                        }
                        .receipt-payment-mode {
                            display: inline-flex;
                            align-items: center;
                            gap: 3px;
                            padding: 1px 4px;
                            border-radius: 3px;
                            font-size: 8px;
                            font-weight: bold;
                        }
                        .receipt-payment-mode.cash {
                            background-color: rgba(76, 175, 80, 0.1);
                            color: #4CAF50;
                        }
                        .receipt-payment-mode.gcash {
                            background-color: rgba(0, 102, 204, 0.1);
                            color: #0066cc;
                        }
                        .receipt-footer {
                            text-align: center;
                            margin-top: 20px;
                            padding-top: 15px;
                            border-top: 1px dashed #ccc;
                            font-size: 9px;
                            color: #666;
                        }
                        .receipt-thank-you {
                            font-weight: bold;
                            margin-bottom: 3px;
                            font-size: 10px;
                        }
                        .receipt-visit-again {
                            margin-bottom: 3px;
                            font-weight: bold;
                        }
                        .receipt-contact {
                            margin-bottom: 3px;
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
    
    // NEW: Function to download order details as PDF
    function downloadOrderDetails(order) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString();
        const formattedTime = orderDate.toLocaleTimeString();
        
        doc.setFont('courier');
        doc.setFontSize(18);
        doc.text('BIGBREW Order Details', 105, 15, { align: 'center' });
        
        doc.setFontSize(10);
        doc.text('Your Favorite Milk Tea Shop', 105, 22, { align: 'center' });
        doc.text('123 Milk Tea Street, Tea City', 105, 28, { align: 'center' });
        
        doc.text(`Order #${order.orderNumber}`, 20, 40);
        doc.text(`${formattedDate} ${formattedTime}`, 20, 46);
        
        doc.setLineWidth(0.2);
        doc.line(15, 52, 195, 52);
        
        doc.text('QTY', 20, 60);
        doc.text('ITEM', 40, 60);
        doc.text('PRICE', 170, 60, { align: 'right' });
        
        doc.setLineWidth(0.1);
        doc.line(15, 63, 195, 63);
        
        let yPosition = 70;
        
        order.items.forEach(item => {
            const sizeText = item.size === 'medio' ? 'Medio' : 
                            item.size === 'grande' ? 'Grande' : 
                            item.size === 'hot' ? 'Hot' : 
                            item.size === 'regular' ? 'Add-on' : 
                            `Iced ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`;
            
            doc.text(item.quantity.toString(), 20, yPosition);
            doc.text(`${item.name} (${sizeText})`, 40, yPosition);
            doc.text(`₱${item.price * item.quantity}`, 170, yPosition, { align: 'right' });
            yPosition += 8;
        });
        
        doc.setLineWidth(0.2);
        doc.line(15, yPosition, 195, yPosition);
        yPosition += 8;
        
        const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = Math.round(subtotal * 0.12);
        
        doc.setFontSize(10);
        doc.setFont('courier', 'normal');
        
        doc.text('Subtotal', 25, yPosition);
        doc.text(`₱${subtotal}`, 170, yPosition, { align: 'right' });
        yPosition += 8;
        
        doc.text('Tax (12%)', 25, yPosition);
        doc.text(`₱${tax}`, 170, yPosition, { align: 'right' });
        yPosition += 8;
        
        doc.setFontSize(12);
        doc.setFont('courier', 'bold');
        
        doc.text('Total', 25, yPosition);
        doc.text(order.total, 170, yPosition, { align: 'right' });
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('courier', 'normal');
        
        doc.text('Payment Mode', 25, yPosition);
        doc.text(order.payment.mode, 170, yPosition, { align: 'right' });
        yPosition += 8;
        
        doc.text('Amount Paid', 25, yPosition);
        doc.text(`₱${order.payment.amount}`, 170, yPosition, { align: 'right' });
        yPosition += 8;
        
        if (order.payment.mode === 'Cash') {
            doc.text('Change', 25, yPosition);
            doc.text(`₱${order.payment.change}`, 170, yPosition, { align: 'right' });
        } else {
            doc.text('Reference No', 25, yPosition);
            doc.text(order.payment.reference, 170, yPosition, { align: 'right' });
        }
        
        doc.save(`BIGBREW_Order_${order.orderNumber}.pdf`);
    }
    
    document.getElementById('filterBtn').addEventListener('click', function() {
        const filterDate = document.getElementById('dateFilter').value;
        loadOrderHistory(filterDate, null);
    });
    
    document.getElementById('searchOrderIdBtn').addEventListener('click', function() {
        const orderId = document.getElementById('orderIdSearch').value.trim();
        const filterDate = document.getElementById('dateFilter').value;
        loadOrderHistory(filterDate, orderId);
    });
    
    document.getElementById('clearFilterBtn').addEventListener('click', function() {
        document.getElementById('dateFilter').value = '';
        document.getElementById('orderIdSearch').value = '';
        loadOrderHistory();
    });
    
    document.getElementById('downloadPdfBtn').addEventListener('click', function() {
        generateOrderHistoryPDF();
    });
    
    function generateOrderHistoryPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('BIGBREW Order History', 105, 15, { align: 'center' });
        
        doc.setFontSize(10);
        doc.text('Your Favorite Milk Tea Shop', 105, 22, { align: 'center' });
        doc.text('123 Milk Tea Street, Tea City', 105, 28, { align: 'center' });
        
        const today = new Date();
        doc.text(`Generated on: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`, 105, 35, { align: 'center' });
        
        doc.setLineWidth(0.2);
        doc.line(15, 40, 195, 40);
        
        doc.text('Order #', 20, 50);
        doc.text('Date', 60, 50);
        doc.text('Items', 100, 50);
        doc.text('Total', 170, 50, { align: 'right' });
        
        doc.setLineWidth(0.1);
        doc.line(15, 53, 195, 53);
        
        let yPosition = 60;
        
        if (orderHistory.length === 0) {
            doc.text('No order history available', 105, yPosition, { align: 'center' });
        } else {
            const sortedOrders = [...orderHistory].sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            );
            
            sortedOrders.forEach(order => {
                const orderDate = new Date(order.date);
                const formattedDate = orderDate.toLocaleDateString();
                const formattedTime = orderDate.toLocaleTimeString();
                
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                    
                    doc.setFontSize(10);
                    doc.text('Order #', 20, yPosition);
                    doc.text('Date', 60, yPosition);
                    doc.text('Items', 100, yPosition);
                    doc.text('Total', 170, yPosition, { align: 'right' });
                    
                    doc.setLineWidth(0.1);
                    doc.line(15, yPosition + 3, 195, yPosition + 3);
                    yPosition += 10;
                }
                
                doc.setFontSize(10);
                doc.text(`#${order.orderNumber}`, 20, yPosition);
                doc.text(`${formattedDate} ${formattedTime}`, 60, yPosition);
                
                let itemsText = '';
                order.items.forEach((item, index) => {
                    const sizeText = item.size === 'medio' ? 'Medio' : 
                                    item.size === 'grande' ? 'Grande' : 
                                    item.size === 'hot' ? 'Hot' : 
                                    item.size === 'regular' ? 'Add-on' : 
                                    `Iced ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`;
                    
                    if (index === 0) {
                        itemsText = `${item.name} (${sizeText}) x${item.quantity}`;
                    } else if (index < 3) {
                        itemsText += `, ${item.name} (${sizeText}) x${item.quantity}`;
                    } else if (index === 3) {
                        itemsText += `...`;
                    }
                });
                
                const wrapText = (text, x, y, maxWidth, lineHeight) => {
                    const words = text.split(' ');
                    let line = '';
                    let currentY = y;
                    
                    for (let i = 0; i < words.length; i++) {
                        const testLine = line + words[i] + ' ';
                        const metrics = doc.getTextWidth(testLine);
                        const testWidth = metrics;
                        
                        if (testWidth > maxWidth && i > 0) {
                            doc.text(line, x, currentY);
                            line = words[i] + ' ';
                            currentY += lineHeight;
                        } else {
                            line = testLine;
                        }
                    }
                    doc.text(line, x, currentY);
                    return currentY + lineHeight;
                };
                
                const itemsYPosition = wrapText(itemsText, 100, yPosition, 60, 4);
                
                const itemsHeight = itemsYPosition - yPosition;
                if (itemsHeight > 4) {
                    yPosition = itemsYPosition - 4;
                }
                
                doc.text(order.total, 170, yPosition, { align: 'right' });
                
                yPosition += 8;
            });
        }
        
        doc.setLineWidth(0.2);
        doc.line(15, yPosition, 195, yPosition);
        
        yPosition += 10;
        doc.setFontSize(10);
        doc.text('Thank you for your business!', 105, yPosition, { align: 'center' });
        yPosition += 6;
        doc.text('Follow us @bigbrewph', 105, yPosition, { align: 'center' });
        
        doc.save('BIGBREW_Order_History.pdf');
    }
    
    // Manage Orders Page Logic - UPDATED
    function loadManageOrders() {
        const manageOrdersList = document.getElementById('manageOrdersList');
        manageOrdersList.innerHTML = '';

        const activeOrders = orderHistory.filter(order => 
            order.status === 'Preparing' // Only show preparing orders
        );

        if (activeOrders.length === 0) {
            manageOrdersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No active orders to manage.</p>
                </div>
            `;
            return;
        }

        const filteredOrders = activeOrders.filter(order => 
            order.status.toLowerCase() === currentManageOrderFilter
        );
        
        if (filteredOrders.length === 0) {
            manageOrdersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No ${currentManageOrderFilter} orders.</p>
                </div>
            `;
            return;
        }

        filteredOrders.sort((a, b) => new Date(a.date) - new Date(b.date));

        filteredOrders.forEach(order => {
            const orderDate = new Date(order.date);
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            orderCard.setAttribute('data-order-number', order.orderNumber);
            
            let itemsHtml = '';
            order.items.forEach(item => {
                const sizeText = item.size === 'medio' ? 'Med' : 
                                item.size === 'grande' ? 'Gra' : 
                                item.size === 'hot' ? 'Hot' : 
                                item.size === 'regular' ? 'Add' : 
                                `Iced ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`;
                itemsHtml += `
                    <div class="order-card-item">
                        <span class="order-card-item-name">${item.name} (${sizeText})</span>
                        <span class="order-card-item-qty">x${item.quantity}</span>
                    </div>
                `;
            });

            orderCard.innerHTML = `
                <div class="order-card-header">
                    <div class="order-card-number">#${order.orderNumber}</div>
                    <div class="order-card-time">${orderDate.toLocaleTimeString()}</div>
                </div>
                <div class="order-card-items">
                    ${itemsHtml}
                </div>
                <div class="order-card-footer">
                    <div class="order-card-total">${order.total}</div>
                    <div class="order-card-status status-${order.status.toLowerCase()}">${order.status}</div>
                </div>
            `;
            manageOrdersList.appendChild(orderCard);
            
            // Add click event to show order details
            orderCard.addEventListener('click', function() {
                showOrderDetails(order);
            });
        });
    }

    function showOrderDetails(order) {
        // Remove previous selection
        document.querySelectorAll('.order-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked card
        document.querySelector(`.order-card[data-order-number="${order.orderNumber}"]`).classList.add('selected');
        
        // Store selected order
        selectedOrder = order;
        
        // Adjust grid layout
        document.getElementById('manageOrdersList').classList.add('with-details');
        
        // Show order details panel
        orderDetailsPanel.classList.add('active');
        
        // Populate order details
        const orderDate = new Date(order.date);
        
        let itemsHtml = '';
        order.items.forEach(item => {
            const sizeText = item.size === 'medio' ? 'Medio' : 
                            item.size === 'grande' ? 'Grande' : 
                            item.size === 'hot' ? 'Hot' : 
                            item.size === 'regular' ? 'Add-on' : 
                            `Iced ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`;
            
            itemsHtml += `
                <div class="order-details-item">
                    <div class="order-details-item-name">
                        ${item.name}
                        <span class="order-details-item-size">(${sizeText})</span>
                        <span class="order-details-item-qty">x${item.quantity}</span>
                    </div>
                    <div class="order-details-item-price">₱${item.price * item.quantity}</div>
                </div>
            `;
        });
        
        panelContent.innerHTML = `
            <div class="order-details-header">
                <div class="order-details-number">Order #${order.orderNumber}</div>
                <div class="order-details-time">${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}</div>
            </div>
            <div class="order-details-items">
                ${itemsHtml}
            </div>
            <div class="order-details-summary">
                <div class="order-details-summary-row">
                    <span>Subtotal:</span>
                    <span>₱${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
                </div>
                <div class="order-details-summary-row">
                    <span>Tax (12%):</span>
                    <span>₱${Math.round(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.12)}</span>
                </div>
                <div class="order-details-summary-row">
                    <span>Total:</span>
                    <span>${order.total}</span>
                </div>
            </div>
            <div class="order-details-payment">
                <div class="order-details-payment-row">
                    <span>Payment Mode:</span>
                    <span class="order-details-payment-mode payment-mode-${order.payment.mode.toLowerCase()}">
                        ${order.payment.mode === 'Cash' ? 
                            '<i class="fas fa-money-bill-wave"></i> Cash' : 
                            '<i class="fas fa-mobile-alt"></i> GCash'}
                    </span>
                </div>
                <div class="order-details-payment-row">
                    <span>Amount Paid:</span>
                    <span>₱${order.payment.amount}</span>
                </div>
                ${order.payment.mode === 'Cash' ? 
                    `<div class="order-details-payment-row">
                        <span>Change:</span>
                        <span>₱${order.payment.change}</span>
                    </div>` : 
                    `<div class="order-details-payment-row">
                        <span>Reference No:</span>
                        <span>${order.payment.reference}</span>
                    </div>`
                }
            </div>
        `;
        
        // Set action button based on status
        if (order.status === 'Preparing') {
            panelFooter.innerHTML = `
                <button class="mark-done-btn" id="markDoneBtn">Mark as Done</button>
            `;
            document.getElementById('markDoneBtn').addEventListener('click', function() {
                markOrderReady(order.orderNumber);
            });
        }
    }

    function markOrderReady(orderNumber) {
        updateOrderStatus(orderNumber, 'Prepared');
    }
    
    function updateOrderStatus(orderNumber, status) {
        const orderIndex = orderHistory.findIndex(order => order.orderNumber === orderNumber);
        if (orderIndex !== -1) {
            orderHistory[orderIndex].status = status;
            sessionStorage.setItem('bigbrewOrderHistory', JSON.stringify(orderHistory));
            
            // If the updated order is currently selected, refresh the details
            if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
                selectedOrder = orderHistory[orderIndex];
                showOrderDetails(selectedOrder);
            } else {
                // Otherwise, close the panel
                closeOrderDetailsPanel();
            }
            
            loadManageOrders();

            if (document.getElementById('order-history').classList.contains('active')) {
                loadOrderHistory();
            }
            
            // Refresh sales report if it's the active page and order is marked as done
            if (status === 'Prepared' && document.getElementById('sales-report').classList.contains('active')) {
                generateSalesReport();
            }
        }
    }

    function closeOrderDetailsPanel() {
        orderDetailsPanel.classList.remove('active');
        document.getElementById('manageOrdersList').classList.remove('with-details');
        document.querySelectorAll('.order-card').forEach(card => {
            card.classList.remove('selected');
        });
        selectedOrder = null;
    }

    // Event listeners for filter buttons in Manage Orders - UPDATED
    document.querySelectorAll('.order-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.order-filters .filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentManageOrderFilter = this.getAttribute('data-status');
            closeOrderDetailsPanel();
            loadManageOrders();
        });
    });
    
    // Close panel button
    closePanelBtn.addEventListener('click', closeOrderDetailsPanel);

    // Add Account
    document.getElementById('addAccountForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('cashierName').value.trim();
        const age = document.getElementById('cashierAge').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const username = document.getElementById('cashierUsername').value.trim();
        const password = document.getElementById('cashierPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        const accountMessage = document.getElementById('accountMessage');
        accountMessage.className = 'message';
        accountMessage.textContent = '';
        
        if (password !== confirmPassword) {
            accountMessage.textContent = 'Passwords do not match!';
            accountMessage.className = 'message error';
            return;
        }
        
        const accounts = JSON.parse(sessionStorage.getItem('bigbrewCashierAccounts')) || [];
        
        if (accounts.some(acc => acc.username === username)) {
            accountMessage.textContent = 'Username already exists!';
            accountMessage.className = 'message error';
            return;
        }
        
        const newAccount = { name, age, gender, username, password };
        accounts.push(newAccount);
        sessionStorage.setItem('bigbrewCashierAccounts', JSON.stringify(accounts));
        
        accountMessage.textContent = `Account for ${name} created successfully!`;
        accountMessage.className = 'message success';
        
        this.reset();
    });
    
    // Inventory
    function loadInventory() {
        const inventory = JSON.parse(sessionStorage.getItem('bigbrewInventory')) || [];
        const powdersGrid = document.getElementById('powders-grid');
        const suppliesGrid = document.getElementById('supplies-grid');
        
        powdersGrid.innerHTML = '';
        suppliesGrid.innerHTML = '';
        
        inventory.forEach(item => {
            const inventoryItem = createInventoryItemElement(item);
            
            if (item.category === 'Supplies' || item.category === 'Toppings') {
                suppliesGrid.appendChild(inventoryItem);
            } else {
                powdersGrid.appendChild(inventoryItem);
            }
        });
    }
    
    function createInventoryItemElement(item) {
        const div = document.createElement('div');
        div.className = 'inventory-item';
        if (item.stock <= 5) {
            div.classList.add('low-stock');
        }
        
        div.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-category">${item.category}</span>
            </div>
            <div class="item-stock">
                <span class="stock-count ${item.stock <= 5 ? 'low-stock' : ''}">${item.stock}</span>
                <span class="stock-unit">${item.unit}</span>
            </div>
            <button class="edit-btn" data-id="${item.id}">
                <i class="fas fa-edit"></i>
            </button>
        `;
        
        const editBtn = div.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => openEditModal(item));
        
        return div;
    }
    
    function openEditModal(item) {
        document.getElementById('editItemName').value = item.name;
        document.getElementById('editItemCategory').value = item.category;
        document.getElementById('editItemPrice').value = item.price;
        document.getElementById('editItemStock').value = item.stock;
        document.getElementById('editItemUnit').value = item.unit;
        
        document.getElementById('editInventoryMessage').className = 'message';
        document.getElementById('editInventoryModal').classList.add('active');
    }
    
    document.getElementById('saveEditBtn').addEventListener('click', function() {
        const inventory = JSON.parse(sessionStorage.getItem('bigbrewInventory')) || [];
        const itemIndex = inventory.findIndex(item => item.id === parseInt(document.querySelector('.edit-btn').getAttribute('data-id')));
        
        if (itemIndex !== -1) {
            inventory[itemIndex] = {
                ...inventory[itemIndex],
                name: document.getElementById('editItemName').value,
                price: parseInt(document.getElementById('editItemPrice').value),
                stock: parseInt(document.getElementById('editItemStock').value),
                unit: document.getElementById('editItemUnit').value
            };
            
            sessionStorage.setItem('bigbrewInventory', JSON.stringify(inventory));
            
            document.getElementById('editInventoryMessage').textContent = 'Item updated successfully!';
            document.getElementById('editInventoryMessage').className = 'message success';
            
            setTimeout(() => {
                document.getElementById('editInventoryModal').classList.remove('active');
                loadInventory();
                loadAllMenuItems();
            }, 1500);
        }
    });
    
    document.getElementById('cancelEditBtn').addEventListener('click', function() {
        document.getElementById('editInventoryModal').classList.remove('active');
    });
    
// Update the suggest order button event listener
document.getElementById('suggestOrderBtn').addEventListener('click', function() {
    showSuggestOrderModal();
});

// Function to show the suggest order modal
function showSuggestOrderModal() {
    const inventory = JSON.parse(sessionStorage.getItem('bigbrewInventory')) || [];
    const lowStockItems = inventory.filter(item => item.stock < 5);
    
    const modalContent = document.getElementById('suggestOrderContent');
    
    if (lowStockItems.length === 0) {
        modalContent.innerHTML = `
            <div class="suggest-no-items">
                <i class="fas fa-check-circle"></i>
                <p>All items have sufficient stock!</p>
                <div class="suggest-summary">
                    <h4>Inventory Status</h4>
                    <p>Total items: ${inventory.length}</p>
                    <p>All items are well-stocked</p>
                </div>
            </div>
        `;
    } else {
        let itemsHtml = '';
        let totalItemsNeeded = 0;
        
        lowStockItems.forEach(item => {
            const suggestedOrder = Math.max(20 - item.stock, 10); // Suggest ordering up to 20 or minimum 10
            totalItemsNeeded += suggestedOrder;
            
            itemsHtml += `
                <div class="suggest-item">
                    <div>
                        <div class="suggest-item-name">${item.name}</div>
                        <div class="suggest-item-details">
                            <span class="suggest-item-category">${item.category}</span>
                            <span class="suggest-item-stock">Current: ${item.stock} ${item.unit}</span>
                        </div>
                    </div>
                    <div class="suggest-item-suggestion">
                        <i class="fas fa-arrow-up"></i>
                        Order ${suggestedOrder} ${item.unit}
                    </div>
                </div>
            `;
        });
        
        modalContent.innerHTML = `
            <div class="suggest-items-list">
                ${itemsHtml}
            </div>
            <div class="suggest-summary">
                <h4>Order Summary</h4>
                <p>Items needing restock: ${lowStockItems.length}</p>
                <p>Total suggested quantity: ${totalItemsNeeded} units</p>
            </div>
            <div class="pdf-loading" id="pdfLoading">
                <div class="spinner"></div>
                <p>Generating PDF...</p>
            </div>
        `;
        
        // Automatically generate and download PDF after showing modal
        setTimeout(() => {
            generateStockOrderPDF(lowStockItems);
        }, 1000);
    }
    
    document.getElementById('suggestOrderModal').classList.add('active');
}

// Function to generate and download PDF for stock order
function generateStockOrderPDF(lowStockItems) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Show loading spinner
    document.getElementById('pdfLoading').classList.add('active');
    
    // Set up the document
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('BIGBREW - Stock Order Suggestion', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    
    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Low Inventory Items Requiring Restock', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    
    // Date and time
    const now = new Date();
    doc.setFontSize(10);
    doc.text(`Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    
    // Draw line
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;
    
    // Table headers
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Item Name', 25, yPosition);
    doc.text('Category', 80, yPosition);
    doc.text('Current Stock', 130, yPosition);
    doc.text('Suggested Order', 160, yPosition);
    
    yPosition += 8;
    
    // Draw line under headers
    doc.setLineWidth(0.3);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 8;
    
    // Table content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    lowStockItems.forEach((item, index) => {
        const suggestedOrder = Math.max(20 - item.stock, 10);
        
        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
            
            // Repeat headers on new page
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Item Name', 25, yPosition);
            doc.text('Category', 80, yPosition);
            doc.text('Current Stock', 130, yPosition);
            doc.text('Suggested Order', 160, yPosition);
            
            yPosition += 8;
            doc.setLineWidth(0.3);
            doc.line(20, yPosition, pageWidth - 20, yPosition);
            yPosition += 8;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
        }
        
        // Alternate row colors
        if (index % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(20, yPosition - 5, pageWidth - 40, 10, 'F');
        }
        
        // Item details
        doc.text(item.name, 25, yPosition);
        doc.text(item.category, 80, yPosition);
        doc.text(`${item.stock} ${item.unit}`, 130, yPosition);
        doc.text(`${suggestedOrder} ${item.unit}`, 160, yPosition);
        
        yPosition += 10;
    });
    
    // Draw line after table
    yPosition += 5;
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15;
    
    // Summary section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 25, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total items needing restock: ${lowStockItems.length}`, 25, yPosition);
    yPosition += 8;
    
    const totalSuggested = lowStockItems.reduce((sum, item) => sum + Math.max(20 - item.stock, 10), 0);
    doc.text(`Total suggested quantity: ${totalSuggested} units`, 25, yPosition);
    yPosition += 8;
    
    doc.text('Priority: HIGH - Please restock as soon as possible', 25, yPosition);
    yPosition += 15;
    
    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('This is an automated suggestion based on current inventory levels.', pageWidth / 2, pageHeight - 20, { align: 'center' });
    doc.text('Please review and adjust quantities as needed before placing orders.', pageWidth / 2, pageHeight - 15, { align: 'center' });
    
    // Save the PDF
    const fileName = `BIGBREW_Stock_Order_Suggestion_${now.toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    // Hide loading spinner
    setTimeout(() => {
        document.getElementById('pdfLoading').classList.remove('active');
        showMessage('Stock order suggestion PDF downloaded successfully!', 'success');
    }, 1000);
}

// Event listeners for the suggest order modal
document.getElementById('closeSuggestBtn').addEventListener('click', function() {
    document.getElementById('suggestOrderModal').classList.remove('active');
});

// Add to your existing modal close event listeners
document.getElementById('suggestOrderModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('active');
    }
});
    
    // Raw Materials - Updated for new UI
    function loadRawMaterials() {
        const rawMaterials = JSON.parse(sessionStorage.getItem('bigbrewRawMaterials')) || [];
        const rawMaterialsGrid = document.getElementById('rawMaterialsGrid');
        
        if (rawMaterials.length === 0) {
            rawMaterialsGrid.innerHTML = '<div class="empty-state"><i class="fas fa-flask"></i><p>No raw materials found</p></div>';
            return;
        }
        
        rawMaterialsGrid.innerHTML = '';
        rawMaterials.forEach(material => {
            const materialCard = createRawMaterialElement(material);
            rawMaterialsGrid.appendChild(materialCard);
        });
    }
    
    function createRawMaterialElement(material) {
        const div = document.createElement('div');
        div.className = 'raw-material-item';
        if (material.quantity <= 100) {
            div.classList.add('low-stock');
        }
        
        div.innerHTML = `
            <div class="raw-material-header">
                <div class="raw-material-name">${material.name}</div>
                <div class="raw-material-actions">
                    <button class="edit-raw-material-btn" data-id="${material.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-raw-material-btn" data-id="${material.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="raw-material-details">
                <div class="raw-material-detail">
                    <div class="raw-material-label">Price</div>
                    <div class="raw-material-value raw-material-price">₱${material.price}</div>
                </div>
                <div class="raw-material-detail">
                    <div class="raw-material-label">Quantity</div>
                    <div class="raw-material-value">
                        <span class="raw-material-quantity ${material.quantity <= 100 ? 'low-stock' : ''}">${material.quantity}</span>
                        <span class="raw-material-unit">${material.unit}</span>
                    </div>
                </div>
            </div>
        `;
        
        const editBtn = div.querySelector('.edit-raw-material-btn');
        editBtn.addEventListener('click', () => openEditRawMaterialModal(material));
        
        const deleteBtn = div.querySelector('.delete-raw-material-btn');
        deleteBtn.addEventListener('click', () => {
            showDeleteConfirm(material.name, () => deleteRawMaterial(material.id));
        });
        
        return div;
    }
    
    function openEditRawMaterialModal(material) {
        document.getElementById('editRawMaterialName').value = material.name;
        document.getElementById('editRawMaterialPrice').value = material.price;
        document.getElementById('editRawMaterialQuantity').value = material.quantity;
        document.getElementById('editRawMaterialUnit').value = material.unit;
        
        document.getElementById('editRawMaterialMessage').className = 'message';
        document.getElementById('editRawMaterialModal').classList.add('active');
    }
    
    document.getElementById('saveEditRawMaterialBtn').addEventListener('click', function() {
        const rawMaterials = JSON.parse(sessionStorage.getItem('bigbrewRawMaterials')) || [];
        const materialId = parseInt(document.querySelector('.edit-raw-material-btn').getAttribute('data-id'));
        const materialIndex = rawMaterials.findIndex(m => m.id === materialId);
        
        if (materialIndex !== -1) {
            rawMaterials[materialIndex] = {
                ...rawMaterials[materialIndex],
                name: document.getElementById('editRawMaterialName').value,
                price: parseFloat(document.getElementById('editRawMaterialPrice').value),
                quantity: parseFloat(document.getElementById('editRawMaterialQuantity').value),
                unit: document.getElementById('editRawMaterialUnit').value
            };
            
            sessionStorage.setItem('bigbrewRawMaterials', JSON.stringify(rawMaterials));
            
            document.getElementById('editRawMaterialMessage').textContent = 'Raw material updated successfully!';
            document.getElementById('editRawMaterialMessage').className = 'message success';
            
            setTimeout(() => {
                document.getElementById('editRawMaterialModal').classList.remove('active');
                loadRawMaterials();
            }, 1500);
        }
    });
    
    document.getElementById('cancelEditRawMaterialBtn').addEventListener('click', function() {
        document.getElementById('editRawMaterialModal').classList.remove('active');
    });
    
    function deleteRawMaterial(id) {
        const rawMaterials = JSON.parse(sessionStorage.getItem('bigbrewRawMaterials')) || [];
        const updatedMaterials = rawMaterials.filter(m => m.id !== id);
        sessionStorage.setItem('bigbrewRawMaterials', JSON.stringify(updatedMaterials));
        loadRawMaterials();
    }
    
    // Create Raw Material
    document.getElementById('createRawMaterialForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('materialName').value.trim();
        const price = parseFloat(document.getElementById('materialPrice').value);
        const quantity = parseFloat(document.getElementById('materialQuantity').value);
        const unit = document.getElementById('materialUnit').value;
        
        const rawMaterialMessage = document.getElementById('rawMaterialMessage');
        rawMaterialMessage.className = 'message';
        rawMaterialMessage.textContent = '';
        
        const rawMaterials = JSON.parse(sessionStorage.getItem('bigbrewRawMaterials')) || [];
        
        // Generate new ID
        let newId = 1;
        if (rawMaterials.length > 0) {
            newId = Math.max(...rawMaterials.map(m => m.id)) + 1;
        }
        
        const newMaterial = { id: newId, name, price, quantity, unit };
        rawMaterials.push(newMaterial);
        sessionStorage.setItem('bigbrewRawMaterials', JSON.stringify(rawMaterials));
        
        rawMaterialMessage.textContent = `Raw material "${name}" created successfully!`;
        rawMaterialMessage.className = 'message success';
        
        this.reset();
        
        // Navigate to raw materials page after a short delay
        setTimeout(() => {
            document.querySelector('[data-page="raw-materials"]').click();
        }, 1500);
    });
    
    // Add event listener for the "Add New Material" button
    document.getElementById('addRawMaterialBtn').addEventListener('click', function() {
        document.querySelector('[data-page="create-raw-materials"]').click();
    });
    
    // Add event listener for the "Cancel" button in the create form
    document.getElementById('cancelCreateBtn').addEventListener('click', function() {
        document.querySelector('[data-page="raw-materials"]').click();
    });

    // Create Category Form Handler
    document.getElementById('createCategoryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const categoryName = document.getElementById('categoryName').value.trim();
        const messageEl = document.getElementById('createCategoryMessage');

        if (!categoryName) {
            messageEl.textContent = 'Category name cannot be empty!';
            messageEl.className = 'message error';
            return;
        }

        let customCategories = JSON.parse(sessionStorage.getItem('bigbrewCustomCategories')) || [];
        if (customCategories.includes(categoryName)) {
            messageEl.textContent = 'Category already exists!';
            messageEl.className = 'message error';
            return;
        }

        customCategories.push(categoryName);
        sessionStorage.setItem('bigbrewCustomCategories', JSON.stringify(customCategories));

        messageEl.textContent = `Category "${categoryName}" created successfully!`;
        messageEl.className = 'message success';
        
        this.reset();

        // Update UI
        addCategoryToUI(categoryName);
        updateProductCategoryDropdown();
    });

    // Create Product Form Handler - FIXED VERSION
    document.getElementById('createProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('productName').value.trim();
        const category = document.getElementById('productCategorySelect').value;
        const price = parseInt(document.getElementById('productPrice').value);
        const stock = parseInt(document.getElementById('productStock').value);
        const unit = document.getElementById('productUnit').value;
        
        const messageEl = document.getElementById('createProductMessage');
        messageEl.className = 'message';
        messageEl.textContent = '';

        if (!name || !category || isNaN(price) || isNaN(stock)) {
            messageEl.textContent = 'Please fill out all fields correctly.';
            messageEl.className = 'message error';
            return;
        }

        const inventory = JSON.parse(sessionStorage.getItem('bigbrewInventory')) || [];
        
        // Generate new ID
        let newId = 1;
        if (inventory.length > 0) {
            newId = Math.max(...inventory.map(item => item.id)) + 1;
        }

        const newProduct = { id: newId, name, category, price, stock, unit };
        inventory.push(newProduct);
        sessionStorage.setItem('bigbrewInventory', JSON.stringify(inventory));
        
        messageEl.textContent = `Product "${name}" created successfully!`;
        messageEl.className = 'message success';
        
        this.reset();

        // Refresh relevant pages
        loadInventory();
        
        // Check if this is a custom category and refresh it if it's currently active
        const customCategories = JSON.parse(sessionStorage.getItem('bigbrewCustomCategories')) || [];
        const isCustomCategory = customCategories.includes(category);
        
        if (isCustomCategory) {
            const categorySlug = slugify(category);
            if (document.getElementById(categorySlug) && document.getElementById(categorySlug).classList.contains('active')) {
                loadMenuItemsForCategory(categorySlug, category);
            }
        } else {
            // For default categories, we need to add the item to the static HTML
            loadAllMenuItems();
        }
    });

    // Function to update the product category dropdown
    function updateProductCategoryDropdown() {
        const select = document.getElementById('productCategorySelect');
        if (!select) return;

        const defaultCategories = ['Milk Tea', 'Coffee', 'Fruit Tea', 'Brosty', 'Praf'];
        const customCategories = JSON.parse(sessionStorage.getItem('bigbrewCustomCategories')) || [];
        const allCategories = [...defaultCategories, ...customCategories];

        select.innerHTML = ''; // Clear existing options

        allCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });
    }
    
    // Event listener for cancel button in Create Product form
    document.getElementById('cancelCreateProductBtn').addEventListener('click', function() {
        document.querySelector('[data-page="products"]').click();
    });

    // Event listener for cancel button in Create Category form
    document.getElementById('cancelCreateCategoryBtn').addEventListener('click', function() {
        document.querySelector('[data-page="products"]').click();
    });
    
    // Delete Confirmation Modal
    function showDeleteConfirm(itemName, callback) {
        document.getElementById('deleteItemName').textContent = itemName;
        document.getElementById('deleteConfirmModal').classList.add('active');
        deleteCallback = callback;
    }
    
    document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
        if (deleteCallback) {
            deleteCallback();
            deleteCallback = null;
        }
        document.getElementById('deleteConfirmModal').classList.remove('active');
    });
    
    document.getElementById('cancelDeleteBtn').addEventListener('click', function() {
        deleteCallback = null;
        document.getElementById('deleteConfirmModal').classList.remove('active');
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('logoutModal').classList.add('active');
    });
    
    document.getElementById('logoutYesBtn').addEventListener('click', function() {
        document.getElementById('logoutModal').classList.remove('active');
        window.location.href = 'index.html';
    });
    
    document.getElementById('logoutNoBtn').addEventListener('click', function() {
        document.getElementById('logoutModal').classList.remove('active');
    });
    
    // Close modals
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Close order details modal
    document.getElementById('closeOrderDetailsBtn').addEventListener('click', function() {
        document.getElementById('orderDetailsModal').classList.remove('active');
    });
    
    document.getElementById('closeOrderDetailsModalBtn').addEventListener('click', function() {
        document.getElementById('orderDetailsModal').classList.remove('active');
    });
    
    // Helper functions
    // Load menu items for a specific category - FIXED VERSION
    function loadMenuItemsForCategory(categoryId, categoryName) {
        const inventory = JSON.parse(sessionStorage.getItem('bigbrewInventory')) || [];
        const container = document.querySelector(`#${categoryId} .menu-items`);
        
        if (!container) return;
        
        // Clear existing items
        container.innerHTML = '';
        
        // Get items from inventory for this category
        const categoryItems = inventory.filter(item => item.category === categoryName);
        
        if (categoryItems.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-coffee"></i><p>No items in this category yet</p></div>';
            return;
        }
        
        categoryItems.forEach(item => {
            const menuItem = createMenuItemElement(item, categoryId);
            container.appendChild(menuItem);
        });
    }
    
    // Load all menu items for all categories
    function loadAllMenuItems() {
        const inventory = JSON.parse(sessionStorage.getItem('bigbrewInventory')) || [];
        const customCategories = JSON.parse(sessionStorage.getItem('bigbrewCustomCategories')) || [];
        
        const categoryMap = {
            'milktea': 'Milk Tea',
            'coffee': 'Coffee',
            'fruit-tea': 'Fruit Tea',
            'brosty': 'Brosty',
            'praf': 'Praf',
            'add-ons': 'Toppings'
        };
        // Add custom categories to the map
        customCategories.forEach(catName => {
            const slug = slugify(catName);
            categoryMap[slug] = catName;
        });
        
        // Get all existing static menu items to avoid duplicates
        const staticItemNames = new Set();
        document.querySelectorAll('.menu-item[data-name]').forEach(item => {
            staticItemNames.add(item.getAttribute('data-name'));
        });

        Object.keys(categoryMap).forEach(categoryId => {
            const container = document.querySelector(`#${categoryId} .menu-items`);
            if (container) {
                // Get items from inventory that are not already in the static HTML
                const categoryItems = inventory.filter(item => 
                    categoryMap[categoryId] === item.category && !staticItemNames.has(item.name)
                );
                
                categoryItems.forEach(item => {
                    const menuItem = createMenuItemElement(item, categoryId);
                    container.appendChild(menuItem);
                });
            }
        });
    }
    
    // Load menu items (legacy function for compatibility)
    function loadMenuItems() {
        loadAllMenuItems();
    }
    
    function createMenuItemElement(item, category) {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.setAttribute('data-name', item.name);
        div.setAttribute('data-price-medio', item.price);
        div.setAttribute('data-price-grande', item.price + 10);
        
        if (category === 'coffee') {
            div.setAttribute('data-price-hot', item.price + 10);
        }
        
        const isOutOfStock = item.stock <= 0;
        
        const emoji = {
            milktea: '🥤',
            coffee: '☕',
            'fruit-tea': '🍓',
            brosty: '❄️',
            praf: '🍧',
            'add-ons': '➕'
        };
        // Use a coffee icon for custom categories as requested
        const customCategories = JSON.parse(sessionStorage.getItem('bigbrewCustomCategories')) || [];
        const categoryEmoji = customCategories.find(cat => slugify(cat) === category) ? '☕' : emoji[category];

        div.innerHTML = `
            <div class="item-info">
                <span class="item-emoji">${categoryEmoji}</span>
                <span class="item-name">${item.name}</span>
            </div>
            <div class="item-actions">
                ${category === 'add-ons' ? 
                    `<button class="add-to-cart" data-size="regular" ${isOutOfStock ? 'disabled' : ''}>Add</button>` :
                    category === 'coffee' ?
                    `<button class="add-to-cart" data-size="medio" ${isOutOfStock ? 'disabled' : ''}>Iced Medio</button>
                     <button class="add-to-cart" data-size="grande" ${isOutOfStock ? 'disabled' : ''}>Iced Grande</button>
                     <button class="add-to-cart" data-size="hot" ${isOutOfStock ? 'disabled' : ''}>Hot</button>` :
                    `<button class="add-to-cart" data-size="medio" ${isOutOfStock ? 'disabled' : ''}>Medio</button>
                     <button class="add-to-cart" data-size="grande" ${isOutOfStock ? 'disabled' : ''}>Grande</button>`
                }
            </div>
        `;
        
        return div;
    }
    
    function getInventoryItem(name) {
        const inventory = JSON.parse(sessionStorage.getItem('bigbrewInventory')) || [];
        return inventory.find(item => item.name === name);
    }
    
    function updateInventoryStock(name, quantity) {
        const inventory = JSON.parse(sessionStorage.getItem('bigbrewInventory')) || [];
        const itemIndex = inventory.findIndex(item => item.name === name);
        
        if (itemIndex !== -1) {
            inventory[itemIndex].stock -= quantity;
            sessionStorage.setItem('bigbrewInventory', JSON.stringify(inventory));
        }
    }
    
    // Utility function to show messages
    function showMessage(text, type = 'info') {
        // Create message element if it doesn't exist
        let messageEl = document.getElementById('tempMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'tempMessage';
            messageEl.className = 'message';
            document.body.appendChild(messageEl);
        }
        
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        messageEl.style.position = 'fixed';
        messageEl.style.top = '20px';
        messageEl.style.right = '20px';
        messageEl.style.zIndex = '9999';
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }
});