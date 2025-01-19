import { AppDispatch } from "../store";
import { addMessage, updateMessage, Message } from "../reducers/messagesSlice";

export const sendMessage =
    (message: Message) => async (dispatch: AppDispatch) => {
        dispatch(addMessage(message));
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    conversationId: message.conversation_id,
                    messageId: message.id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Network response was not ok",
                );
            }

            let accumulatedContent = "";

            dispatch(addMessage(message));

            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    accumulatedContent += chunk;

                    dispatch(
                        updateMessage({
                            id: message.id,
                            changes: { content: accumulatedContent },
                        }),
                    );
                }
            }
        } catch (error) {
            console.error("Error:", error);
            let errorMessage =
                "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn.";
            if (error instanceof Error) {
                errorMessage += ` Chi tiết lỗi: ${error.message}`;
            }
            dispatch(
                addMessage({
                    ...message,
                    content: errorMessage!,
                }),
            );
        }
    };
