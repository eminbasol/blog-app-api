import { ErrorCodes, throwError } from '../utils/errors'
import prisma from '../utils/prisma'
import { CreateGroup, UpdateGroup } from './types'

export const getGroups = async () => {
	return await prisma.group.findMany({
		where: {
			isDeleted: false,
		},
	})
}

export const getUserGroups = async (userId: number) => {
	const userGroups = await prisma.groupMembership.findMany({
		where: { userId },
		include: {
			group: true,
		},
	})
	return userGroups
}

export const getGroupById = async (groupId: number) => {
	const group = await prisma.group.findUnique({ where: { id: groupId } })
	return group
}

export const createGroup = async ({ name, userId }: CreateGroup) => {
	// Start a transaction to ensure both operations are atomic
	const group = await prisma.$transaction(async (prisma) => {
		// 1. Create the group
		const newGroup = await prisma.group.create({
			data: {
				name,
				adminId: userId,
			},
		})

		// 2. Add the user as a member and set their role as admin in GroupMembership
		await prisma.groupMembership.create({
			data: {
				userId,
				groupId: newGroup.id,
				roleId: 1, // Admin role
			},
		})

		return newGroup
	})

	return group
}

export const updateGroup = async ({ groupId, name, userId }: UpdateGroup) => {
	const group = await prisma.group.findUnique({
		where: { id: groupId },
	})

	if (!group || group.adminId !== userId) {
		throw throwError('Unauthorized or group not found', ErrorCodes.unauthorized, 401)
	}

	return await prisma.group.update({
		where: { id: groupId },
		data: { name },
	})
}

export const deleteGroup = async (groupId: number, userId: number) => {
	const group = await prisma.group.findUnique({
		where: { id: groupId },
	})

	if (!group || group.adminId !== userId) {
		throw throwError('Unauthorized or group not found', ErrorCodes.unauthorized, 401)
	}

	const deletedAt = new Date()

	// Soft delete the group
	await prisma.group.update({
		where: { id: groupId },
		data: { isDeleted: true, deletedAt },
	})

	// Update related blogs to mark them as DELETED
	await prisma.blog.updateMany({
		where: { groupId: groupId },
		data: { status: 'DELETED' },
	})

	// Update UserRole table to remove/invalidate roles for this group
	await prisma.groupMembership.deleteMany({
		where: { groupId: groupId },
	})

	return { groupId }
}
