"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Book,
    ChevronsUpDownIcon as ChevronUpDown,
    CreditCard,
    HelpCircle,
    Laptop,
    LogOut,
    Mail,
    Menu,
    Moon,
    Sun,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConversations } from "@/lib/queries/useConversations";
import { useCreateConversation } from "@/lib/mutations/useCreateConversation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/auth-js";
import useUserInfo from "@/lib/queries/useUserInfo";

export const Sidebar = React.memo(() => {
    const router = useRouter();
    const { data: user } = useUserInfo();

    const { setTheme, theme } = useTheme();
    const [isMobile, setIsMobile] = useState(false);
    const { data: conversations, isLoading } = useConversations();
    const createConversation = useCreateConversation();

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);

        return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    const handleConversationClick = (conversationId: string) => {
        router.push(`/${conversationId}`);
    };

    const addNewConversation = () => {
        createConversation.mutate(
            `Cuộc hội thoại ${conversations?.length ?? 0 + 1}`,
            {
                onSuccess: (newConversation) => {
                    router.push(`/${newConversation.id}`);
                },
                onError: (error) => {
                    console.error(error);
                },
            },
        );
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const sidebarContent = (
        <div className="flex flex-col h-full bg-background border-r border-border">
            {/* Header */}
            <div className="flex justify-between items-center p-4 h-14 shrink-0">
                <div className="font-bold text-xl">ITPTIT-Wiki</div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Mail className="h-4 w-4" />
                </Button>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 flex flex-col px-3 py-2 space-y-4 overflow-y-auto">
                    {/* New Chat Button */}
                    <Button
                        variant="outline"
                        className="w-full bg-background hover:bg-accent dark:bg-[#141414] dark:border-zinc-800 dark:hover:bg-[#1a1a1a]"
                        onClick={addNewConversation}
                        disabled={createConversation.isPending}
                    >
                        {createConversation.isPending
                            ? "Đang tạo..."
                            : "Cuộc hội thoại mới"}
                    </Button>

                    {/* Navigation Menu */}
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                        >
                            <Book className="mr-2 h-4 w-4" />
                            Thư viện
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                        >
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Phản hồi
                        </Button>
                    </div>

                    <div className="h-px bg-border mx-1" />

                    {/* Recent Chats Section */}
                    <div className="flex-1 min-h-0">
                        <div className="px-2 mb-2 text-sm font-medium text-muted-foreground">
                            Cuộc hội thoại gần đây
                        </div>
                        <ScrollArea className="h-full">
                            {isLoading ? (
                                <div className="text-center py-4">
                                    Đang tải...
                                </div>
                            ) : (
                                conversations?.map((conv) => (
                                    <Button
                                        key={conv.id}
                                        variant="ghost"
                                        className="w-full justify-start mb-1 dark:hover:bg-[#141414]"
                                        onClick={() =>
                                            handleConversationClick(conv.id)
                                        }
                                    >
                                        {conv.id}
                                    </Button>
                                ))
                            )}
                        </ScrollArea>
                    </div>
                </div>
            </div>

            {/* User Profile Section */}
            <div className="p-4 border-t">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full justify-between px-2 hover:bg-accent"
                        >
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src={
                                            user?.user_metadata?.[
                                                "profile_pic"
                                            ] ??
                                            "https://www.gravatar.com/avatar/"
                                        }
                                    />
                                    <AvatarFallback>
                                        {user?.email?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start">
                                    <span className="text-sm font-medium">
                                        {user?.email || "User"}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Premium
                                    </span>
                                </div>
                            </div>
                            <ChevronUpDown className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-56"
                        align="end"
                        alignOffset={-10}
                        forceMount
                    >
                        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Created by @n0xgg04</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                {theme === "light" && (
                                    <Sun className="mr-2 h-4 w-4" />
                                )}
                                {theme === "dark" && (
                                    <Moon className="mr-2 h-4 w-4" />
                                )}
                                {theme === "system" && (
                                    <Laptop className="mr-2 h-4 w-4" />
                                )}
                                Giao diện
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup
                                    value={theme}
                                    onValueChange={setTheme}
                                >
                                    <DropdownMenuRadioItem value="light">
                                        <Sun className="mr-2 h-4 w-4" />
                                        Sáng
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="dark">
                                        <Moon className="mr-2 h-4 w-4" />
                                        Tối
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="system">
                                        <Laptop className="mr-2 h-4 w-4" />
                                        Hệ thống
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Đăng xuất</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="fixed top-4 left-4 z-50 md:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0">
                    {sidebarContent}
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <div className="hidden md:block w-[280px] h-full">{sidebarContent}</div>
    );
});
