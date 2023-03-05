class ProductDetails extends HTMLElement {
  constructor() {
    super()
    this.addToCartEl = document.getElementById('AddToCart');
    this.addToCart = this.addToCart.bind(this)
    this.init()
  }

  getCartItems = () => {
    return fetch(`${routes.cart_url}`, {...fetchConfig(), method: 'GET'})
      .then(response => response.json())
      .then(state => {
        return state
      })
      .catch((error) => console.log({error})
      )
  }

  addToCart = async () => {
    const cartItems = await this.getCartItems()
    if (cartItems) {
      const id = parseInt(document.getElementById('productSelect').value, 10)
      const quantity = parseInt(document.getElementById('Quantity').value, 10)
      const properties = {cart_index: cartItems?.items?.length}
      const formPayload = {id, quantity, properties}
      const body = JSON.stringify(formPayload);
      fetch(`${routes.cart_add_url}`, {...fetchConfig(), ...{body}})
        .then((response) => response.text())
        .then((state) => {
          const payload = JSON.parse(state)
        }).catch((error) => console.log({error}))
    }
  }

  init() {
    this.addToCartEl.addEventListener('click', async (event) => {
      event.preventDefault()
      await this.addToCart()
    })
  }

}


if (!customElements.get('product-details')) {
  customElements.define('product-details', ProductDetails)
}