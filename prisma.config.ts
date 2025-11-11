import { defineConfig } from "prisma/config";
import { env } from "./src/env/index.js";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env.DATABASE_URL,
  },
});
