// Sample product data
const products = [
    { id: 1, name: 'Pencil', price: 10 },
    { id: 2, name: 'Pen', price: 15 },
    { id: 3, name: 'Eraser', price: 20 },
];

let cart = {};

// Initialize the app
function init() {
    populateProductGrid();
    document.getElementById('showOrderBtn').addEventListener('click', showOrder);
    document.getElementById('readOrderBtn').addEventListener('click', readOutOrder);
}

// Populate the product grid
function populateProductGrid() {
    const tbody = document.querySelector('#productTable tbody');
    products.forEach(product => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td><input type="number" min="0" value="0" id="quantity-${product.id}"></td>
            <td><button onclick="addToCart(${product.id})">Add to Cart</button></td>
        `;
    });
}

// Add product to cart
function addToCart(productId) {
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);
    if (quantity > 0) {
        cart[productId] = (cart[productId] || 0) + quantity;
        alert('Product added to cart!');
    } else {
        alert('Please enter a valid quantity.');
    }
}

// Show the order summary
function showOrder() {
    const orderGrid = document.getElementById('orderGrid');
    const tbody = document.querySelector('#orderTable tbody');
    tbody.innerHTML = '';
    let total = 0;

    Object.keys(cart).forEach(productId => {
        const product = products.find(p => p.id === parseInt(productId));
        const quantity = cart[productId];
        const subtotal = product.price * quantity;
        total += subtotal;

        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${quantity}</td>
            <td>$${subtotal.toFixed(2)}</td>
        `;
    });

    document.getElementById('totalPrice').textContent = `Total: $${total.toFixed(2)}`;
    orderGrid.style.display = 'block';
}

// Read out the order using text-to-speech
function readOutOrder() {
    if (Object.keys(cart).length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const orderText = Object.keys(cart).map(productId => {
        const product = products.find(p => p.id === parseInt(productId));
        return `${cart[productId]} ${product.name}`;
    }).join(', ');

    const fullText = `Your order contains: ${orderText}`;

    // Show loading indicator
    document.getElementById('loadingIndicator').style.display = 'block';

    // Use browser's built-in speech synthesis
    const utterance = new SpeechSynthesisUtterance(fullText);
    
    utterance.onend = function() {
        // Hide loading indicator when speech is finished
        document.getElementById('loadingIndicator').style.display = 'none';
    };

    utterance.onerror = function(event) {
        console.error('SpeechSynthesis Error:', event.error);
        document.getElementById('loadingIndicator').style.display = 'none';
        alert('There was an error reading out the order. Please try again.');
    };

    // Optionally, you can set properties like language, pitch, and rate
    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;

    window.speechSynthesis.speak(utterance);
}

// Initialize the app when the page loads
window.onload = init;
