import prisma from '../../src/utils/prisma'

export const clientRoles = async () => {
	try {
		const roles = ['ADMIN', 'CO_ADMIN', 'MEMBER']

		for (const roleName of roles) {
			await prisma.role.upsert({
				where: { name: roleName },
				update: {},
				create: { name: roleName },
			})
		}

		console.info('Successfully seeded roles')
	} catch (error) {
		console.error('Error seeding roles:', error)
	}
}
