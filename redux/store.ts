import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from "./reducers/messagesSlice";
import conversationsReducer from "./reducers/conversationsSlice";
import authReducer from "./reducers/authSlice";
import recentMessagesReducer from "./reducers/recentMessagesSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

// Define store type
type StoreType = ReturnType<typeof makeStore>;

// Create store instance holder
let storeInstance: StoreType | undefined;

function makeStore() {
    return configureStore({
        reducer: {
            messages: messagesReducer,
            conversations: conversationsReducer,
            auth: authReducer,
            recentMessages: recentMessagesReducer,
        },
    });
}

export function getStore() {
    if (typeof window === "undefined") return makeStore();

    if (!storeInstance) {
        storeInstance = makeStore();
    }

    return storeInstance;
}

export const store = getStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
