import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Message } from './messagesSlice'

interface RecentMessagesState {
  messages: Message[]
}

const initialState: RecentMessagesState = {
  messages: []
}

const recentMessagesSlice = createSlice({
  name: 'recentMessages',
  initialState,
  reducers: {
    setRecentMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload
    },
    addRecentMessage: (state, action: PayloadAction<Message>) => {
      state.messages.unshift(action.payload)
      state.messages = state.messages.slice(0, 10) // Keep only the 10 most recent messages
    }
  }
})

export const { setRecentMessages, addRecentMessage } = recentMessagesSlice.actions
export default recentMessagesSlice.reducer

