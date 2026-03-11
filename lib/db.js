import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL?.replace(
  /sslmode=(prefer|require|verify-ca)\b/,
  "sslmode=verify-full",
);
const adapter = new PrismaPg({ connectionString });
const db =
  globalThis.prisma ||
  new PrismaClient({
    adapter,
    log: ["query", "error", "warn", "info"],
  });
if (process.env.NODE_ENV === "development") globalThis.prisma = db;

export default db;
