import client from "./postgres.client";
import fs from "node:fs";

export async function dumpDatabaseStructure() {
    await client.connect();

    try {
        const tablesResult = await client.query(`
            SELECT table_name,
                   obj_description(format('%I.%I', table_schema, table_name)::regclass, 'pg_class') AS table_comment
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);
        const tables = tablesResult.rows;

        let dump = "-- Database Structure Dump\n";

        for (const table of tables) {
            const tableName = table.table_name;
            const tableComment = table.table_comment;

            // Lấy câu lệnh CREATE TABLE
            const createTableQuery = `
        SELECT 'CREATE TABLE ' || relname || E'\n(\n' || array_to_string(array_agg(
          '    ' || column_name || ' ' || data_type
        ), E',\n') || E'\n);\n' AS create_table_sql
        FROM (
          SELECT c.relname, a.attname AS column_name, format_type(a.atttypid, a.atttypmod) AS data_type
          FROM pg_class c
          JOIN pg_namespace n ON n.oid = c.relnamespace
          JOIN pg_attribute a ON a.attrelid = c.oid
          WHERE n.nspname = 'public' AND c.relname = $1 AND a.attnum > 0 AND NOT a.attisdropped
          ORDER BY a.attnum
        ) sub
        GROUP BY relname;
      `;
            const createTableResult = await client.query(createTableQuery, [
                tableName,
            ]);
            const createTableSQL =
                createTableResult.rows[0]?.create_table_sql || "";

            // Lấy thông tin comment của cột
            const columnsResult = await client.query(
                `
                    SELECT
                        a.attname AS column_name,
                        col_description(a.attrelid, a.attnum) AS column_comment
                    FROM pg_attribute a
                    WHERE a.attrelid = $1::regclass AND a.attnum > 0 AND NOT a.attisdropped
                    ORDER BY a.attnum;
                `,
                [`public.${tableName}`],
            );
            const columns = columnsResult.rows;

            // Lấy thông tin khóa ngoại
            const foreignKeysResult = await client.query(
                `
                    SELECT
                        conname AS fk_name,
                        a.attname AS column_name,
                        confrelid::regclass::text AS referenced_table,
                            af.attname AS referenced_column
                    FROM pg_constraint
                             JOIN pg_class ON conrelid = pg_class.oid
                             JOIN pg_attribute a ON a.attnum = ANY (conkey) AND a.attrelid = conrelid
                             JOIN pg_attribute af ON af.attnum = ANY (confkey) AND af.attrelid = confrelid
                    WHERE contype = 'f' AND pg_class.relname = $1;
                `,
                [tableName],
            );
            const foreignKeys = foreignKeysResult.rows;

            // Lấy thông tin index
            const indexesResult = await client.query(
                `
        SELECT 
          indexname, 
          indexdef
        FROM pg_indexes
        WHERE schemaname = 'public' AND tablename = $1;
      `,
                [tableName],
            );
            const indexes = indexesResult.rows;

            // Bắt đầu dump table
            dump += `\n-- Table: ${tableName}\n`;
            if (tableComment) dump += `-- Description: ${tableComment}\n`;
            dump += `${createTableSQL}\n`;

            // Thêm comment của cột
            for (const column of columns) {
                const columnName = column.column_name;
                const columnComment = column.column_comment;
                if (columnComment) {
                    dump += `-- Column: ${columnName}, Comment: ${columnComment}\n`;
                }
            }

            // Thêm khóa ngoại
            for (const fk of foreignKeys) {
                const fkName = fk.fk_name;
                const columnName = fk.column_name;
                const referencedTable = fk.referenced_table;
                const referencedColumn = fk.referenced_column;
                dump += `-- Foreign Key: ${fkName}, Column: ${columnName}, References: ${referencedTable}(${referencedColumn})\n`;
                dump += `ALTER TABLE ${tableName} ADD CONSTRAINT ${fkName} FOREIGN KEY (${columnName}) REFERENCES ${referencedTable} (${referencedColumn});\n`;
            }

            // Thêm index
            for (const index of indexes) {
                const indexName = index.indexname;
                const indexDef = index.indexdef;
                dump += `-- Index: ${indexName}\n${indexDef};\n`;
            }
        }

        // Ghi dump ra file
        fs.writeFileSync("./database_dump.sql", dump);
        console.log("Database structure dumped to database_dump.sql");
    } catch (error) {
        console.error("Error dumping database structure:", error);
    } finally {
        await client.end();
    }
}

dumpDatabaseStructure();
