function filterProducts() {
    var select = document.getElementById("sort-select");
    var selectedOption = select.options[select.selectedIndex].value;

    var products = document.querySelectorAll('.suits-item');

    var sortedProducts = Array.from(products).sort(function(a, b) {
        var priceA = parseFloat(a.querySelector('.span').textContent.replace('$', ''));
        var priceB = parseFloat(b.querySelector('.span').textContent.replace('$', ''));

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
    var productList = document.getElementById('products');
    productList.innerHTML = '';

    // Append sorted products to the product list
    sortedProducts.forEach(function(product) {
        productList.appendChild(product);
    });
}



//PRICE FILTER


// JavaScript code for filtering items based on price range
document.addEventListener("DOMContentLoaded", function() {
    const minInput = document.querySelector(".input-min");
    const maxInput = document.querySelector(".input-max");
    const items = document.querySelectorAll(".suits-item");

    function filterItems() {
      const minPrice = parseFloat(minInput.value);
      const maxPrice = parseFloat(maxInput.value);
      
      items.forEach(item => {
        const itemPrice = parseFloat(item.querySelector(".price .span").textContent.slice(1));
        if (itemPrice >= minPrice && itemPrice <= maxPrice) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    }

    // Initial filter
    filterItems();

    // Event listeners for input changes
    minInput.addEventListener("input", filterItems);
    maxInput.addEventListener("input", filterItems);
  });
  
  // Add event listeners to input fields for price filtering
  document.querySelector('.input-min').addEventListener('input', filterProductsByPrice);
  document.querySelector('.input-max').addEventListener('input', filterProductsByPrice);
  
  // Call the filter function initially to ensure items are filtered on page load if needed
  filterProductsByPrice();
  


// COLOR FILTER
 
// Initially show all items
filterColor("all");

// Function to filter items based on color
function filterColor(color) {
  var items = document.getElementsByClassName("suits-item");
  
  // If "all" is selected, show all items
  if (color === "all") {
    for (var i = 0; i < items.length; i++) {
      showItem(items[i]);
    }
  } else {
    // Iterate through items, hide those that don't match selected color
    for (var i = 0; i < items.length; i++) {
      if (items[i].getAttribute("data-color") === color) {
        showItem(items[i]);
      } else {
        hideItem(items[i]);
      }
    }
  }
}

// Function to hide an item
function hideItem(item) {
  item.style.display = "none";
}

// Function to show an item
function showItem(item) {
  item.style.display = ""; // Reset display to default (block or inline, etc.)
}

// Add active class to the current button (highlight it)
var colorFilterContainer = document.getElementById("myColorFilterContainer");
var colorBtns = colorFilterContainer.getElementsByClassName("color-btn");
for (var i = 0; i < colorBtns.length; i++) {
  colorBtns[i].addEventListener("click", function(){
    var current = colorFilterContainer.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

// MATERIAL TYPE 


// Function to filter items by material
function filterMaterial(material) {
    var items = document.getElementsByClassName("suits-item");
    for (var i = 0; i < items.length; i++) {
      if (material === "all" || items[i].getAttribute("data-material") === material) {
        showItem(items[i]);
      } else {
        hideItem(items[i]);
      }
    }
  }
  
  // Function to hide an item
  function hideItem(item) {
    item.style.display = "none";
  }
  
  // Function to show an item
  function showItem(item) {
    item.style.display = "block";
  }




// SIZE FILTER
function filterSize(c) {
    var items = document.getElementsByClassName('suits-item');
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var dataSize = item.getAttribute('data-size');
      if (c === 'all' || dataSize === c) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    }
  }
  