import { configureStore } from '@reduxjs/toolkit'
import authReducer    from './slices/authSlice'
import cartReducer    from './slices/cartSlice'
import productReducer from './slices/productSlice'
import orderReducer   from './slices/orderSlice'
import adminReducer   from './slices/adminSlice'
import productRequestReducer from './slices/productRequestSlice'

export const store = configureStore({
  reducer: {
    auth:    authReducer,
    cart:    cartReducer,
    product: productReducer,
    order:   orderReducer,
    admin:   adminReducer,
    productRequest: productRequestReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})
