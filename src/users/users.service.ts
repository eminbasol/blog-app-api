// authService.ts

import prisma from '../utils/prisma'
import { ErrorCodes, throwError } from '../utils/errors'
import { GetUserProfile } from './types'

export const getUserById = async ({ userId }: GetUserProfile) => {
	const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true, email: true } })
	if (!user) {
		throw throwError('User not found', ErrorCodes.notFound, 404)
	}
	return { id: user.id, username: user.username, email: user.email }
}
