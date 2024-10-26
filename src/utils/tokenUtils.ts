import jwt from 'jsonwebtoken'
import envVariables from './envVariables'

const privateKey = envVariables().jwtPrivateKey
const private2faKey = envVariables().cryptoPrivateKey

interface AppJwtTokenContent {
	userId: number
	username: string
	role?: string
}

export interface AppJwtToken extends AppJwtTokenContent {
	iss?: string | undefined
	sub?: string | undefined
	aud?: string | string[] | undefined
	exp?: number | undefined
	nbf?: number | undefined
	iat?: number | undefined
	jti?: string | undefined
}

const signToken = async (payload: AppJwtTokenContent) => {
	return jwt.sign(payload, privateKey, { issuer: 'eb', expiresIn: '1h' })
}
const sign2faToken = async (payload: AppJwtTokenContent) => {
	return jwt.sign(payload, private2faKey, { issuer: 'eb', expiresIn: '90s' })
}

// NOTE: if  you update time, you have to set db token expires
const signRefreshToken = async (payload: AppJwtTokenContent) => {
	return jwt.sign(payload, privateKey, { issuer: 'eb', expiresIn: '1d' })
}

const verifyToken: (token: string) => AppJwtToken = (token) => {
	return jwt.verify(token, privateKey) as AppJwtToken
}
const verify2faToken: (token: string) => AppJwtToken = (token) => {
	return jwt.verify(token, private2faKey) as AppJwtToken
}

export default {
	signToken,
	verifyToken,
	signRefreshToken,
	sign2faToken,
	verify2faToken,
}
