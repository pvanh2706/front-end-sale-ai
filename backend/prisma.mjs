import 'dotenv/config'

const globalForPrisma = globalThis

export let prisma = globalForPrisma.__prismaClient ?? null

if (!prisma) {
  try {
    const pkg = await import('@prisma/client')
    const PrismaClient = pkg.PrismaClient ?? pkg.default?.PrismaClient
    if (PrismaClient) {
      prisma = new PrismaClient({
        log: process.env.PRISMA_QUERY_LOG === 'true' ? ['query', 'warn', 'error'] : ['warn', 'error'],
      })
      globalForPrisma.__prismaClient = prisma
    }
  } catch {
    console.warn('[prisma] PrismaClient chưa sẵn sàng — dùng in-memory fallback.')
    prisma = null
  }
}
