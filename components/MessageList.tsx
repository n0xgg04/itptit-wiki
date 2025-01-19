import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/redux/reducers/messagesSlice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileCard } from "./ProfileCard";
import { ProfileSkeleton, TableSkeleton } from "./SkeletonLoaders";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AnimatePresence, motion } from "framer-motion";
import smoothScrollIntoView from "smooth-scroll-into-view-if-needed";
import { Tables } from "@/supabase/database.types";

interface MessageListProps {
    messages: Message[];
    streamingMessageId: number | null;
    isLoadingSpecialCommand: boolean;
    currentPage: number;
    itemsPerPage: number;
    setCurrentPage: (page: number) => void;
}

export const MessageList = React.memo(
    ({
        messages,
        streamingMessageId,
        isLoadingSpecialCommand,
        currentPage,
        itemsPerPage,
        setCurrentPage,
    }: MessageListProps) => {
        const scrollAreaRef = useRef<HTMLDivElement>(null);
        const lastMessageRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (lastMessageRef.current) {
                smoothScrollIntoView(lastMessageRef.current, {
                    scrollMode: "if-needed",
                    block: "end",
                    inline: "nearest",
                    behavior: "smooth",
                });
            }
        }, [messages]);

        const processStreamedContent = (content: string) => {
            if (!content.startsWith("[ai]")) return null;

            // @ts-ignore
            const aiTagMatch = content.match(/\[ai\](.*?)(?:\[\/ai\]|$)/s);
            if (!aiTagMatch) return null;

            const aiText = aiTagMatch[1].trim();

            // @ts-ignore
            const jsonMatch = content.match(/\[json\](.*?)\[\/json\]/s);
            let jsonData = null;
            if (jsonMatch) {
                try {
                    jsonData = JSON.parse(jsonMatch[1]) as Tables<"members">;
                } catch (e) {
                    console.error("Error parsing JSON:", e);
                }
            }

            // @ts-ignore
            const imageMatch = content.match(/\[image\](.*?)\[\/image\]/s);
            const imageUrl = imageMatch ? imageMatch[1].trim() : null;

            return { aiText, jsonData, imageUrl };
        };

        const renderTable = (data: Tables<"members">[]) => {
            // Kiểm tra nếu data không tồn tại hoặc là mảng rỗng
            if (!data || data.length === 0) {
                return <div>Không có dữ liệu để hiển thị.</div>;
            }

            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
            const totalPages = Math.ceil(data.length / itemsPerPage);

            return (
                <div>
                    <div className="overflow-x-auto max-w-[50%]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {Object.keys(data[0]).map((key) => (
                                        <TableHead key={key}>{key}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentItems.map((row, index) => (
                                    <TableRow key={index}>
                                        {Object.values(row).map(
                                            (value: any, cellIndex) => (
                                                <TableCell key={cellIndex}>
                                                    {typeof value === "string"
                                                        ? value
                                                        : JSON.stringify(value)}
                                                </TableCell>
                                            ),
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter className="w-full">
                                <div className="flex items-center justify-between space-x-2 py-4 w-full">
                                    <button
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.max(currentPage - 1, 1),
                                            )
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    <span>
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.min(
                                                    currentPage + 1,
                                                    totalPages,
                                                ),
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            </TableFooter>
                        </Table>
                    </div>
                </div>
            );
        };

        const renderSpecialCommand = (
            message: Message,
            isStreaming: boolean,
        ) => {
            const processed = processStreamedContent(message.content!);

            if (!processed) return null;

            const { aiText, jsonData, imageUrl } = processed;

            return (
                <div key={message.id}>
                    <div className="mb-3 sm:mb-4 flex items-start gap-1 sm:gap-2">
                        <Avatar className="h-8 w-8 mt-0.5">
                            <AvatarImage
                                src="https://github.com/shadcn.png"
                                alt="@shadcn"
                            />
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            {aiText.trim().length > 0 && (
                                <div className="inline-block px-3 sm:px-4 py-2 text-xs sm:text-sm bg-secondary text-secondary-foreground rounded-r-2xl rounded-tl-2xl rounded-bl-md">
                                    {aiText}
                                </div>
                            )}

                            {imageUrl && (
                                <div className="mt-2 max-w-sm">
                                    <div className="rounded-lg overflow-hidden">
                                        <img
                                            src={imageUrl || "/placeholder.svg"}
                                            alt="Member"
                                            className="w-full h-auto"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="mt-2">
                                {!jsonData && isLoadingSpecialCommand ? (
                                    aiText
                                        .toLowerCase()
                                        .includes("danh sách") ? (
                                        <TableSkeleton />
                                    ) : (
                                        <ProfileSkeleton />
                                    )
                                ) : jsonData ? (
                                    Array.isArray(jsonData) &&
                                    jsonData.length > 1 ? (
                                        renderTable(jsonData)
                                    ) : (
                                        <ProfileCard
                                            data={
                                                (
                                                    jsonData as unknown as Array<
                                                        Tables<"members">
                                                    >
                                                )[0]
                                            }
                                        />
                                    )
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <ScrollArea className="flex-grow p-2 sm:p-4" ref={scrollAreaRef}>
                <div className="max-w-2xl mx-auto">
                    <AnimatePresence initial={false}>
                        {messages.map((message, index) => {
                            const isLongMessage =
                                message.content?.length || 0 > 100;
                            const isStreaming =
                                message.id === streamingMessageId;
                            const isError =
                                ["system", "model"].includes(message.role!) &&
                                message.content?.startsWith(
                                    "Xin lỗi, đã xảy ra lỗi",
                                );
                            const isLastMessage = index === messages.length - 1;

                            return (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    ref={isLastMessage ? lastMessageRef : null}
                                >
                                    {isError ? (
                                        <Alert
                                            variant="destructive"
                                            className="mb-4"
                                        >
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>Lỗi</AlertTitle>
                                            <AlertDescription>
                                                {message.content}
                                            </AlertDescription>
                                        </Alert>
                                    ) : ["model", "system"].includes(
                                          message.role || "",
                                      ) &&
                                      message.content?.startsWith("[ai]") ? (
                                        renderSpecialCommand(
                                            message,
                                            isStreaming,
                                        )
                                    ) : (
                                        <div
                                            className={`mb-3 sm:mb-4 flex items-end gap-1 sm:gap-2 ${
                                                message.role === "user"
                                                    ? "flex-row-reverse"
                                                    : "flex-row"
                                            }`}
                                        >
                                            {message.role === "user" && (
                                                <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                                                    <AvatarImage
                                                        src={`https://avatar.vercel.sh/user.png`}
                                                    />
                                                    <AvatarFallback>
                                                        U
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div
                                                className={`inline-block px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                                                    message.role === "user"
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-secondary text-secondary-foreground"
                                                } ${
                                                    isLongMessage
                                                        ? "rounded-2xl"
                                                        : message.role ===
                                                            "user"
                                                          ? "rounded-l-2xl rounded-tr-2xl rounded-br-md"
                                                          : "rounded-r-2xl rounded-tl-2xl rounded-bl-md"
                                                }`}
                                            >
                                                {isStreaming ? (
                                                    message.content
                                                        ?.split("")
                                                        .map((char, i) => (
                                                            <motion.span
                                                                key={i}
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                transition={{
                                                                    duration: 0.05,
                                                                    delay:
                                                                        i *
                                                                        0.05,
                                                                }}
                                                            >
                                                                {char}
                                                            </motion.span>
                                                        ))
                                                ) : (
                                                    <span>
                                                        {message.content}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </ScrollArea>
        );
    },
);
