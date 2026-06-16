import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'
import toast from 'react-hot-toast'

// Step 1: Create a pending order + get a Flutterwave hosted payment link
export const initiatePayment = createAsyncThunk('order/initiatePayment', async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/payments/initiate', orderData)
    return data // { orderId, paymentLink }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Could not start payment')
  }
})

// Step 2: After redirect back from Flutterwave, verify the transaction
export const verifyPayment = createAsyncThunk('order/verifyPayment', async ({ transaction_id, tx_ref }, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/payments/verify', { params: { transaction_id, tx_ref } })
    return data // { status: 'success'|'failed', order }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Payment verification failed')
  }
})

export const fetchMyOrders = createAsyncThunk('order/myOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders/my')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load orders')
  }
})

export const fetchOrderById = createAsyncThunk('order/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/orders/${id}`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Order not found')
  }
})

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    current: null,
    paymentLink: null,
    verifyStatus: null, // 'success' | 'failed' | null
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderState(state) {
      state.current = null
      state.paymentLink = null
      state.verifyStatus = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Initiate payment
      .addCase(initiatePayment.pending, (state) => { state.loading = true; state.error = null })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false
        state.paymentLink = action.payload.paymentLink
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false; state.error = action.payload
        toast.error(action.payload)
      })

      // Verify payment
      .addCase(verifyPayment.pending, (state) => { state.loading = true; state.error = null })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false
        state.verifyStatus = action.payload.status
        state.current = action.payload.order
        if (action.payload.status === 'success') {
          toast.success('Payment successful! Order confirmed.')
        } else {
          toast.error('Payment was not completed.')
        }
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false
        state.verifyStatus = 'failed'
        state.error = action.payload
        toast.error(action.payload)
      })

      // My orders
      .addCase(fetchMyOrders.pending,   (state) => { state.loading = true })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload })
      .addCase(fetchMyOrders.rejected,  (state) => { state.loading = false })

      .addCase(fetchOrderById.fulfilled, (state, action) => { state.current = action.payload })
  }
})

export const { clearOrderState } = orderSlice.actions
export default orderSlice.reducer
