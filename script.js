
async function soma(number, reset) {
  const priceCamp = document.querySelector('.total-price');
  let price = +priceCamp.innerText;
  price += number;
  if (reset) {
    price = 0;
  }
  if (price < 0 || price < 1) {
    price = 0;
  }
  priceCamp.innerText = price;
}


// LOCALSTORAGE FUNCTIONsS
function updateLocalStorage(elementId) {
  const elementToLocal = document.querySelector(elementId).innerHTML;
  localStorage.setItem(elementId, elementToLocal);
  const price = document.querySelector('.total-price').innerHTML;
  localStorage.setItem('price', price);
}

function cartItemClickListener(e) {
  e.target.parentNode.removeChild(e.target);
  const price = e.target.innerText.split('PRICE: $')[1];
  soma(+price * (-1));
  updateLocalStorage('.cart__items');
}


function returnFromLocalStorage(elementId) {
  document.querySelector(elementId).innerHTML = localStorage.getItem(elementId);
  const cartItems = document.querySelectorAll('.cart__item');
  for (let i = 0; i < cartItems.length; i += 1) {
    cartItems[i].addEventListener('click', e => cartItemClickListener(e));
  }
  if (localStorage.getItem('price')) {
    document.querySelector('.total-price').innerHTML = localStorage.getItem('price');
  }
}


// ----------------------------------------------------------------


// CREATE EMPTY CART BUTTON

function emptyCartfunc() {
  if (document.querySelector('.cart__items')) {
    document.querySelector('.cart__items').innerHTML = '';
    soma(0, true);
    updateLocalStorage('.cart__items');
  }
}


// ----------------------------------------------------------------


function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', e => cartItemClickListener(e));
  return li;
}


function addToCart(ItemID) {
  fetch(`https://api.mercadolibre.com/items/${ItemID}`)
    .then(e => e.json())
    .then((e) => {
      const objeto = { sku: [e.id], name: [e.title], salePrice: [e.price] };
      const cartElement = createCartItemElement(objeto);
      document.querySelector('.cart__items').appendChild(cartElement);
      soma(e.price);
      updateLocalStorage('.cart__items');
    });
}


function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function addEvents() {
  const buttons = document.getElementsByClassName('item__add');
  for (let i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', e => addToCart(e.target.parentNode.querySelector('.item__sku').innerText));
  }
}

function showLoading() {
  const newelement = createCustomElement('p', 'loading', 'Loading');
  document.body.append(newelement);
}
function deleteLoading() {
  document.body.removeChild(document.querySelector('.loading'));
}

const itens = document.querySelector('.items');

const start = new Promise((resolve) => {
  showLoading();
  console.log('roudou primisu');
  resolve('done');
}).then(() => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((result) => {
      deleteLoading();
      return result.json();
    })
    .then(result => result.results)
    .then(result => result.forEach((e) => {
      const elementObject = {
        sku: [e.id],
        name: [e.title],
        image: [e.thumbnail],
      };
      const elemento = createProductItemElement(elementObject);
      itens.appendChild(elemento);
    }))
    .then(addEvents);
});


window.onload = async function onload() {
  returnFromLocalStorage('.cart__items');

  const emptyCart = document.querySelector('.empty-cart');

  emptyCart.addEventListener('click', emptyCartfunc);


  await start;
};


// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
