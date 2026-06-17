import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export const fetchAdminStats    = createAsyncThunk('admin/stats',    async (_, { rejectWithValue }) => { try { const { data } = await api.get('/admin/stats'); return data } catch(e) { return rejectWithValue(e.response?.data?.message) } })
export const fetchAdminOrders   = createAsyncThunk('admin/orders',   async (_, { rejectWithValue }) => { try { const { data } = await api.get('/admin/orders'); return data } catch(e) { return rejectWithValue(e.response?.data?.message) } })
export const fetchAwaitingVerification = createAsyncThunk('admin/awaitingVerification', async (_, { rejectWithValue }) => { try { const { data } = await api.get('/admin/orders/awaiting-verification'); return data } catch(e) { return rejectWithValue(e.response?.data?.message) } })
export const fetchAdminUsers    = createAsyncThunk('admin/users',    async (_, { rejectWithValue }) => { try { const { data } = await api.get('/admin/users'); return data } catch(e) { return rejectWithValue(e.response?.data?.message) } })
export const fetchProductRequests = createAsyncThunk('admin/productRequests', async (_, { rejectWithValue }) => { try { const { data } = await api.get('/admin/product-requests'); return data } catch(e) { return rejectWithValue(e.response?.data?.message) } })
export const fetchAdminProducts = createAsyncThunk('admin/products', async (_, { rejectWithValue }) => { try { const { data } = await api.get('/admin/products'); return data } catch(e) { return rejectWithValue(e.response?.data?.message) } })

export const createProduct = createAsyncThunk('admin/createProduct', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/admin/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    toast.success('Product created'); return data
  } catch(e) {
    const msg = e.response?.data?.message || 'Failed to create product'
    toast.error(msg)
    return rejectWithValue(msg)
  }
})

export const updateProduct = createAsyncThunk('admin/updateProduct', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/admin/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    toast.success('Product updated'); return data
  } catch(e) {
    const msg = e.response?.data?.message || 'Failed to update product'
    toast.error(msg)
    return rejectWithValue(msg)
  }
})

export const deleteProduct = createAsyncThunk('admin/deleteProduct', async (id, { rejectWithValue }) => {
  try { await api.delete(`/admin/products/${id}`); toast.success('Product deleted'); return id }
  catch(e) { return rejectWithValue(e.response?.data?.message) }
})

export const updateOrderStatus = createAsyncThunk('admin/updateOrder', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/admin/orders/${id}`, { status })
    toast.success('Order updated'); return data
  } catch(e) { return rejectWithValue(e.response?.data?.message) }
})

export const verifyCryptoOrder = createAsyncThunk('admin/verifyCrypto', async ({ id, approve }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/admin/orders/${id}/verify-crypto`, { approve })
    toast.success(approve ? 'Order confirmed' : 'Order rejected')
    return data
  } catch(e) {
    const msg = e.response?.data?.message || 'Failed to verify order'
    toast.error(msg)
    return rejectWithValue(msg)
  }
})

export const updateProductRequest = createAsyncThunk('admin/updateProductRequest', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/admin/product-requests/${id}`, { status })
    toast.success('Request updated')
    return data
  } catch(e) { return rejectWithValue(e.response?.data?.message) }
})

export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {
  try { await api.delete(`/admin/users/${id}`); toast.success('User deleted'); return id }
  catch(e) { return rejectWithValue(e.response?.data?.message) }
})

const adminSlice = createSlice({
  name: 'admin',
  initialState: { stats: null, orders: [], awaitingVerification: [], users: [], products: [], productRequests: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    const p = (state) => { state.loading = true; state.error = null }
    const r = (state, a) => { state.loading = false; state.error = a.payload }
    builder
      .addCase(fetchAdminStats.pending, p).addCase(fetchAdminStats.fulfilled, (s,a) => { s.loading=false; s.stats=a.payload }).addCase(fetchAdminStats.rejected, r)
      .addCase(fetchAdminOrders.pending, p).addCase(fetchAdminOrders.fulfilled, (s,a) => { s.loading=false; s.orders=a.payload }).addCase(fetchAdminOrders.rejected, r)
      .addCase(fetchAwaitingVerification.pending, p).addCase(fetchAwaitingVerification.fulfilled, (s,a) => { s.loading=false; s.awaitingVerification=a.payload }).addCase(fetchAwaitingVerification.rejected, r)
      .addCase(fetchAdminUsers.pending, p).addCase(fetchAdminUsers.fulfilled, (s,a) => { s.loading=false; s.users=a.payload }).addCase(fetchAdminUsers.rejected, r)
      .addCase(fetchProductRequests.pending, p).addCase(fetchProductRequests.fulfilled, (s,a) => { s.loading=false; s.productRequests=a.payload }).addCase(fetchProductRequests.rejected, r)
      .addCase(updateProductRequest.fulfilled, (s,a) => { const i = s.productRequests.findIndex(req => req._id === a.payload._id); if(i >= 0) s.productRequests[i] = a.payload })
      .addCase(fetchAdminProducts.pending, p).addCase(fetchAdminProducts.fulfilled, (s,a) => { s.loading=false; s.products=a.payload }).addCase(fetchAdminProducts.rejected, r)
      .addCase(createProduct.fulfilled, (s,a) => { s.products.unshift(a.payload) })
      .addCase(updateProduct.fulfilled, (s,a) => { const i = s.products.findIndex(p => p._id === a.payload._id); if(i >= 0) s.products[i] = a.payload })
      .addCase(deleteProduct.fulfilled, (s,a) => { s.products = s.products.filter(p => p._id !== a.payload) })
      .addCase(updateOrderStatus.fulfilled, (s,a) => { const i = s.orders.findIndex(o => o._id === a.payload._id); if(i >= 0) s.orders[i] = a.payload })
      .addCase(verifyCryptoOrder.fulfilled, (s,a) => {
        s.awaitingVerification = s.awaitingVerification.filter(o => o._id !== a.payload._id)
        const i = s.orders.findIndex(o => o._id === a.payload._id)
        if (i >= 0) s.orders[i] = a.payload
      })
      .addCase(deleteUser.fulfilled, (s,a) => { s.users = s.users.filter(u => u._id !== a.payload) })
  }
})

export default adminSlice.reducer
