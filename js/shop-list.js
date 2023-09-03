import { ProductsService } from './products-service.js';
import { Cart } from './cart.js';


export class ProductList {
    constructor() {
        this.container = document.querySelector(".shop__products");
        this.ProductsService = new ProductsService();
        this.renderProducts();
    }
    async renderProducts() {
        let productListDomString = '';
        const products = await this.ProductsService.getProducts();
        products.forEach(product => {
            productListDomString += this.cCreateProductDomString(product);
        });
        this.container.innerHTML = productListDomString;
        this.addEventListeners();
    }
    cCreateProductDomString(product) {
        return `<article class="card col-12 col-sm-6 col-md-4 col-lg-3">
        <img src="img/${product.image}" class="card-img-top" alt="${product.title}">
        <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <a href="#" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#product-info-modal" data-id=${product.id}>Info</a>
            <a href="#" class="btn btn-primary add-btn" data-id=${product.id}> ${product.price} Buy</a>
        </div>
</article>`;
    }
    addEventListeners() {
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', this.addProductToCart.bind(this));
        });
    }

    addProductToCart(event) {
        const id = event.target.dataset.id;
        const cart = new Cart();
        cart.addProduct(id);
    }
}
new ProductList();

// function renderProduct(products) {
//     const productsContainer = document.querySelector('.shop__products')
//     productsContainer.innerHTML = ''
//     for (let i = 0; i < products.length; i++) {
//         const content =
//             `<div class="shop__product product">
//                 <div class="shop__product product">
//                 <a href="store-product.html?id=${products[i].code}"><img src="${products[i].images[0]}" alt="${products[i].name}"></img></a>
//                 <a href="store-product.html" class="product__name">${products[i].name}</a>
//                 <p class="product__price">${products[i].price.toFixed(2)}${products[i].currency}</p>
//                 <a class="button add-btn" href="#cart-badge"><strong>Add to cart</strong></a>
//                 </div>
//             </div>`;
//         slides.push(content)
//     }
//     renderSlide()
// }

// const slides = [];
// let currentSlide = 0;
// const nextButton = document.querySelector(".shop__arrowR");
// nextButton.addEventListener("click", nextSlide);
// const prevButton = document.querySelector(".shop__arrowL");
// prevButton.addEventListener("click", prevSlide);

// function renderSlide() {
//   const productsContainer = document.querySelector(".shop__products");
//   productsContainer.innerHTML = "";

//   if (window.matchMedia("(min-width: 990px)").matches) {
//     for (let i = currentSlide; i < currentSlide + 3; i++) {
//       const slideIndex = i >= slides.length ? i - slides.length : i;
//       productsContainer.innerHTML += slides[slideIndex];
//     }
//   } else if (window.matchMedia("(min-width: 767px)").matches) {
//     for (let i = currentSlide; i < currentSlide + 2; i++) {
//       const slideIndex = i >= slides.length ? i - slides.length : i;
//       productsContainer.innerHTML += slides[slideIndex];
//     }
//   } else {
//     productsContainer.innerHTML = slides[currentSlide];
//   }

//   renderIndicators();
// }

// function nextSlide() {
//   currentSlide = currentSlide + 1 >= slides.length ? 0 : currentSlide + 1;
//   renderSlide();
// }

// function prevSlide() {
//   currentSlide = currentSlide - 1 < 0 ? slides.length - 1 : currentSlide - 1;
//   renderSlide();
// }

// window.addEventListener('resize', renderProducts)

// function renderIndicators() {
//   const indicatorsContainer = document.querySelector(
//     ".shop__carousel-indicators"
//   );
//   indicatorsContainer.innerHTML = "";
//   for (let i = 0; i < slides.length; i++) {
//     indicatorsContainer.innerHTML += `<button class="shop__carousel-indicator ${
//       i === currentSlide ? "shop__carousel-indicator--active" : ""
//     }"></button>`;
//   }
//   const indicators = document.querySelectorAll(".shop__carousel-indicator");
//   indicators.forEach((indicator, index) => {
//     indicator.addEventListener("click", () => {
//       currentSlide = index;
//       renderSlide();
//       renderIndicators(slides, currentSlide);
//     });
//     indicator.addEventListener("mouseover", () => {
//       indicator.classList.add("shop__button--hover");
//     });

//     indicator.addEventListener("mouseout", () => {
//       indicator.classList.remove("shop__button--hover");
//     });
//   });
// }

// renderIndicators();
