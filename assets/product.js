class ProductDetails extends HTMLElement {
  constructor() {
    super()
    this.addToCartEl = document.getElementById('AddToCart');
    this.toggleNotesEl = document.getElementById('add-instructions');
    this.notesInputEl = document.getElementById('order-notes');
    this.notesWrapEl = document.querySelector('.order-notes');
    this.orderNote = ''
    this.addToCart = this.addToCart.bind(this)
    this.init()
  }

  getCartItems = () => {
    return fetch(`${routes.cart_url}`, {...fetchConfig(), method: 'GET'})
      .then(response => response.json())
      .then(state => {
        this.orderNote = state.note
        console.log('received items from cart')
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
      const note = `${this.orderNote}
        ${id}: ${this.notesInputEl.value}
        `
      const formPayload = {id, quantity, properties, note}
      const body = JSON.stringify(formPayload);
      fetch(`${routes.cart_add_url}`, {...fetchConfig(), ...{body}})
        .then((response) => response.text())
        .then((state) => {
          const payload = JSON.parse(state)
        }).catch((error) => console.log({error}))
    }
  }

  toggleNotes = () => {
    if (this.toggleNotesEl.checked) {
      this.notesWrapEl.style = "display: grid"
    } else {
      this.notesWrapEl.style = "display: none"
    }
  }

  init() {
    this.addToCartEl.addEventListener('click', async (event) => {
      event.preventDefault()
      await this.addToCart()
    })
    this.toggleNotesEl.addEventListener('change', (event) => {
      this.toggleNotes()
    })
  }

}


if (!customElements.get('product-details')) {
  customElements.define('product-details', ProductDetails)
}