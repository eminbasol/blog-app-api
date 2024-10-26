// src/admin/auth/controller.ts

import { NextFunction, Request, Response } from 'express'
import * as authService from './auth.service'
import { LoginParams, RegisterParams } from './types'
import { logToDB } from '../../utils/logger'

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { username, password }: LoginParams = req.body
		if (!(username && password)) {
			return res.status(400).json({ message: 'Missing Fields' })
		}

		const result = await authService.login({ username, password })
		return res.json(result)
	} catch (e) {
		next(e)
	}
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { username, password, email }: RegisterParams = req.body
		if (!(password && password.length > 3)) {
			return res.status(400).json({ message: 'Password should be at least 3 characters.' })
		}

		const tokens = await authService.register({ username, password, email })

		res.status(201).json(tokens)
	} catch (e) {
		next(e)
	}
}
