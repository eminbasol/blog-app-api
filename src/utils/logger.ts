import { createLogger, format, transports } from 'winston'
import prisma from './prisma'
import { Request, Response } from 'express'

const { combine, timestamp, printf } = format

const logFormat = printf(({ level, message, timestamp, userId, endpoint }) => {
	return `${timestamp} [${level.toUpperCase()}] [User:${userId}] ${message} on ${endpoint}`
})

const logger = createLogger({
	format: combine(timestamp(), logFormat),
	transports: [new transports.Console()],
})

// Middleware to log to user.log table in the database
export const logToDB = async (req: Request, res: Response, error?: string) => {
	try {
		const log = await prisma.userLog.create({
			data: {
				userId: res?.locals?.payload?.userId ?? 0,
				action: req.method,
				endpoint: req.originalUrl,
				details: error ? error : req.body ? JSON.stringify(req.body) : '',
				ipAddress: req.ip ?? 'could not get IP',
			},
		})
		logger.info('Logged to database', log)
	} catch (dbError) {
		logger.error('Failed to log to database', dbError)
	}
}

export default logger
