import { NextFunction, Request, Response } from 'express'
import * as AdminService from './user.service'
import { logToDB } from '../../utils/logger'

export const approveUser = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id
	try {
		const user = await AdminService.approveUser(Number(id))
		await logToDB(req, res)
		return res.status(200).json({ message: 'User approved successfully', user })
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const blockUser = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id
	try {
		const user = await AdminService.blockUser(Number(id))
		await logToDB(req, res)
		res.status(200).json({ message: 'User blocked successfully', user })
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const getPendingUsers = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await AdminService.getPendingUsers()
		await logToDB(req, res)
		res.status(200).json(users)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}
