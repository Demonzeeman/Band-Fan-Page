if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoad", ready);
} else {
  ready();
}
//NB

function ready() {
  var removeCartItemButtons = document.getElementsByClassName("btn-danger"); //return all the element's that have the class 'btn-danger
  for (var i = 0; i < removeCartItemButtons.length; i++) {
    //loop through all the buttons in the list with the same class
    var button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  var quantityInputs = document.getElementsByClassName("cart-quantity-input"); // checking input adjustments of the quantity
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged); //any changes in quantity will trigger the function quantityChanged
  }

  var addToCartButtons = document.getElementsByClassName("shop-item-button");
  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener("click", addToCartClicked); //observing when purchase is clicked and runs the function
  }

  document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function purchaseClicked() {
  alert('Thank you for your purchase')
  var cartItems = document.getElementsByClassName("cart-items")[0]
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild) //loops through the items and removes the child and it will do this each time until cart is empty
  }
  updateCartTotal();
}

function removeCartItem(event) {
  var buttonClicked = event.target; //link the click event to the element that was clicked
  buttonClicked.parentElement.parentElement.remove(); //remove the parentElement (cart-row)
  updateCartTotal(); //update the total number of cart items using the function that comes next
}

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    //checks if the value is not a number OR || if the input value is less than zero
    input.value = 1; //this is the lowest number we want people to purchase an item of
  }
  updateCartTotal();
}

function addToCartClicked(event) {
  // need to add the item image, name price etc to cart
  var button = event.target;
  var shopItem = button.parentElement.parentElement;
  var title = shopItem.getElementsByClassName("shop-item-title")[0].innerText; //grabs the element and the text that goes with it
  var price = shopItem.getElementsByClassName("shop-item-price")[0].innerText; //grabs the element and price that goes with it
  var imageSrc = shopItem.getElementsByClassName("shop-item-image")[0].src; //no text in an image, but we want the source attribute instead
  console.log(title, price, imageSrc);
  addItemToCart(title, price, imageSrc);
  updateCartTotal();
}

function addItemToCart(title, price, imageSrc) {
  var cartRow = document.createElement("div"); // going to add a DIV the cart
  cartRow.classList.add("cart-row"); //adds the CSS styling to this section
  var cartItems = document.getElementsByClassName("cart-items")[0];
  var cartItemNames = cartItems.getElementsByClassName("cart-item-title");
  for (var i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      alert("This item is already added to the cart");
      return;
    }
  }

  var cartRowContents = `
  <div class="cart-item cart-column">
        <img class="cart-item-image" src="${imageSrc}" width="100" height="100" />
        <span class="cart-item-title">${title}</span>
  </div>
  <span class="cart-price cart-column">${price}</span>
  <div class="cart-quantity cart-column">
      <input class="cart-quantity-input" type="number" value="1" />
      <button class="btn btn-danger" role="button">REMOVE</button>
  </div>`; //copy and paste the contents from the "cart-row" div in html
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow); //append adds the new cart row to the end of the cart items
  cartRow.getElementsByClassName("btn-danger")[0].addEventListener(
    "click", // watches when the "remove" button is clicked
    removeCartItem
  );
  cartRow
    .getElementsByClassName("cart-quantity-input")[0]
    .addEventListener("change", quantityChanged); // this allows the quantity adjustment to change the total, kept breaking changes
}

function updateCartTotal() {
  //forgot to close my brackets....
  var cartItemContainer = document.getElementsByClassName("cart-items")[0]; //[0] selects first items in the array of cart items returned
  var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  var total = 0; //this will be adjusted at the end of the function
  for (var i = 0; i < cartRows.length; i++) {
    // loop through all the different cart rows
    var cartRow = cartRows[i]; //sets this equal to whichever item we are on in the array
    var priceElement = cartRow.getElementsByClassName("cart-price")[0];
    var quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    //currently  have the element and not the information inside of it
    var price = parseFloat(priceElement.innerText.replace("$", "")); //grabs the number using innerText and replaces dollar sign with nothing
    //parseFloat turns any string into a float which is a number with decimal points
    var quantity = quantityElement.value;
    total = total + price * quantity; // now we have a total formula from the cart
  }
  total = Math.round(total * 100) / 100; // this keeps the total t only having 2 decimal points. So does not create a .999999 value
  document.getElementsByClassName("cart-total-price")[0].innerText =
    "$" + total; // this will set the total to be the result of the function and include a dollar sign
}

