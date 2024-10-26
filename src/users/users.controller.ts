// controller.ts

import { NextFunction, Request, Response } from 'express'
import * as authService from './users.service'
import { logToDB } from '../utils/logger'

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userData = await authService.getUserById({ userId: Number(req.params.id) })
		await logToDB(req, res)
		return res.json(userData)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}
