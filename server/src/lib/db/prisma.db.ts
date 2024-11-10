import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    // log: ['query', 'info', 'warn'],
}).$extends ({
    model: {
        
    },
    query: {

    },
    client: {

    },
    result: {

    }
})

const connectPostgresDB = async () => {
    try {
        await prisma.$connect()
        console.log('Postgres Database Connected')
    } catch (err) {
        console.error(err)
    } finally {
        await prisma.$disconnect()
    }
}
export { prisma, connectPostgresDB }