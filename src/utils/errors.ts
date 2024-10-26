import { Request, Response, NextFunction } from 'express'

export const ErrorCodes = {
	missingJwt: 'NO_JWT',
	notFound: 'NOT_FOUND',
	serverError: 'SERVER_ERROR',
	badLogin: 'BAD_LOGIN',
	shortPassword: 'PASSWORD_SHORT',
	valueExists: 'VALUE_EXISTS',
	tokenExpired: 'TOKEN_EXPIRED',
	missingServerId: 'MISSING_SERVER_ID',
	badInput: 'BAD_INPUT',
	unauthorized: 'UNAUTHORIZED',
	validationError: 'VALIDATE_ERROR',
	conflictError: 'CONFLICT_ERROR',
	invalidCode: 'INVALID_CODE',
	invalidToken: 'INVALID_TOKEN',
	badRequest: 'BAD_REQUEST',
} as const

export const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	const errStatus = err?.status || 500
	const errMsg = err?.message || 'Something went wrong'
	res.status(errStatus).json({
		success: false,
		status: errStatus,
		message: errMsg,
		stack: process.env.NODE_ENV === 'development' ? err.stack : {},
	})
	next()
}

export const throwError = (message: string, code: string, status: number) => {
	const error = new Error(message)
	;(error as any).code = code
	;(error as any).status = status
	return error
}
