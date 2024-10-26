// src/admin/auth/service.ts

import prisma from '../../utils/prisma'
import hashUtils from '../../utils/hashUtils'
import tokenUtils from '../../utils/tokenUtils'
import { ErrorCodes, throwError } from '../../utils/errors'
import { createUser } from '../../utils/databaseUtils'
import { LoginParams, RegisterParams } from './types'

export const login = async ({ username, password }: LoginParams) => {
	const user = await prisma.admin.findUnique({ where: { username }, include: { role: true } })
	if (!user) {
		throw throwError('User not found', ErrorCodes.notFound, 400)
	}

	const verifyPassword = hashUtils.verify(password, user.password)
	if (!verifyPassword) {
		throw throwError('Bad login', ErrorCodes.badLogin, 400)
	}

	const accessToken = await tokenUtils.signToken({
		userId: user.id,
		username: user.username,
		role: user.role.name,
	})

	return { accessToken }
}

export const register = async ({ username, password, email }: RegisterParams) => {
	const user = await prisma.user.findFirst({
		where: { OR: [{ username }, { email }] },
	})

	if (user) {
		throw throwError('Exist', ErrorCodes.valueExists, 400)
	}

	await createUser({ email, username, nonHashedPassword: password })
	return { success: true }
}
