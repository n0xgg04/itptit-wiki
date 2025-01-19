"use client";

import React, { useState, useEffect } from "react";
import { NavBar } from "./NavBar";
import { InputField } from "./InputField";
import { EmptyState } from "./EmptyState";
import { MessageList } from "./MessageList";
import { useMessages } from "@/lib/queries/useMessages";
import { useSendMessage } from "@/lib/mutations/useSendMessage";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setMessages } from "@/redux/reducers/messagesSlice";

interface ChatAreaProps {
    conversationId: string;
}

export function ChatArea({ conversationId }: ChatAreaProps) {
    const dispatch = useAppDispatch();
    const [input, setInput] = useState("");
    const [streamingMessageId, setStreamingMessageId] = useState<number | null>(
        null,
    );
    const messages = useAppSelector((state) => state.messages[conversationId]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [isLoadingSpecialCommand, setIsLoadingSpecialCommand] =
        useState(false);

    const {
        data: messageList,
        isSuccess,
        isLoading: isLoadingMessages,
    } = useMessages(conversationId);
    const sendMessageMutation = useSendMessage(conversationId);

    console.log("messages", messages);

    useEffect(() => {
        if (messageList && messageList?.length > 0 && isSuccess) {
            dispatch(
                setMessages({
                    conversationId,
                    messages: messageList || [],
                }),
            );
        }
    }, [isSuccess, dispatch, conversationId]);

    useEffect(() => {
        if (isLoadingSpecialCommand && messages && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (
                ["system", "model"].includes(lastMessage?.role || "") &&
                (lastMessage?.content || "").startsWith("[ai]")
            ) {
                setIsLoadingSpecialCommand(false);
            }
        }
    }, [isLoadingSpecialCommand, messages]);

    const handleSend = async () => {
        if (input.trim()) {
            const data = await sendMessageMutation.mutateAsync({
                content: input.trim(),
                role: "user",
                conversation_id: conversationId,
            });
            setInput("");

            setStreamingMessageId(() => data[1].id!);

            if (
                input.trim().toLowerCase() === "profile" ||
                input.trim().toLowerCase() === "list"
            ) {
                setIsLoadingSpecialCommand(true);
            }
        }
    };

    const handleSelectQuestion = (question: string) => {
        setInput(question);
        handleSend();
    };

    return (
        <div className="flex flex-col h-full pt-0">
            <NavBar />
            {isLoadingMessages ? (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-sm">Loading messages...</p>
                </div>
            ) : (messages && messages.length === 0) || !messages ? (
                <EmptyState
                    input={input}
                    setInput={setInput}
                    handleSend={handleSend}
                    isLoading={sendMessageMutation.isPending}
                    handleSelectQuestion={handleSelectQuestion}
                />
            ) : (
                <>
                    <MessageList
                        messages={messages || []}
                        streamingMessageId={streamingMessageId}
                        isLoadingSpecialCommand={isLoadingSpecialCommand}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        setCurrentPage={setCurrentPage}
                    />
                    <div className="p-2 sm:p-4">
                        <div className="max-w-lg sm:max-w-2xl mx-auto">
                            <InputField
                                input={input}
                                setInput={setInput}
                                handleSend={handleSend}
                                isLoading={sendMessageMutation.isPending}
                            />
                            <div className="text-center text-xs text-gray-500 mt-2">
                                Sản phẩm từ WIT Team
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
