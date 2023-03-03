class ProductDetails extends HTMLElement {
  constructor() {
    super()
    this.addToCartEl = document.getElementById('AddToCart');
    this.addToCart = this.addToCart.bind(this)
    this.init()
  }

  getCartItems = () => {
    return fetch(`${routes.cart_url}`,{...fetchConfig(), method: 'GET'})
      .then(response => response.json())
      .then(state => state)
  }

  addToCart = async () => {
    const cartItems = await this.getCartItems()
    if (cartItems) {
      const formPayload = {
        id: parseInt(document.getElementById('productSelect').value, 10),
        quantity: parseInt(document.getElementById('Quantity').value, 10),
        properties: {
          cart_index: cartItems?.items?.length
        }
      }
      const body = JSON.stringify(formPayload);
      fetch(`${routes.cart_add_url}`, {...fetchConfig(), ...{body}})
        .then((response) => {
          if (!response.ok) throw Error(response?.status)
          return response.text();
        })
        .then((state) => {
          const payload = JSON.parse(state)
          console.log(payload)
        }).catch((error) => {
        console.log({error})
      })
    }
  }

  init() {
    this.addToCartEl.addEventListener('click', (event) => {
      event.preventDefault();

      this.addToCart()
    })
  }

}


if (!customElements.get('product-details')) {
  customElements.define('product-details', ProductDetails)
}