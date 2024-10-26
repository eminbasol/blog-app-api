// authService.ts

import prisma from '../utils/prisma'
import { ErrorCodes, throwError } from '../utils/errors'
import hashUtils from '../utils/hashUtils'
import tokenUtils from '../utils/tokenUtils'
import { LoginParams, RefreshTokenParams, RegisterParams, RevokeTokenParams } from './types'
import { createUser } from '../utils/databaseUtils'

export const login = async ({ username, password }: LoginParams) => {
	const user = await prisma.user.findUnique({ where: { username } })
	if (!user) {
		throw throwError('User not found', ErrorCodes.notFound, 400)
	}

	if (!user.isApproved) {
		throw throwError('User not approved', ErrorCodes.unauthorized, 403)
	}

	const verifyPassword = hashUtils.verify(password, user?.password)
	if (!verifyPassword) {
		throw throwError('Bad login', ErrorCodes.badLogin, 400)
	}

	if (!user.twoFactorAuthEnabled) {
		await prisma.token.updateMany({
			where: { userId: user.id },
			data: { revoked: true },
		})

		const refreshToken = await tokenUtils.signRefreshToken({
			userId: user.id,
			username: user.username,
		})

		const accessToken = await tokenUtils.signToken({
			userId: user.id,
			username: user.username,
		})

		await prisma.token.create({
			data: {
				userId: user.id,
				type: 'user',
				accessToken,
				refreshToken,
				expiredAt: new Date(new Date().setDate(new Date().getDate() + 1)),
			},
		})

		return { accessToken, refreshToken }
	} else {
		const twoFactorAccessToken = await tokenUtils.sign2faToken({
			userId: user.id,
			username: user.username,
		})
		return { twoFactorAccessToken }
	}
}
export const register = async ({ username, password, email }: RegisterParams) => {
	// Check if user exits
	const userExist = await prisma.user.findFirst({
		where: { OR: [{ username }, { email }] },
	})
	if (userExist) {
		throw throwError('Exist', ErrorCodes.valueExists, 400)
	}
	// Create user
	const user = await createUser({
		username,
		nonHashedPassword: password,
		email,
	})
	if (!user) throw throwError('User registration failed', ErrorCodes.serverError, 500)
	return { message: 'User registered successfully. Awaiting approval.' }
}

export const refreshToken = async ({ refreshToken }: RefreshTokenParams) => {
	const dbToken = await prisma.token.findUnique({
		where: { refreshToken },
	})

	if (!dbToken || dbToken.revoked) {
		throw throwError('Token not found', ErrorCodes.unauthorized, 401)
	} else if (dbToken.expiredAt.getTime() - new Date().getTime() <= 0) {
		throw throwError('Token expired', ErrorCodes.tokenExpired, 401)
	}

	try {
		const payload = tokenUtils.verifyToken(refreshToken)
		const accessToken = await tokenUtils.signToken({
			userId: payload.userId,
			username: payload.username,
		})
		return { accessToken }
	} catch (err) {
		throw throwError('Server error', ErrorCodes.serverError, 500)
	}
}

export const revokeToken = async ({ refreshToken }: RevokeTokenParams) => {
	await prisma.token.update({
		where: { refreshToken },
		data: { revoked: true },
	})
}
