document.addEventListener("DOMContentLoaded", () => {
  let cart = [];
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const cartSidebar = document.getElementById("cartSidebar");
  const closeCart = document.getElementById("closeCart");

  // Add to cart
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const name = button.getAttribute("data-name");
      const price = parseFloat(button.getAttribute("data-price"));

      cart.push({ name, price });
      updateCart();
      cartSidebar.classList.add("active"); // auto open cart
    });
  });

  // Update cart display
  function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price;
      const li = document.createElement("li");
      li.textContent = `${item.name} - $${item.price}`;
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "X";
      removeBtn.style.marginLeft = "10px";
      removeBtn.onclick = () => {
        cart.splice(index, 1);
        updateCart();
      };
      li.appendChild(removeBtn);
      cartItems.appendChild(li);
    });

    cartCount.textContent = cart.length;
    cartTotal.textContent = total.toFixed(2);
  }

  // Checkout
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
    } else {
      alert("Thank you for your purchase!");
      cart = [];
      updateCart();
      cartSidebar.classList.remove("active");
    }
  });

  // Open cart when clicking cart icon
  document.querySelector(".cart-icon").addEventListener("click", () => {
    cartSidebar.classList.add("active");
  });

  // Close cart
  closeCart.addEventListener("click", () => {
    cartSidebar.classList.remove("active");
  });

  // Scroll to products
  document.getElementById("shopNowBtn").addEventListener("click", () => {
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
  });

  // Search functionality
  document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const products = document.querySelectorAll(".product-card");
    products.forEach(product => {
      const name = product.querySelector("h3").textContent.toLowerCase();
      product.style.display = name.includes(query) ? "block" : "none";
    });
  });
});
