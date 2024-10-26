import { Request, Response, NextFunction } from 'express'
import * as groupsService from './groups.service'
import { ErrorCodes, throwError } from '../utils/errors'
import { CreateGroup, UpdateGroup } from './types'
import { logToDB } from '../utils/logger'

export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const groups = await groupsService.getGroups()
		await logToDB(req, res)
		return res.status(200).json(groups)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const getUserGroups = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = Number(req.params.id)
		const groups = await groupsService.getUserGroups(userId)
		if (!groups.length) {
			throw throwError('User has no groups', ErrorCodes.notFound, 400)
		}
		await logToDB(req, res)
		return res.status(200).json(groups)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}
export const getGroupById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const group = await groupsService.getGroupById(Number(req.params.id))
		if (!group) {
			throw throwError('Group not found', ErrorCodes.notFound, 400)
		}
		await logToDB(req, res)
		return res.status(200).json(group)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name }: CreateGroup = req.body
		const userId = Number(res.locals.payload.userId)
		const group = await groupsService.createGroup({ name, userId })

		await logToDB(req, res)
		return res.status(201).json(group)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const updateGroup = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name }: UpdateGroup = req.body
		const userId = res.locals.payload.userId
		const updatedGroup = await groupsService.updateGroup({ groupId: Number(req.params.id), name, userId })
		await logToDB(req, res)
		res.json(updatedGroup)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = Number(res.locals.payload.userId)
		const groupId = await groupsService.deleteGroup(Number(req.params.id), userId)
		await logToDB(req, res)
		res.status(200).json(groupId)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}
