import { ErrorCodes, throwError } from '../../utils/errors'
import prisma from '../../utils/prisma'

export const addMemberToGroup = async (groupId: number, userId: number) => {
	const existingMember = await prisma.groupMembership.findUnique({
		where: {
			userId_groupId: {
				userId,
				groupId,
			},
		},
	})

	if (existingMember) {
		throw throwError('User is already a member of this group', ErrorCodes.valueExists, 400)
	}

	const newMember = await prisma.groupMembership.create({
		data: {
			userId,
			roleId: 3,
			groupId,
		},
	})
	return newMember
}

export const removeMemberFromGroup = async (groupId: number, userId: number) => {
	const member = await prisma.groupMembership.findUnique({
		where: {
			userId_roleId_groupId: {
				userId,
				roleId: 3,
				groupId,
			},
		},
	})

	if (!member) {
		throw throwError('User is not a member of this group', ErrorCodes.notFound, 400)
	}

	await prisma.groupMembership.delete({
		where: {
			userId_roleId_groupId: {
				userId,
				roleId: 3,
				groupId,
			},
		},
	})

	return userId
}

export const selectCoAdmin = async (groupId: number, userId: number) => {
	const member = await prisma.groupMembership.findUnique({
		where: {
			userId_groupId: {
				userId,
				groupId,
			},
		},
	})

	if (!member) {
		throw throwError('User is not a member of this group', ErrorCodes.notFound, 404)
	}
	if (member.roleId !== 3) {
		throw throwError('Member has already authorization', ErrorCodes.badRequest, 400)
	}
	const updatedMember = await prisma.groupMembership.update({
		where: { userId_groupId: { userId, groupId } },
		data: { roleId: 2 },
	})
	return updatedMember
}

export const revokeCoAdmin = async (groupId: number, userId: number) => {
	const coAdmin = await prisma.groupMembership.findUnique({
		where: { userId_groupId: { userId, groupId } },
	})
	if (!coAdmin || coAdmin.roleId !== 2) {
		throw throwError('User is not a co-admin of this group', ErrorCodes.badRequest, 401)
	}

	const updatedUserRole = await prisma.groupMembership.update({
		where: {
			userId_groupId: { userId, groupId },
		},
		data: { roleId: 3 },
	})
	return updatedUserRole
}
