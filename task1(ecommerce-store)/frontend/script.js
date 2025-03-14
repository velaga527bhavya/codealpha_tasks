/* const API_URL = "http://localhost:3000/api"; 

// Load products for a given category
function loadProducts(category) {
  fetch(`${API_URL}/products/${category}`)
      .then(response => response.json())
      .then(products => {
          const container = document.getElementById("products-container");
          container.innerHTML = ""; // Clear previous products

          products.forEach(product => {
              const productCard = document.createElement("div");
              productCard.className = "product-card";
              const sizeOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
              productCard.innerHTML = `
                  <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}" class="product-image">
                  <h3>${product.name}</h3>
                  <p>Price: $${product.price}</p>
                  <p>Discount: ${product.discount}%</p>
                  <label for="size-${product._id}">Size:</label>
                  <select id="size-${product._id}">${sizeOptions}</select>
                  <button onclick="addToCart('${product._id}', '${product.name}', ${product.price}, 'size-${product._id}')">
                      Add to Cart
                  </button>
              `;
              container.appendChild(productCard);
          });
      })
      .catch(error => console.error("Error loading products:", error));
}


// Cart functions
function addToCart(id, name, price , sizeDropdownId) {
    const selectedSize = document.getElementById(sizeDropdownId).value;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ id, name, price , size: selectedSize });
    localStorage.setItem("cart", JSON.stringify(cart));
    
    updateCartCount();
    alert(`${name} (Size: ${selectedSize}) added to cart!`);
}

// Update cart count in UI
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById("cart-count").textContent = cart.length;
}

// Show cart modal
function viewCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cart.forEach((item, index) => {
            const li = document.createElement("li");
            li.textContent = `${index + 1}. ${item.name} - $${item.price} (Size: ${item.size})`;
            cartItems.appendChild(li);
        });
    }

    document.getElementById("cart-modal").style.display = "block";
}

// Close cart modal
function closeCart() {
    document.getElementById("cart-modal").style.display = "none";
}

// Place an order
function placeOrder() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty. Add items before placing an order.");
        return;
    }

    fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cart })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        clearCart();
    })
    .catch(error => console.error("Error placing order:", error));
}

// Clear cart
function clearCart() {
    localStorage.removeItem("cart");
    updateCartCount();
    viewCart();
}

// Initialize cart count on page load
document.addEventListener("DOMContentLoaded", updateCartCount);
*/
const API_URL = "http://localhost:3000/api";  

// ----------------------
// EXISTING FUNCTIONS
// ----------------------

// Load products for a given category
function loadProducts(category) {
  fetch(`${API_URL}/products/${category}`)
    .then(response => response.json())
    .then(products => {
      const container = document.getElementById("products-container");
      container.innerHTML = ""; // Clear previous products

      products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        const sizeOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
        productCard.innerHTML = `
          <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}" class="product-image">
          <h3>${product.name}</h3>
          <p>Price: $${product.price}</p>
          <p>Discount: ${product.discount}%</p>
          <label for="size-${product._id}">Size:</label>
          <select id="size-${product._id}">${sizeOptions}</select>
          <button onclick="addToCart('${product._id}', '${product.name}', ${product.price}, 'size-${product._id}')">
              Add to Cart
          </button>
        `;
        container.appendChild(productCard);
      });
    })
    .catch(error => console.error("Error loading products:", error));
}

// Add product to cart (using localStorage)
function addToCart(id, name, price, sizeDropdownId) {
  const selectedSize = document.getElementById(sizeDropdownId).value;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ id, name, price, size: selectedSize });
  localStorage.setItem("cart", JSON.stringify(cart));
  
  updateCartCount();
  alert(`${name} (Size: ${selectedSize}) added to cart!`);
}

// Update cart count in UI
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cart-count").textContent = cart.length;
}

// Show cart modal
function viewCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${item.name} - $${item.price} (Size: ${item.size})`;
      cartItems.appendChild(li);
    });
  }

  document.getElementById("cart-modal").style.display = "block";
}

// Close cart modal
function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}

// Clear cart
function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
  viewCart();
}

// Initialize cart count on page load
document.addEventListener("DOMContentLoaded", updateCartCount);


// ----------------------
// NEW: ORDER DETAILS FUNCTIONS
// ----------------------

// Modify placeOrder() to first show the Order Details Modal
function placeOrder() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty. Add items before placing an order.");
    return;
  }
  openOrderDetailsModal();
}

// Open Order Details Modal and prepopulate with saved profile (if available)
function openOrderDetailsModal() {
  // Check if a user profile exists in localStorage
  const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
  if (savedProfile) {
    document.getElementById("order-name").value = savedProfile.name;
    document.getElementById("order-phone").value = savedProfile.phone;
    document.getElementById("order-address").value = savedProfile.address;
  }
  document.getElementById("order-details-modal").style.display = "block";
}

// Close Order Details Modal
function closeOrderDetailsModal() {
  document.getElementById("order-details-modal").style.display = "none";
}

// Listen for the Order Details form submission
document.getElementById("order-details-form").addEventListener("submit", function (e) {
  e.preventDefault();
  
  // Get order details from the form
  const name = document.getElementById("order-name").value.trim();
  const phone = document.getElementById("order-phone").value.trim();
  const address = document.getElementById("order-address").value.trim();
  
  // Prepare the order payload: include both the cart and the user details.
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const orderPayload = {
    cart,
    user: { name, phone, address }
  };

  // Send the order to the server
  fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderPayload)
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message || "Order placed successfully!");
    clearCart();
    closeOrderDetailsModal();
    closeCart();
  })
  .catch(error => {
    console.error("Error placing order:", error);
    alert("There was an error placing your order.");
  });
});


// ----------------------
// NEW: USER PROFILE FUNCTIONS
// ----------------------

// Open the Profile Modal and prepopulate if data exists
function openProfileModal() {
  // Try to load from localStorage
  const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
  if (savedProfile) {
    document.getElementById("profile-name").value = savedProfile.name;
    document.getElementById("profile-phone").value = savedProfile.phone;
    document.getElementById("profile-address").value = savedProfile.address;
  } else {
    // Clear the fields if no profile saved
    document.getElementById("profile-name").value = "";
    document.getElementById("profile-phone").value = "";
    document.getElementById("profile-address").value = "";
  }
  document.getElementById("profile-modal").style.display = "block";
}

// Close the Profile Modal
function closeProfileModal() {
  document.getElementById("profile-modal").style.display = "none";
}

// Listen for Profile form submission
document.getElementById("profile-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("profile-name").value.trim();
  const phone = document.getElementById("profile-phone").value.trim();
  const address = document.getElementById("profile-address").value.trim();

  const profileData = { name, phone, address };

  // Save profile locally (so that order form can auto-populate next time)
  localStorage.setItem("userProfile", JSON.stringify(profileData));

  // Optionally, send the profile to the server for persistence.
  fetch(`${API_URL}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData)
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message || "Profile saved successfully!");
    closeProfileModal();
  })
  .catch(error => {
    console.error("Error saving profile:", error);
    alert("There was an error saving your profile.");
  });
});





