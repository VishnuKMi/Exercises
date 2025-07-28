import { createContext, useReducer } from 'react'

export const CartContext = createContext({
  items: [],
  addItem: item => {},
  removeItem: id => {},
  clearCart: () => {}
})

function cartReducer (state, action) {
  if (action.type === 'ADD_ITEM') {
    // findIndex return '-1' if value doesn't exist
    const existingCartItemIndex = state.items.findIndex(
      item => item.id === action.item.id
    )

    const updatedItems = [...state.items]

    // if value already exists
    if (existingCartItemIndex > -1) {
      //Add quantity for the item already present in cart.
      const existingItem = state.items[existingCartItemIndex]
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1
      }

      updatedItems[existingCartItemIndex] = updatedItem
    } else {
      //Add full item to cart.
      updatedItems.push({ ...action.item, quantity: 1 })
    }

    return { ...state, items: updatedItems }
  }

  if (action.type === 'REMOVE_ITEM') {
    const existingCartItemIndex = state.items.findIndex(
      item => item.id === action.id
    )
    const existingCartItem = state.items[existingCartItemIndex]

    const updatedItems = [...state.items]

    //Remove entire item from cart
    if (existingCartItem.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1) //will remove 1 item from existingCartItem index
    } else {
      // if quantity is > 1, just reduce the quantity by 1
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1
      }
      updatedItems[existingCartItemIndex] = updatedItem
    }

    return { ...state, items: updatedItems }
  }

  if (action.type === 'CLEAR_CART') {
    return { ...state, items: [] }
  }

  return state
}

export function CartContextProvider ({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] })

  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart
  }

  function addItem (item) {
    dispatchCartAction({ type: 'ADD_ITEM', item })
  }

  function removeItem (id) {
    dispatchCartAction({ type: 'REMOVE_ITEM', id })
  }

  function clearCart () {
    dispatchCartAction({ type: 'CLEAR_CART' })
  }

  return <CartContext value={cartContext}>{children}</CartContext>
}

export default CartContext
