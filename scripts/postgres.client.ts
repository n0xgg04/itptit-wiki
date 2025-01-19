import { Client } from "pg";

if (!process.env.PG_HOST) {
    throw new Error("PG_HOST is not defined");
}

const client = new Client({
    host: process.env.PG_HOST!,
    port: parseInt(process.env.PG_PORT || "5432"),
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASSWORD || "postgres",
    database: process.env.PG_DATABASE || "postgres",
});

export default client;
