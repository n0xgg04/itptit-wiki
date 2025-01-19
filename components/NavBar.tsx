"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Share } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUserInfo from "@/lib/queries/useUserInfo";

export function NavBar() {
    const { data: user } = useUserInfo();

    return (
        <div className="flex items-center justify-between px-4 h-14 border-b">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="text-base font-medium gap-2"
                    >
                        Wiki Assistant
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="opacity-40"
                        >
                            <path
                                d="M11.3346 6.33337L8.00131 9.66671L4.66797 6.33337"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px]">
                    <DropdownMenuItem>Phiên bản mới</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                    <Share className="h-4 w-4" />
                    Chia sẻ
                </Button>
                <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/${user}.png`} />
                    <AvatarFallback>
                        {user?.user_metadata?.["profile_pic"]}
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
}
