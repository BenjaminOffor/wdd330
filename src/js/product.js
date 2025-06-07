import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

// Add product to cart in localStorage
function addProductToCart(product) {
  // Get existing cart or initialize empty array
  const cart = getLocalStorage("so-cart") || [];

  // Check if product already exists in the cart
  const existingItem = cart.find(item => item.Id === product.Id);

  if (existingItem) {
    // Increase quantity by 1, defaulting to 0 if undefined
    existingItem.quantity = (existingItem.quantity || 0) + 1;
  } else {
    // Add product with quantity = 1
    product.quantity = 1;
    cart.push(product);
  }

  // Save updated cart back to localStorage
  setLocalStorage("so-cart", cart);

  // Update the cart display on the page
  updateCartDisplay();
}

// Example function to update cart display and total price
function updateCartDisplay() {
  const cart = getLocalStorage("so-cart") || [];
  const cartCountElem = document.getElementById("cartCount");
  const cartTotalElem = document.getElementById("cartTotal");

  // Update cart count (total number of items)
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  if (cartCountElem) cartCountElem.textContent = totalItems;

  // Calculate total price assuming each product has a "Price" property
  const totalPrice = cart.reduce((sum, item) => {
    const price = parseFloat(item.Price) || 0;
    const qty = item.quantity || 0;
    return sum + price * qty;
  }, 0);

  if (cartTotalElem) cartTotalElem.textContent = `$${totalPrice.toFixed(2)}`;
}

// Add to cart button event handler
async function addToCartHandler(e) {
  // Retrieve product details using its ID
  const product = await dataSource.findProductById(e.target.dataset.id);

  if (product) {
    addProductToCart(product);
  } else {
    console.error("Product not found for id:", e.target.dataset.id);
  }
}

// Attach listener to "Add to Cart" button after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtn = document.getElementById("addToCart");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", addToCartHandler);
  } else {
    console.warn("Add to Cart button not found in the DOM.");
  }

  // Initial update of cart display on page load
  updateCartDisplay();
});
