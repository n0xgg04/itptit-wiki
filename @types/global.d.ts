import { Session as NextAuthSession } from "next-auth";

declare module "next-auth" {
    interface Session extends NextAuthSession {
        user: {
            id: string;
            email: string;
            name: string;
            role?: string;
            avatarUrl?: string;
        };
    }
}
