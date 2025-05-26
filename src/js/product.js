import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // Get existing cart or initialize empty array
  const cart = getLocalStorage("so-cart") || [];

  // Check if product already exists in the cart
  const existingItem = cart.find(item => item.Id === product.Id);

  if (existingItem) {
    // If found, increase its quantity
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    // If not found, add product with quantity = 1
    product.quantity = 1;
    cart.push(product);
  }

  // Save updated cart back to localStorage
  setLocalStorage("so-cart", cart);
}

// Add to cart button event handler
async function addToCartHandler(e) {
  // Retrieve product details using its ID
  const product = await dataSource.findProductById(e.target.dataset.id);
  // Add to cart (with logic above)
  addProductToCart(product);
}

// Attach listener to "Add to Cart" button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
  
