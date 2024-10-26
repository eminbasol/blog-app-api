import * as members from './members.service'
import { NextFunction, Request, Response } from 'express'
import { getGroupById } from '../groups.service'
import { ErrorCodes, throwError } from '../../utils/errors'
import { logToDB } from '../../utils/logger'
export const addMemberToGroup = async (req: Request, res: Response, next: NextFunction) => {
	const groupId = Number(req.params.groupId)
	const userId = Number(req.params.userId)

	try {
		const group = await getGroupById(groupId)
		if (!group) {
			throw throwError('Group not found', ErrorCodes.notFound, 400)
		}
		if (group.adminId !== res.locals.payload.userId) {
			throw throwError('Unauthorized: Only group admins can add members', ErrorCodes.unauthorized, 401)
		}
		const userRole = await members.addMemberToGroup(groupId, userId)
		await logToDB(req, res)
		return res.status(200).json(userRole)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const removeMemberFromGroup = async (req: Request, res: Response, next: NextFunction) => {
	const groupId = Number(req.params.groupId)
	const userId = Number(req.params.userId)

	try {
		const group = await getGroupById(groupId)
		if (!group) {
			throw throwError('Group not found', ErrorCodes.notFound, 400)
		}
		if (group.adminId !== res.locals.payload.userId) {
			throw throwError('Only group admins can remove members', ErrorCodes.unauthorized, 401)
		}
		const removedMemberId = await members.removeMemberFromGroup(groupId, userId)
		await logToDB(req, res)
		return res.status(200).json(removedMemberId)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const selectCoAdmin = async (req: Request, res: Response, next: NextFunction) => {
	const groupId = Number(req.params.groupId)
	const userId = Number(req.params.userId)

	try {
		const group = await getGroupById(groupId)
		if (!group) {
			throw throwError('Group not found', ErrorCodes.notFound, 400)
		}
		if (group.adminId !== res.locals.payload.userId) {
			throw throwError('Only group admins can select co-admins', ErrorCodes.unauthorized, 401)
		}
		const coAdmin = await members.selectCoAdmin(groupId, userId)
		await logToDB(req, res)
		return res.status(200).json(coAdmin)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const revokeCoAdmin = async (req: Request, res: Response, next: NextFunction) => {
	const groupId = Number(req.params.groupId)
	const userId = Number(req.params.userId)

	try {
		const group = await getGroupById(groupId)
		if (!group) {
			throw throwError('Group not found', ErrorCodes.notFound, 400)
		}
		if (group.adminId !== res.locals.payload.userId) {
			throw throwError('Only group admin can revoke co-admins', ErrorCodes.unauthorized, 401)
		}
		const revokedCoAdmin = await members.revokeCoAdmin(groupId, userId)
		await logToDB(req, res)
		return res.status(200).json(revokedCoAdmin)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const joinGroup = async (req: Request, res: Response, next: NextFunction) => {
	const groupId = Number(req.params.groupId)
	const userId = res.locals.payload.userId

	try {
		;``
		const group = await getGroupById(groupId)
		if (!group) {
			throw throwError('Group not found', ErrorCodes.notFound, 400)
		}
		const userRole = await members.addMemberToGroup(groupId, userId)
		await logToDB(req, res)
		return res.status(200).json(userRole)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}
