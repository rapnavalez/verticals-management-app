import { config } from "dotenv";
// Load .env first (lower priority), then .env.local overrides it
config({ path: ".env" });
config({ path: ".env.local", override: true });

import { defineConfig } from "prisma/config";

// DIRECT_URL is the non-pooled Supabase connection — required for migrations.
// DATABASE_URL is the pooled Supavisor URL — used by the runtime PrismaClient adapter.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"] ?? "",
  },
});
