import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem('ejCart')) || [] }
  catch { return [] }
}

const saveCart = (items) => localStorage.setItem('ejCart', JSON.stringify(items))

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCart() },
  reducers: {
    addToCart(state, action) {
      const { product, size, quantity = 1 } = action.payload
      const key      = `${product._id}-${size}`
      const existing = state.items.find(i => i.key === key)

      if (existing) {
        existing.quantity += quantity
        toast.success('Quantity updated')
      } else {
        state.items.push({
          key,
          productId:  product._id,
          name:       product.name,
          image:      product.images?.[0] || '',
          price:      product.price,
          size,
          quantity,
        })
        toast.success(`${product.name} added to cart`)
      }
      saveCart(state.items)
    },

    updateQuantity(state, action) {
      const { key, quantity } = action.payload
      const item = state.items.find(i => i.key === key)
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.key !== key)
          toast.success('Item removed')
        } else {
          item.quantity = quantity
        }
      }
      saveCart(state.items)
    },

    removeFromCart(state, action) {
      state.items = state.items.filter(i => i.key !== action.payload)
      saveCart(state.items)
      toast.success('Item removed')
    },

    clearCart(state) {
      state.items = []
      localStorage.removeItem('ejCart')
    }
  }
})

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions

export const selectCartItems    = (state) => state.cart.items
export const selectCartTotal    = (state) => state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
export const selectCartCount    = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0)

export default cartSlice.reducer
