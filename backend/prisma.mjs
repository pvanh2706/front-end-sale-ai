import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.__prismaClient ??
  new PrismaClient({
    log: process.env.PRISMA_QUERY_LOG === 'true' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  })

if (!globalForPrisma.__prismaClient) {
  globalForPrisma.__prismaClient = prisma
}
