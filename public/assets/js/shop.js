//SORT USING PRODUCT TYPE
  function filterItems(category) {
    const items = document.querySelectorAll('.shop-item');
    
    items.forEach(item => {
      const itemType = item.getAttribute('data-type');
      if (category === 'all' || itemType === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  //SORT FROM THE HIGHEST TO LOWEST 
  function filterProducts() {
    var select = document.getElementById("sort-select");
    var selectedOption = select.options[select.selectedIndex].value;

    var products = document.querySelectorAll('.shop-item');

    var sortedProducts = Array.from(products).sort(function(a, b) {
        var priceA = parseFloat(a.querySelector('.price .span').textContent.replace('$', ''));
        var priceB = parseFloat(b.querySelector('.price .span').textContent.replace('$', ''));

        if (selectedOption === "highest") {
            return priceB - priceA;
        } else if (selectedOption === "lowest") {
            return priceA - priceB;
        } else {
            // Do nothing for other options or handle as needed
            return 0;
        }
    });

    // Clear the current product list
    var productList = document.querySelector('.shop-ul');
    productList.innerHTML = '';

    // Append sorted products to the product list
    sortedProducts.forEach(function(product) {
        productList.appendChild(product);
    });
}




//SORT USING COLOR function filterColor(color) {
    var products = document.querySelectorAll('.shop-item');

    products.forEach(function(product) {
        var productColor = product.getAttribute('data-color');

        if (color === 'all' || productColor === color) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });

    
    