import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export const submitProductRequest = createAsyncThunk('productRequest/submit', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/product-requests', formData)
    toast.success("Request sent! We'll get back to you if we have it in store.")
    return data
  } catch (err) {
    const msg = err.response?.data?.message || 'Could not submit your request'
    toast.error(msg)
    return rejectWithValue(msg)
  }
})

const productRequestSlice = createSlice({
  name: 'productRequest',
  initialState: { loading: false, submitted: false, error: null },
  reducers: {
    resetProductRequest(state) {
      state.submitted = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitProductRequest.pending, (state) => { state.loading = true; state.error = null })
      .addCase(submitProductRequest.fulfilled, (state) => { state.loading = false; state.submitted = true })
      .addCase(submitProductRequest.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export const { resetProductRequest } = productRequestSlice.actions
export default productRequestSlice.reducer
