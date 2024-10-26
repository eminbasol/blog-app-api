import hashUtils from '../../src/utils/hashUtils'
import prisma from '../../src/utils/prisma'

export const adminUsers = async () => {
	try {
		const adminEmail = process.env.API_ADMIN_EMAIL ?? 'eminbasol@icloud.com'
		const adminPassword = hashUtils.hash(process.env.API_ADMIN_PASSWORD ?? 'mxqrm123')

		await prisma.admin.upsert({
			where: { email: adminEmail },
			update: {
				username: 'admin',
				password: adminPassword,
			},
			create: {
				username: 'admin',
				email: adminEmail,
				password: adminPassword,
				role: {
					connectOrCreate: {
						where: { name: 'globalAdmin' },
						create: {
							name: 'globalAdmin',
							permissions: {
								connectOrCreate: {
									where: { roleId_permissionId: { roleId: 1, permissionId: 1 } },
									create: {
										permission: {
											connectOrCreate: {
												where: { name: 'fullAccess' },
												create: { name: 'fullAccess' },
											},
										},
									},
								},
							},
						},
					},
				},
			},
		})
		// TODO: Add webhook user
		console.info('Successfully seeded admin users')
	} catch (error) {
		console.error('Error performing data seeding:', error)
	}
}
