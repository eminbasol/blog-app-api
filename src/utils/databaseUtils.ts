import prisma from './prisma'
import hashUtils from './hashUtils'

type CreateUserParams =
	| {
			username: string
			hashedPassword: string
			email: string
			nonHashedPassword?: never
	  }
	| {
			username: string
			nonHashedPassword: string
			email: string
			hashedPassword?: never
	  }
export const createUser = async (params: CreateUserParams) => {
	const { username, hashedPassword, nonHashedPassword, email } = params

	return prisma.user.create({
		data: {
			username,
			password: hashedPassword ?? hashUtils.hash(nonHashedPassword),
			email,
			isApproved: false,
		},
	})
}
