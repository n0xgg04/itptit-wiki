import { AppDispatch } from '../store'
import { addConversation, setCurrentConversation, Conversation } from '../reducers/conversationsSlice'

export const createNewConversation = (title: string) => (dispatch: AppDispatch) => {
  const newConversation: Conversation = {
    id: `conversation-${Date.now()}`,
    title,
  }
  dispatch(addConversation(newConversation))
  dispatch(setCurrentConversation(newConversation.id))
  return newConversation.id
}

