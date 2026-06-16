import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'
import toast from 'react-hot-toast'

// ── Thunks ──────────────────────────────────────

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData)
    localStorage.setItem('ejToken', data.token)
    localStorage.setItem('ejUser',  JSON.stringify(data.user))
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('ejToken', data.token)
    localStorage.setItem('ejUser',  JSON.stringify(data.user))
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/profile', profileData)
    localStorage.setItem('ejUser', JSON.stringify(data.user))
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed')
  }
})

export const loadUserFromStorage = createAsyncThunk('auth/loadFromStorage', async () => {
  const token = localStorage.getItem('ejToken')
  const user  = localStorage.getItem('ejUser')
  if (token && user) return { token, user: JSON.parse(user) }
  return null
})

// ── Slice ────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    null,
    token:   null,
    loading: false,
    error:   null,
  },
  reducers: {
    logout(state) {
      state.user  = null
      state.token = null
      localStorage.removeItem('ejToken')
      localStorage.removeItem('ejUser')
      toast.success('Logged out')
    },
    clearError(state) { state.error = null }
  },
  extraReducers: (builder) => {
    const pending  = (state)        => { state.loading = true;  state.error = null }
    const rejected = (state, action) => { state.loading = false; state.error = action.payload }

    builder
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload.user
        state.token   = action.payload.token
        toast.success('Account created!')
      })
      .addCase(registerUser.rejected, rejected)

      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload.user
        state.token   = action.payload.token
        toast.success(`Welcome back, ${action.payload.user.name.split(' ')[0]}!`)
      })
      .addCase(loginUser.rejected, rejected)

      .addCase(updateProfile.pending, pending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload.user
        toast.success('Profile updated')
      })
      .addCase(updateProfile.rejected, rejected)

      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.user  = action.payload.user
          state.token = action.payload.token
        }
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
