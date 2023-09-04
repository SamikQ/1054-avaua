// import { ProductsService } from './products-service.js';
// import { Cart } from './cart.js';

// export class ProductList {
//     constructor() {
//         this.container = document.querySelector(".shop__products");
//         this.ProductsService = new ProductsService();
//         this.slides = [];
//         this.currentSlide = 0;
//         this.renderProducts();
//     }

//     async renderProducts() {
//         const products = await this.ProductsService.getProducts();
//         let productListDomString = '';

//         products.forEach(product => {
//             productListDomString += this.createProductDomString(product);
//         });

//         this.container.innerHTML = productListDomString;
//         this.slides = this.splitIntoSlides(productListDomString, this.getSlideCount());
//         this.currentSlide = 0;
//         this.renderSlide();
//         this.renderIndicators();
//         this.addEventListeners();
//     }

//     createProductDomString(product) {
//         return `<article class="card col-12 col-sm-6 col-md-4 col-lg-3">
//             <div class="card-body">
//                 <div class="shop__product product">
//                     <a href="store-product.html?id=${product.id}"><img src="${product.images}" alt="${product.name}"></a>
//                     <a href="store-product.html" class="product__name">${product.name}</a>
//                     <p class="product__price">${product.price.toFixed(2)}${product.currency}</p>
//                     <a href="#" class="button btn-primary add-btn" data-id=${product.id}>Buy</a>
//                 </div>
//             </div>
//         </article>`;
//     }

//     addEventListeners() {
//         document.querySelectorAll('.add-btn').forEach(btn => {
//             btn.addEventListener('click', this.addProductToCart.bind(this));
//         });
//     }

//     addProductToCart(event) {
//         const id = event.target.dataset.id;
//         const cart = new Cart();
//         cart.addProduct(id);
//     }

//     splitIntoSlides(productListDomString, numSlides) {
//         const productListArray = productListDomString.split('</article>');
//         const slides = [];

//         for (let i = 0; i < productListArray.length; i += numSlides) {
//             slides.push(productListArray.slice(i, i + numSlides).join('</article>'));
//         }

//         return slides;
//     }

//     // renderSlide() {
//     //     const productsContainer = document.querySelector(".shop__products");
//     //     productsContainer.innerHTML = this.slides[this.currentSlide] || "";
//     // }

//     renderSlide() {
//         const productsContainer = document.querySelector(".shop__products");
//         const products = this.ProductsService.getProducts(); // Отримуємо всі продукти з об'єкту JSON
    
//         // Перевіряємо, чи існує поточний слайд у списку продуктів
//         if (this.currentSlide >= 0 && this.currentSlide < products.length) {
//             const product = products[this.currentSlide];
//             const productDomString = this.createProductDomString(product);
//             productsContainer.innerHTML = productDomString;
//         } else {
//             productsContainer.innerHTML = ""; // Очищаємо контейнер, якщо немає продукта для відображення
//         }
//     }

//     renderIndicators() {
//         const indicatorsContainer = document.querySelector(".shop__carousel-indicators");
//         indicatorsContainer.innerHTML = "";

//         for (let i = 0; i < this.slides.length; i++) {
//             indicatorsContainer.innerHTML += `<button class="shop__carousel-indicator ${i === this.currentSlide ? "shop__carousel-indicator--active" : ""}"></button>`;
//         }

//         const indicators = document.querySelectorAll(".shop__carousel-indicator");
//         indicators.forEach((indicator, index) => {
//             indicator.addEventListener("click", () => {
//                 this.currentSlide = index;
//                 this.renderSlide();
//                 this.renderIndicators();
//             });

//             indicator.addEventListener("mouseover", () => {
//                 indicator.classList.add("shop__button--hover");
//             });

//             indicator.addEventListener("mouseout", () => {
//                 indicator.classList.remove("shop__button--hover");
//             });
//         });
//     }

