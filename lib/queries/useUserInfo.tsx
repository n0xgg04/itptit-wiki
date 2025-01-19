import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function useUserInfo() {
    return useQuery({
        queryKey: ["user-info"],
        queryFn: async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                throw new Error(error.message);
            }
            return data.user;
        },
        staleTime: Infinity,
    });
}
