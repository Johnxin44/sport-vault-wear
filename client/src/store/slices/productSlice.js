import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchProducts = createAsyncThunk('product/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString()
    const { data } = await api.get(`/products?${query}`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load products')
  }
})

export const fetchProductById = createAsyncThunk('product/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/products/${id}`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Product not found')
  }
})

export const fetchFeaturedProducts = createAsyncThunk('product/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/featured')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load products')
  }
})

export const submitReview = createAsyncThunk('product/review', async ({ productId, review }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/products/${productId}/reviews`, review)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Review failed')
  }
})

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products:  [],
    featured:  [],
    current:   null,
    total:     0,
    pages:     1,
    loading:   false,
    error:     null,
  },
  reducers: {
    clearCurrent(state) { state.current = null }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,  (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading  = false
        state.products = action.payload.products
        state.total    = action.payload.total
        state.pages    = action.payload.pages
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchProductById.pending,  (state) => { state.loading = true; state.error = null })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.loading = false; state.current = action.payload })
      .addCase(fetchProductById.rejected,  (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchFeaturedProducts.pending,  (state) => { state.loading = true })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => { state.loading = false; state.featured = action.payload })
      .addCase(fetchFeaturedProducts.rejected,  (state) => { state.loading = false })

      .addCase(submitReview.fulfilled, (state, action) => {
        if (state.current?._id === action.payload._id) state.current = action.payload
      })
  }
})

export const { clearCurrent } = productSlice.actions
export default productSlice.reducer
