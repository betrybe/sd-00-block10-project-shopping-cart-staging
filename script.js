

window.onload = function onload() { };
const items = document.querySelector(".items");
const itemCard = document.querySelector(".cart__items");
const itemPrice = document.querySelector(".cart__price");
const deleteButton = document.querySelector(".empty-cart");
const text = 'Loading...'
var computers;
var name;
var sku;
var image;
var salePrice;
var results;
let totalPrice = localStorage.getItem("totalPrice") === null ? 0 : localStorage.getItem("totalPrice")
var localSku = JSON.parse(localStorage.getItem("item")) === null ? [] : JSON.parse(localStorage.getItem("item"));
var localName, localSalePrice = [];


function request() {
  items.appendChild(createCustomElement('span', 'loading', text))
  const divLoading = document.querySelector(".loading")
  fetch("https://api.mercadolibre.com/sites/MLB/search?q=computador")
    .then(response => response.json())
    .then(data => {
      computers = data.results;
      divLoading.remove();
      validateRequest(computers);

      for (let i = 0; i < computers.length; i++) {
        name = computers[i].title;
        sku = computers[i].id;
        image = computers[i].thumbnail;

        const section = createProductItemElement({ sku, name, image })
        items.appendChild(section)
        const buttons = document.querySelectorAll(".item__add");
        var button = buttons[i];

        button.setAttribute("onClick", "requestItem(this.getAttribute('data-id'));");
        button.setAttribute("data-id", sku);

      }
    })
    .catch(err => {
      error()
    }
    )
}

request()

function requestItem(dataId) {
  fetch(`https://api.mercadolibre.com/items/${dataId}`)
    .then(response => response.json())
    .then(data => {
      results = data;
      setLocalStorage(data)
    })
    .catch(err => {
      error()
    })

}

function searchList() {

  for (let i = 0; i < localSku.length; i++) {
    itemCard.appendChild(createCartItemElement(localSku[i]))
    itemPrice.innerHTML = totalPrice

  }

}

async function setLocalStorage(data) {
  const
    {
      id,
      title,
      price
    } = data;

  let valueItem = { sku: id, name: title, salePrice: price }
  localSku.push(valueItem)
  localStorage.setItem('item', JSON.stringify(localSku))
  itemCard.appendChild(createCartItemElement(valueItem))
  let totalPrice = await sumPrice();
  itemPrice.innerHTML = totalPrice;
}

async function sumPrice() {
  let totalSum = await localSku.map((item) => item.salePrice).reduce((previousValue, currentValue) => previousValue + currentValue)
  localStorage.setItem('totalPrice', totalSum)
  return await localStorage.getItem('totalPrice', totalSum);
}

function validateRequest(computers) {
  var loading
  if (computers == 0) {
    var text = 'Loading...'
    loading = items.appendChild(createCustomElement('span', 'loading', text))
  }
  return loading
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}


function cartItemClickListener(event) {
  event.preventDefault();
  for (let i = 0; i < localSku.length; i++) {
    if (event.target.id === localSku[i].sku) {
      localSku.splice(i, 1)
    }
  }

  localStorage.setItem('item', JSON.stringify(localSku))
  localStorage.setItem('totalPrice', 0)

  itemPrice.innerHTML = 0;
  if (localSku.length > 0) {
    let updateTotalValue = localSku.map(item => item.salePrice)
      .reduce((previousValue, currentValue) => (previousValue === null || undefined) ? 0 : previousValue + currentValue)
    localStorage.setItem('totalPrice', updateTotalValue)
    itemPrice.innerHTML = updateTotalValue;
  }
  event.target.remove()

}


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = sku
  li.addEventListener('click', cartItemClickListener);
  return li;
}

searchList();

deleteButton.addEventListener("click", function (event) {
  event.preventDefault()
  while (itemCard.firstChild) {
    itemCard.removeChild(itemCard.firstChild);
  }
  localStorage.clear();
  itemPrice.innerHTML = 0
  localSku = [];

})

function error() {
  erroUrl = `
      <div class="erro">
          <h1 class="erro-title">
          Parece que algo de errado não esta certo </h1>
          <p>  Atualize a página! </p>
          <img src="assets/error.gif">
      </div>
  `
  items.innerHTML += erroUrl;
  return erroUrl;
}
