import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: boolean
  user: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true
      state.user = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user: action.payload }))
      }
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth')
      }
    },
    checkAuth: (state) => {
      if (typeof window !== 'undefined') {
        const auth = localStorage.getItem('auth')
        if (auth) {
          const { isAuthenticated, user } = JSON.parse(auth)
          state.isAuthenticated = isAuthenticated
          state.user = user
        }
      }
    },
  },
})

export const { login, logout, checkAuth } = authSlice.actions
export default authSlice.reducer

