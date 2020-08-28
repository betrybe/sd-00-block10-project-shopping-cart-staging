const ENDPOINT = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const ITEM_ENDPOINT  = (ItemID) => `https://api.mercadolibre.com/items/${ItemID}`

function fetchPc() {
  return fetch(ENDPOINT).then(r => r.json()).then(r => r.results);
}
function fetchItem(ItemID){
  return fetch(ITEM_ENDPOINT(ItemID)).then(r => r.json())
}

function serialize({ id, title, thumbnail,price }) {
  return { sku: id, name: title, image: thumbnail, salePrice:price };
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function addtoCart(itemId){
const item  = await fetchItem(itemId)
console.log(serialize(item))
const cart_item = createCartItemElement(serialize(item))
const cart = document.querySelector('.cart__items')
cart.appendChild(cart_item)
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
  const addButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')
  addButton.addEventListener('click',() => addtoCart(sku))
  section.appendChild(addButton);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function cartItemClickListener(ItemID) {
return undefined

}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click',cartItemClickListener);
  return li;
}

window.onload = async function onload() {
  console.log('cariinho')
  const data = (await fetchPc()).map(serialize).map(createProductItemElement);
  const itemsContainer = document.querySelector('.items');
  data.forEach(item => itemsContainer.appendChild(item));
};
