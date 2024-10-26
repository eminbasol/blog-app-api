export type LoginParams = {
	username: string
	password: string
}

export type RefreshTokenParams = {
	refreshToken: string
}

export type RevokeTokenParams = {
	refreshToken: string
}

export type RegisterParams = {
	username: string
	password: string
	email: string
}
