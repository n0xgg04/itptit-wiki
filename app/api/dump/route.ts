import { NextApiRequest, NextApiResponse } from "next";
import { dumpDatabaseStructure } from "@/scripts/generate_sql";
import client from "@/scripts/postgres.client";
import { NextResponse } from "next/server";

export default async function GET() {
    try {
        await dumpDatabaseStructure();
        return NextResponse.json({ message: "Dumping database structure" });
    } catch (e) {
        return NextResponse.json({
            message: "Error dumping database structure" + (e as Error).message,
        });
    } finally {
        await client.end();
    }
}
