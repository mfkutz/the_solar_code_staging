import { PrismaClient } from '@prisma/client';

// One shared Prisma client for the whole app (don't create one per request).
export const prisma = new PrismaClient();
