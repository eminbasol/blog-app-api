import prisma from '../../src/utils/prisma'
import { adminUsers } from './adminUsers'
import { clientRoles } from './clientRoles'

export const initSeeder = async () => {
	console.info('Running init seeder')

	try {
		await adminUsers()
		await clientRoles()
		// NOTE: Call other seeders here
	} catch (e) {
		console.error(e)
		process.exit(1)
	} finally {
		await prisma.$disconnect()
	}
	console.info('Seeding finished')
}
