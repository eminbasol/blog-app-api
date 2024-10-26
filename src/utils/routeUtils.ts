import { RequestHandler } from 'express'
import { ErrorCodes } from './errors'
import tokenUtils from './tokenUtils'
import prisma from './prisma'

export const verifyAdminToken: RequestHandler = async (req, res, next) => {
	const accessToken = req.header('x-auth')
	if (!accessToken)
		return res.send({
			status: 401,
			error: 'Login required',
			code: ErrorCodes.missingJwt,
		})
	try {
		const payload = tokenUtils.verifyToken(accessToken)
		if (payload.role !== 'globalAdmin') return res.sendStatus(401)
		const token = await prisma.token.findUnique({ where: { accessToken }, select: { revoked: true } })
		if (token?.revoked) return res.sendStatus(401)
		res.locals.payload = payload
		next()
	} catch (e) {
		return res.send({
			status: 401,
			error: 'Login required',
			code: ErrorCodes.tokenExpired,
		})
	}
}

export const verifyToken: RequestHandler = async (req, res, next) => {
	try {
		const accessToken = req.header('x-auth')
		if (!accessToken)
			return res.status(401).send({
				status: 401,
				error: 'Login required',
				code: ErrorCodes.missingJwt,
			})

		const payload = tokenUtils.verifyToken(accessToken)
		const token = await prisma.token.findUnique({ where: { accessToken }, select: { revoked: true } })
		if (token?.revoked) return res.sendStatus(401)
		res.locals.payload = payload

		next()
	} catch (e) {
		return res.status(401).send({
			status: 401,
			error: 'Login required',
			code: ErrorCodes.tokenExpired,
		})
	}
}
