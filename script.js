window.onload = function onload() { 
  getData();  
  deleteList(); 
  loadCartFromLocalStorage() 
};


function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductButtonElement(price, title, id){
  const button = document.createElement('button')
  button.className = 'item__add';
  button.innerText = 'Adicionar ao carrinho!';
  button.setAttribute('onclick', 'cartItemClickListener(this)')
  button.setAttribute('data-price', price)
  button.setAttribute('data-title', title)
  button.setAttribute('id', id)


  return button

}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  
  return e;
}

function createProductItemElement({ id, title, thumbnail, price }) {
  const section = document.createElement('section');
  const  parentSection = document.querySelector(".items")
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createProductButtonElement(price, title, id))
  parentSection.appendChild(section)
  
  return section;
  
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;

}

async function cartItemClickListener(event) {
  const id = event.getAttribute("id")
  const price = event.getAttribute("data-price")
  const title = event.getAttribute("data-title")
  
  
  createCartItemElement(id, title, price)
  const item = {
    id, title, price
  }
  await saveToStorage(item)
  await sum()  


}

function getData() {
  let loading = document.querySelector('.loading')

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data =>  {
      if (data.results !== undefined) {
        const { results } = data
        results.map(item=>{
          createProductItemElement(item)          
        })
        loading.style.display = "none"
        
      }
    })
      

    
}


function deleteItem(item){

 
  let cart = localStorage.getItem('cart') !== null ?
   JSON.parse(localStorage.getItem('cart'))
   :[]
  

  if(cart.length > 0){
    const id = item.target.getAttribute('id')
    const price = item.target.getAttribute('data-price')


    
    item.target.remove()
    let index = cart.filter(item =>
      item.id === id 
    )
    if(cart.indexOf(index[0]) !== -1){
      cart.splice(index[0], 1)
     
      localStorage.removeItem('cart')
      localStorage.setItem('cart', JSON.stringify(cart))
     sub(price)
    }
  }
  
  
}



function createCartItemElement( sku, name, salePrice ) {
  const li = document.createElement('li');
  const ul = document.querySelector('.cart__items')
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.setAttribute('data-price', salePrice)
  li.setAttribute('id', sku)

  li.addEventListener('click', deleteItem);
  
  ul.appendChild(li)  

  return li;
}

function deleteList() {
  let btnDelete = document.querySelector('.empty-cart')
  let ul = document.querySelector('.cart__items')
  let li = document.querySelector('.cart__item')
  
  btnDelete.addEventListener('click', ()=>{
    ul.remove()
    localStorage.removeItem('cart')    
  })
}



function saveToStorage(item) {
  let cart = localStorage.getItem('cart') !== null ?
   JSON.parse(localStorage.getItem('cart'))
   :[]
  cart.push(item)  
  localStorage.setItem('cart', JSON.stringify(cart))

}


function sum(){
  let total = document.querySelector('.sum-price')
  let soma = 0
  let cart = localStorage.getItem('cart') !== null ?
   JSON.parse(localStorage.getItem('cart'))
   :[]
  if(cart.length > 0){
    
  cart.forEach(item =>{    
    soma += parseFloat(item.price)  
  })
  total.innerHTML = soma.toFixed(2)
  } 
  
}

function sub(price){
  const total = document.querySelector('.sum-price')
  let menos = parseFloat(total.innerText)
  menos -= parseFloat(price)  
  total.innerHTML = menos.toFixed(2)
  
  
}

function loadCartFromLocalStorage(){
  let cart = localStorage.getItem('cart') !== null ?
   JSON.parse(localStorage.getItem('cart'))
   :[]
  if(cart.length > 0){
    cart.forEach(item=>{
      createCartItemElement(item.id, item.title, item.price)

    })
    sum()
  }
}
