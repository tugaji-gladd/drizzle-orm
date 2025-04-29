import { defineConfig } from "drizzle-kit";
import 'dotenv/config';

export default defineConfig({
  schema: "./src/db/schema.ts", // スキーマファイルのパス
  out: "./drizzle", // Migrationファイルの出力先ディレクトリ
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // データベース接続URL
  },
});