const ENDPOINT = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function fetchPc() {
  return fetch(ENDPOINT).then(r => r.json()).then(r => r.results);
}

function serialize({ id, title, thumbnail }) {
  return { sku: id, name: title, image: thumbnail };
}

fetchPc()
serialize()
