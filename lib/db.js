import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const normalizeConnectionString = (url) =>
  url.replace(
    /([?&])sslmode=(prefer|require|verify-ca)(?=(&|$))/i,
    "$1sslmode=verify-full",
  );

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const pool =
  globalThis.prismaPool ??
  new Pool({ connectionString: normalizeConnectionString(connectionString) });
const adapter = new PrismaPg(pool);

const createPrismaClient = () =>
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });

const db = globalThis.prisma ?? createPrismaClient();
if (process.env.NODE_ENV === "development") {
  globalThis.prisma = db;
  globalThis.prismaPool = pool;
}

export default db;
