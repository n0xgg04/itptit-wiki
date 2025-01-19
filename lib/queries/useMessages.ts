import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useMessages(conversationId: string) {
    return useQuery({
        queryKey: ["messages", conversationId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("conversation_id", conversationId)
                .order("created_at", { ascending: true });

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },
        enabled: !!conversationId,
        staleTime: Infinity,
    });
}
