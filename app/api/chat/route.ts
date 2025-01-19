import { NextResponse } from "next/server";
import openai from "@/lib/open.ai";
import { createClient } from "@/supabase/server";
import fs from "fs";
import promptGenerate, { convertBigIntToString } from "@/scripts/prompt_gen";
import { remember } from "@/lib/redis";
import { Tables } from "@/supabase/database.types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const conversationId = body?.conversationId;

        if (!body || !conversationId) {
            return NextResponse.json(
                { error: "Missing conversationId" },
                { status: 400 },
            );
        }

        const supabase = await createClient();
        const { data: messages, error } = await supabase
            .from("messages")
            .select("*")
            .neq("content", "")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true });

        messages?.forEach((msg) => {
            msg.role = msg.role === "model" ? ("assistant" as any) : msg.role;
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const lastMessage = messages[messages.length - 1];

        if (!openai.apiKey) {
            return NextResponse.json(
                { error: "OpenAI API key is not configured" },
                { status: 500 },
            );
        }

        // Ensure all messages have the required 'role' property
        const formattedMessages = messages.map((msg) => ({
            content: msg.content,
            role: msg.role == "model" ? "assistant" : msg.role,
        }));

        const rootDir = process.cwd();

        formattedMessages.unshift({
            role: "system",
            content: await remember("prompt:all", () =>
                promptGenerate(supabase),
            ),
        } as any);

        const stream = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: formattedMessages as any,
            stream: true,
            max_tokens: 2000,
        });

        const encoder = new TextEncoder();
        let fullContent = "";
        let isCollectingSQL = false;
        let sqlContent = "";
        let buffer = "";

        const readableStream = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || "";
                    if (content) {
                        fullContent += content;
                        buffer += content;

                        if (!isCollectingSQL && buffer.includes("[sql]")) {
                            isCollectingSQL = true;
                            sqlContent = "";
                            buffer = buffer.split("[sql]")[1] || "";
                        }

                        if (isCollectingSQL) {
                            sqlContent += content;

                            // Kiểm tra xem có chuỗi [/sql] trong buffer không
                            if (buffer.includes("[/sql]")) {
                                isCollectingSQL = false;

                                // Trích xuất câu lệnh SQL
                                const sqlQuery = sqlContent
                                    .split("[/sql]")[0]
                                    .trim()
                                    .replace(/[\[\]]/g, "");

                                try {
                                    if (!sqlQuery) {
                                        throw new Error("SQL query is empty");
                                    }

                                    const result =
                                        await prisma.$queryRawUnsafe(sqlQuery);

                                    const sqlResult = JSON.stringify(
                                        convertBigIntToString(result),
                                    );
                                    console.log("SQL sqlQuery:", sqlQuery);
                                    controller.enqueue(
                                        encoder.encode(
                                            `[json]${sqlResult}[/json]`,
                                        ),
                                    );
                                } catch (error) {
                                    console.error(
                                        "Error executing SQL:",
                                        error,
                                    );
                                    controller.enqueue(
                                        encoder.encode(
                                            `[sql-error]Error executing SQL: ${(error as Error).message}[/sql-error]`,
                                        ),
                                    );
                                }

                                // Xóa buffer sau khi xử lý xong
                                buffer = buffer.split("[/sql]")[1] || "";
                            }
                        } else {
                            controller.enqueue(encoder.encode(`${content}`));
                        }
                    }
                }
                controller.close();

                const user = await supabase.auth.getUser();
                const { data: lastMessage } = await supabase
                    .from("messages")
                    .select("id")
                    .eq("conversation_id", conversationId)
                    .eq("role", "model")
                    .limit(1)
                    .order("created_at", { ascending: false })
                    .single();

                if (lastMessage && lastMessage.id) {
                    await supabase
                        .from("messages")
                        .update({
                            conversation_id: conversationId,
                            content: fullContent,
                            role: "model",
                            created_by_uuid: user.data.user?.id!,
                        })
                        .eq("id", lastMessage.id);
                }
            },
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("API error:", error);
        let errorMessage = "An unexpected error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
