import { PrismaClient } from "@prisma/client";

// Une seule connexion à la base pour tout le site.
// (En développement, Next.js recharge le code souvent : on garde la connexion
// dans une variable globale pour ne pas en ouvrir des dizaines.)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
