import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Conversation {
  id: string
  title: string
}

interface ConversationsState {
  conversations: Conversation[]
  currentConversationId: string | null
}

const initialState: ConversationsState = {
  conversations: [],
  currentConversationId: null,
}

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.push(action.payload)
    },
    setCurrentConversation: (state, action: PayloadAction<string>) => {
      state.currentConversationId = action.payload
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload
    },
  },
})

export const { addConversation, setCurrentConversation, setConversations } = conversationsSlice.actions
export default conversationsSlice.reducer

