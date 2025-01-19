import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tables } from "@/supabase/database.types";

export type Message = Tables<"messages">;
interface MessagesState {
    [conversationId: string]: Message[];
}

const initialState: MessagesState = {};

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            const { conversation_id: conversationId } = action.payload;
            if (!state[conversationId]) {
                state[conversationId] = [];
            }
            state[conversationId] = [...state[conversationId], action.payload];
            console.log("Added message", state[conversationId]);
        },
        updateMessage: (
            state,
            action: PayloadAction<{ id: number; changes: Partial<Message> }>,
        ) => {
            const { id, changes } = action.payload;
            for (const conversationId in state) {
                const messageIndex = state[conversationId].findIndex(
                    (message) => message.id === id,
                );
                if (messageIndex !== -1) {
                    state[conversationId][messageIndex] = {
                        ...state[conversationId][messageIndex],
                        ...changes,
                    };
                    break;
                }
            }
        },
        setMessages: (
            state,
            action: PayloadAction<{
                conversationId: string;
                messages: Message[];
            }>,
        ) => {
            const { conversationId, messages } = action.payload;
            state[conversationId] = messages;
        },
    },
});

export const { addMessage, updateMessage, setMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
