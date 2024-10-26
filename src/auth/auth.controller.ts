// controller.ts

import { NextFunction, Request, Response } from 'express'
import * as authService from './auth.service'
import { LoginParams, RegisterParams } from './types'

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { username, password }: LoginParams = req.body
		if (!(username && password)) {
			return res.status(400).json({ message: 'Missing Fields' })
		}

		const tokens = await authService.login({ username, password })

		return res.json(tokens)
	} catch (e) {
		next(e)
	}
}
export const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { username, password, email }: RegisterParams = req.body
		if (!username || !password || !email) {
			return res.status(400).json({ message: 'Missing Fields' })
		}
		if (!(password && password.length > 3)) {
			return res.status(400).json({ message: 'Password should be at least 3 characters.' })
		}

		const tokens = await authService.register({ username, password, email })

		return res.status(201).json(tokens)
	} catch (e) {
		next(e)
	}
}
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
	const refreshToken = req.header('x-auth-refresh-token')
	if (!refreshToken) {
		return res.status(401).json({ message: 'Token required' })
	}
	try {
		const newToken = await authService.refreshToken({ refreshToken })

		return res.json(newToken)
	} catch (e) {
		next(e)
	}
}

export const checkToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		res.json({ success: true })
	} catch (e) {
		next(e)
	}
}

export const revokeToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const refreshToken = req.header('x-auth-refresh-token') || ''
		await authService.revokeToken({ refreshToken })
		res.send({ message: 'success' })
	} catch (e) {
		next(e)
	}
}
