import { ProductsService } from "./products-service.js";

export class Cart {
  constructor() {
    if (Cart._instance) return Cart._instance;
    Cart._instance = this;
    this.container = document.querySelector(".cart-container");
    this.productsService = new ProductsService();
    this.cart = JSON.parse(localStorage.getItem("cart") || "{}");
    this.textContents = [];
    this.addEventListeners();
    this.renderCart();
  }
  addEventListeners() {
    document
      .querySelector(".cart-container")
      .addEventListener("click", this.renderCart.bind(this));
    document
      .querySelector(".order")
      .addEventListener("click", this.order.bind(this));
  }
  async renderCart() {
    console.log("renderCart started");
    let total = 0;
    let cartDomString = `<div class="order__column">
                                    <div class="col__primary-5">Products</div>
                              </div>`;
    for (const productId in this.cart) {
      console.log(`Processing product with ID: ${productId}`);
      const product = await this.productsService.getProductById(productId);
      cartDomString += this.createCartProductDomString(product);
      total += product.price * this.cart[productId];
    }
    cartDomString += ` <div class="order__column-total">
                            <div class="col-5"><strong>TOTAL</strong></div>
                            <div class="col-3"><strong>$${total.toFixed(2)}</strong></div>
                         </div>`;
    this.container.innerHTML = cartDomString;
    console.log("Container HTML updated");
    this.container
      .querySelectorAll(".plus")
      .forEach((el) =>
        el.addEventListener("click", (ev) =>
          this.changeQuantity(ev, this.addProductOperation)
        )
      );
    this.container
      .querySelectorAll(".minus")
      .forEach((el) =>
        el.addEventListener("click", (ev) =>
          this.changeQuantity(ev, this.deleteProductOperation)
        )
      );
    document.querySelector(".cart-badge__counter").innerHTML = Array.from(
      document.querySelectorAll(".col__quantity-2")
    )
      .map((element) => parseInt(element.textContent, 10))
      .reduce((total, value) => total + (isNaN(value) ? 0 : value), 0);
    if (Object.keys(this.cart).length > 0) {
      document.querySelector(".cart-badge").classList.remove("hidden");
    } else {
      document.querySelector(".cart-badge").classList.add("hidden");
    }
  }

  createCartProductDomString(product) {
    console.log(product);
    return `<div class="order__column" data-id="${product.id}">
    <div class="order__column-product">
      <div class="order__column-inner">
        <div class="col-6"><img src="${product.images}"></div>
        <div class="col-5">${product.name}</div>
        <div class="order__column-info">
          <div class="order__column-quantity">
            <div class="col-3">${product.price}</div>
            <div class="order__column-counter">
              <div class="col-1"><button data-id=${product.id} class="btn btn-sm minus">-</button></div>
              <div class="col__quantity-2">${this.cart[product.id]}</div>
              <div class="col-1"><button data-id=${product.id} class="btn btn-sm plus">+</button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr>
  </div>`;
  }
  changeQuantity(ev, operation) {
    ev.stopPropagation();
    operation.call(this, ev.target.dataset.id);
    // Виклик renderCart лише якщо клікнуто на кнопку плюс або мінус
    if (
      ev.target.classList.contains("plus") ||
      ev.target.classList.contains("minus")
    ) {
      this.saveCart();
      this.renderCart();
    }
  }
  addProductOperation(id) {
    this.cart[id] = (this.cart[id] || 0) + 1;
  }
  deleteProductOperation(id) {
    if (this.cart[id] > 1) {
      this.cart[id] -= 1;
    } else {
      delete this.cart[id];
    }
  }
  addProduct(id) {
    this.addProductOperation(id);
    this.saveCart();
    this.renderCart();
  }
  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }
  async order(ev) {
    if (Object.keys(this.cart).length === 0)
      return showAlert("Please choose products to order", false);
    const form = document.querySelector(".form-contacts");
    if (!form.checkValidity())
      return showAlert("Please fill form correctly", false);
    ev.preventDefault();
    const data = new FormData();
    data.append("cart", JSON.stringify(this.cart));
    data.append("name", form.querySelector("input[name=name]").value);
    data.append("email", form.querySelector("input[name=email]").value);
    fetch("https://formspree.io/f/mrgjwwro", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: data,
    })
      .then(() => {
        form.reset();
        this.cart = {};
        this.saveCart();
        this.renderCart();
        showAlert("Thank you! ");
        document.querySelector("#modal-cart .close-btn").click();
      })
      .catch((error) => showAlert("There is an error: " + error, false));
  }
}
new Cart();

const orderForm = document.querySelector(".cart");

document.querySelector(".cart-badge").addEventListener("click", () => {
  orderForm.classList.remove("cart__hidden");
  document.querySelector(".cart__content").classList.remove("cart__hidden");
  document.querySelector(".cart-badge").classList.add("hidden");
});

document.querySelector(".cart__header-close").addEventListener("click", () => {
  orderForm.classList.add("cart__hidden");
  document.querySelector(".cart__content").classList.add("cart__hidden");
  document.querySelector(".cart-badge").classList.remove("hidden");
});
