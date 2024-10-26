import { ErrorCodes, throwError } from '../../utils/errors'
import prisma from '../../utils/prisma'

export const approveUser = async (userId: number) => {
	const user = await prisma.user.findUnique({ where: { id: userId } })
	if (!user) {
		throw throwError('User not found', ErrorCodes.notFound, 400)
	}
	const approvedUser = await prisma.user.update({
		where: { id: userId },
		data: { isApproved: true },
	})
	return approvedUser
}

export const blockUser = async (userId: number) => {
	const user = await prisma.user.findUnique({ where: { id: userId } })
	if (!user) {
		throw throwError('User not found', ErrorCodes.notFound, 400)
	}
	const blockedUser = await prisma.user.update({
		where: { id: userId },
		data: { isApproved: false },
	})
	return blockedUser
}

export const getPendingUsers = async () => {
	const pendingUsers = await prisma.user.findMany({
		where: { isApproved: false },
	})
	return pendingUsers
}