//     getSlideCount() {
//         if (window.matchMedia("(min-width: 1200px)").matches) {
//             return 3;
//         } else if (window.matchMedia("(min-width: 768px)").matches) {
//             return 2;
//         } else {
//             return 1;
//         }
//     }
// }

// const productList = new ProductList();

// const nextButton = document.querySelector(".shop__arrowR");
// nextButton.addEventListener("click", () => {
//     productList.currentSlide = productList.currentSlide + 1 >= productList.slides.length ? 0 : productList.currentSlide + 1;
//     productList.renderSlide();
//     productList.renderIndicators();
// });

// const prevButton = document.querySelector(".shop__arrowL");
// prevButton.addEventListener("click", () => {
//     productList.currentSlide = productList.currentSlide - 1 < 0 ? productList.slides.length - 1 : productList.currentSlide - 1;
//     productList.renderSlide();
//     productList.renderIndicators();
// });

// window.addEventListener('resize', () => {
//     productList.renderProducts();
// });

const slides = [];
let currentSlide = 0;
const nextButton = document.querySelector('.shop__arrowR');
nextButton.addEventListener('click', nextSlide);
const prevButton = document.querySelector('.shop__arrowL');
prevButton.addEventListener('click', prevSlide);

fetch('api/products.json') // Завантажуємо JSON-файл з продуктами
  .then((response) => response.json())
  .then((data) => {
    renderProduct(data); // Передаємо дані з JSON в функцію renderProduct
  })
  .catch((error) => {
    console.error('Error fetching products:', error);
  });

function renderProduct(products) {
  const productsContainer = document.querySelector('.shop__products');
  productsContainer.innerHTML = '';

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const imageUrl = Array.isArray(product.images) ? product.images[0] : product.images;
    const content = `
      <div class="shop__product product">
        <a href="store-product.html?id=${product.id}">
          <img src="${imageUrl}" alt="${product.name}">
        </a>
        <a href="store-product.html" class="product__name">${product.name}</a>
        <p class="product__price">${product.price.toFixed(2)}${product.currency}</p>
        <a class="button add-btn" href="#cart-badge"><strong>Add to cart</strong></a>
      </div>`;
    slides.push(content);
  }

  renderSlide();
}

function renderSlide() {
    const productsContainer = document.querySelector('.shop__products');
    productsContainer.innerHTML = '';
  
    if (window.matchMedia('(min-width: 990px)').matches) {
      for (let i = currentSlide; i < currentSlide + 3; i++) {
        const slideIndex = i >= slides.length ? i - slides.length : i;
        productsContainer.innerHTML += slides[slideIndex];
      }
    } else if (window.matchMedia('(min-width: 767px)').matches) {
      for (let i = currentSlide; i < currentSlide + 2; i++) {
        const slideIndex = i >= slides.length ? i - slides.length : i;
        productsContainer.innerHTML += slides[slideIndex];
      }
    } else {
      productsContainer.innerHTML = slides[currentSlide];
    }
  
    renderIndicators();
  }
  
  function nextSlide() {
    currentSlide = currentSlide + 1 >= slides.length ? 0 : currentSlide + 1;
    renderSlide();
  }
  
  function prevSlide() {
    currentSlide = currentSlide - 1 < 0 ? slides.length - 1 : currentSlide - 1;
    renderSlide();
  }
  
  window.addEventListener('resize', renderProduct);
  
  function renderIndicators() {
    const indicatorsContainer = document.querySelector('.shop__carousel-indicators');
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < slides.length; i++) {
      indicatorsContainer.innerHTML += `<button class="shop__carousel-indicator ${i === currentSlide ? 'shop__carousel-indicator--active' : ''}"></button>`;
    }
    const indicators = document.querySelectorAll('.shop__carousel-indicator');
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        currentSlide = index;
        renderSlide();
        renderIndicators(slides, currentSlide);
      });
      indicator.addEventListener('mouseover', () => {
        indicator.classList.add('shop__button--hover');
      });
  
      indicator.addEventListener('mouseout', () => {
        indicator.classList.remove('shop__button--hover');
      });
    });
  }
  
  renderIndicators();