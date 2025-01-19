import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface InputFieldProps {
    input: string;
    setInput: (input: string) => void;
    handleSend: () => void;
    isLoading: boolean;
}

export function InputField({
    input,
    setInput,
    handleSend,
    isLoading,
}: InputFieldProps) {
    return (
        <div className="relative bg-white dark:bg-[#141414] border border-gray-200 dark:border-zinc-800 rounded-2xl">
            <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập câu hỏi..."
                className="w-full py-3 px-4 sm:px-6 resize-none bg-transparent ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-none text-sm sm:text-base min-h-[50px] placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isLoading}
            />
            <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center">
                <Button
                    onClick={handleSend}
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 bg-black text-white hover:bg-black/90 rounded-lg dark:bg-white dark:text-black dark:hover:bg-white/90"
                    disabled={isLoading}
                >
                    <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
            </div>
        </div>
    );
}
