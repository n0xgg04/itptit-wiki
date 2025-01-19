import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useConversations() {
    return useQuery({
        queryKey: ["conversations"],
        queryFn: async () => {
            const user = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from("conversations")
                .select("*")
                .eq("created_by_uuid", user?.data.user?.id!)
                .order("created_at", { ascending: false });

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },
    });
}
