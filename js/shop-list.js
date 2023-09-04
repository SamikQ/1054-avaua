import { Cart } from './cart.js';
import { ProductsService } from './products-service.js';
export class ProductList {
  constructor() {
    this.container = document.querySelector('.shop__products');
    this.productsService = new ProductsService();
    this.currentDisplayedSlide = 0;
    this.currentCarouselSlide = 0;
    this.slides = [];
    this.cart = new Cart();
    this.renderSlide();
    this.visual();
    this.fetchProducts();
  }

  async visual() {
    const nextButton = document.querySelector('.shop__arrowR');
    nextButton.addEventListener('click', () => this.nextSlide());
    const prevButton = document.querySelector('.shop__arrowL');
    prevButton.addEventListener('click', () => this.prevSlide());
  }

  async fetchProducts() {
    try {
      this.slides = await this.productsService.getProducts();
      this.renderSlide();
      this.addEventListeners();
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  nextSlide() {
    this.currentCarouselSlide = this.currentCarouselSlide + 1 >= this.slides.length ? 0 : this.currentCarouselSlide + 1;
    this.renderSlide();
  }

  prevSlide() {
    this.currentCarouselSlide = this.currentCarouselSlide - 1 < 0 ? this.slides.length - 1 : this.currentCarouselSlide - 1;
    this.renderSlide();
  }

  renderSlide() {
    const productsContainer = document.querySelector(".shop__products");
    let productDomString = '';
    for (let i = this.currentCarouselSlide; i < this.currentCarouselSlide + 3; i++) {
      const productIndex = (i + this.slides.length) % this.slides.length;
      const product = this.slides[productIndex];

      if (product) {
        productDomString += this.createProductDomString(product);
      }
    }
    productsContainer.innerHTML = productDomString;
    this.currentDisplayedSlide = this.currentCarouselSlide;
    this.addEventListeners();
  }

  createProductDomString(product) {
    if (!product || typeof product.id === 'undefined') {
      return '';
    }
    return `
        <div class="shop__product product">
          <a href="store-product.html?id=${product.id}">
            <img src="${product.images}" alt="${product.name}">
          </a>
          <a href="store-product.html" class="product__name">${product.name}</a>
          <p class="product__price">${product.price.toFixed(2)}${product.currency}</p>
          <a class="button btn-primary add-btn" href="#" data-id="${product.id}">Add to cart</a>
        </div>`;
  }
  
  addEventListeners() {
    const currentSlideProducts = document.querySelectorAll('.shop__product.product');
    currentSlideProducts.forEach(product => {
      const addBtn = product.querySelector('.add-btn');
      if (addBtn) {
        addBtn.addEventListener('click', (event) => {
          event.preventDefault(); // Відмінити виконання посилання href
          this.addProductToCart(event);
        });
      }
    });
  }

  addProductToCart(event) {
    const id = event.target.dataset.id;
    this.cart.addProduct(id);
  }
}
new ProductList();

//   if (window.matchMedia('(min-width: 990px)').matches) {
//     for (let i = currentSlide; i < currentSlide + 3; i++) {
//       const slideIndex = i >= slides.length ? i - slides.length : i;
//       productsContainer.innerHTML += slides[slideIndex];
//     }
//   } else if (window.matchMedia('(min-width: 767px)').matches) {
//     for (let i = currentSlide; i < currentSlide + 2; i++) {
//       const slideIndex = i >= slides.length ? i - slides.length : i;
//       productsContainer.innerHTML += slides[slideIndex];
//     }
//   } else {
//     productsContainer.innerHTML = slides[currentSlide];
//   }

//   function nextSlide() {
//     currentSlide = currentSlide + 1 >= slides.length ? 0 : currentSlide + 1;
//     renderSlide();
//   }

//   function prevSlide() {
//     currentSlide = currentSlide - 1 < 0 ? slides.length - 1 : currentSlide - 1;
//     renderSlide();
//   }
// }
// }
// window.addEventListener('resize', renderProduct);

// function renderIndicators() {
//   const indicatorsContainer = document.querySelector('.shop__carousel-indicators');
//   indicatorsContainer.innerHTML = '';
//   for (let i = 0; i < slides.length; i++) {
//     indicatorsContainer.innerHTML += `<button class="shop__carousel-indicator ${i === currentSlide ? 'shop__carousel-indicator--active' : ''}"></button>`;
//   }
//   const indicators = document.querySelectorAll('.shop__carousel-indicator');
//   indicators.forEach((indicator, index) => {
//     indicator.addEventListener('click', () => {
//       currentSlide = index;
//       renderSlide();
//       renderIndicators(slides, currentSlide);
//     });
//     indicator.addEventListener('mouseover', () => {
//       indicator.classList.add('shop__button--hover');
//     });

//     indicator.addEventListener('mouseout', () => {
//       indicator.classList.remove('shop__button--hover');
//     });
//   });

const orderForm = document.querySelector('.cart');

document.querySelector('.cart-badge').addEventListener('click', () => {
  orderForm.classList.remove('cart__hidden');
  document.querySelector('.cart__content').classList.remove('cart__hidden');
  document.querySelector('.cart-badge').classList.add('hidden');
});

document.querySelector('.cart__header-close').addEventListener('click', () => {
  orderForm.classList.add('cart__hidden');
  document.querySelector('.cart__content').classList.add('cart__hidden');
  document.querySelector('.cart-badge').classList.remove('hidden');
});