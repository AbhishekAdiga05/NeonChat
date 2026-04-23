import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL?.replace(
  /sslmode=(prefer|require|verify-ca)\b/,
  "sslmode=verify-full",
);
const adapter = new PrismaPg({ connectionString });

const createPrismaClient = () =>
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });

const db = globalThis.prisma ?? createPrismaClient();
if (process.env.NODE_ENV === "development") globalThis.prisma = db;

export default db;
