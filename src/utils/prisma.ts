import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

prisma.$use(async (params, next) => {
	// const before = Date.now()
	if (params.action === 'update') params.args.data.updatedAt = new Date()
	//TODO updateAll action
	const result = await next(params)
	// const after = Date.now()
	// databaseLogger.info(`Query ${params.model}.${params.action} took ${after - before}ms`)
	return result
})
export default prisma
