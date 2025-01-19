"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { supabase } from "@/lib/supabase";

export default function ConversationPage({
    params,
}: {
    params: { conversationId: string };
}) {
    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <main className="flex-1 overflow-hidden">
                <ChatArea conversationId={params.conversationId} />
            </main>
        </div>
    );
}
