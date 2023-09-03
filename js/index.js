document.addEventListener('partialsLoaded',async () => {
    await import('./products-service.js');
    await import('./cart.js');
    await import('./shop-list.js');
});


    // await import('./best-deals-list.js');
    // await import('./celebration.js');
    // await import('./contact-form.js');
    // await import('./awards.js');
    // await import('./footer.js');
    // await import('./testimonials.js');
    // await import('./products-catalogue.js');
    // import('./cart-badge.js');