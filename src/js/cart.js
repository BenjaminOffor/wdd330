import { getLocalStorage, setLocalStorage, qs } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  qs(".product-list").innerHTML = htmlItems.join("");

  // Attach event listeners after rendering
  addCartEventListeners();

  // Display total
  displayCartTotal(cartItems);
}

function cartItemTemplate(item) {
  return `<li class="cart-card divider" data-id="${item.Id}">
    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
    <p class="cart-card__price">Price: $${item.FinalPrice}</p>
    <div class="cart-card__actions">
      <button class="decrease-btn">−</button>
      <button class="remove-btn">Remove</button>
    </div>
  </li>`;
}

function addCartEventListeners() {
  document.querySelectorAll(".decrease-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = getItemIdFromButton(e);
      decreaseQuantity(id);
    })
  );

  document.querySelectorAll(".remove-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = getItemIdFromButton(e);
      removeItem(id);
    })
  );
}

function getItemIdFromButton(e) {
  return e.target.closest(".cart-card").dataset.id;
}

function decreaseQuantity(id) {
  const cart = getLocalStorage("so-cart") || [];
  const index = cart.findIndex((item) => item.Id === id);

  if (index > -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1); // Remove if quantity becomes 0
    }
    setLocalStorage("so-cart", cart);
    renderCartContents();
  }
}

function removeItem(id) {
  const cart = getLocalStorage("so-cart") || [];
  const updatedCart = cart.filter((item) => item.Id !== id);
  setLocalStorage("so-cart", updatedCart);
  renderCartContents();
}

function displayCartTotal(cart) {
  const total = cart.reduce(
    (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
    0
  );
  qs("#cart-total").textContent = `Total: $${total.toFixed(2)}`;
}

renderCartContents();
