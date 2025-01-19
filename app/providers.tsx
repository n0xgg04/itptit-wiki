"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { getStore } from "@/redux/store";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
    const storeRef = useRef(getStore());
    const supabase = createClientComponentClient();
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={storeRef.current}>
                <SessionContextProvider supabaseClient={supabase}>
                    {children}
                </SessionContextProvider>
            </Provider>
        </QueryClientProvider>
    );
}
