import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addMessage, Message } from "@/redux/reducers/messagesSlice";
import { sendMessage } from "@/redux/actions/messageActions";
import { useAppDispatch } from "@/redux/store";

export function useSendMessage(conversationId: string) {
    const dispatch = useAppDispatch();
    return useMutation({
        mutationFn: async (
            message: Omit<Message, "id" | "created_at" | "created_by_uuid">,
        ) => {
            const user = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from("messages")
                .insert([
                    {
                        conversation_id: conversationId,
                        content: message.content,
                        role: "user",
                        created_by_uuid: user?.data.user?.id!,
                    },
                    {
                        conversation_id: conversationId,
                        content: "",
                        role: "model",
                        created_by_uuid: user?.data.user?.id!,
                    },
                ])
                .select();

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },
        onSuccess: async (data) => {
            dispatch(addMessage(data[0]));
            await sendMessage(data[1])(dispatch);
        },
    });
}
