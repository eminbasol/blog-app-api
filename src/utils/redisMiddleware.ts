import { NextFunction, Request, Response } from 'express'
import redisRateLimits from './redisRateLimits'
import { ErrorCodes, throwError } from './errors'
import { redisClient } from './redis'

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (process.env.PROJECT_ENV !== 'local') {
			const route = redisRateLimits[`${req.method}:${req.path}`] ?? redisRateLimits['default']
			const key = `rl:user:${req.ip}:${route.name}:${req.method}`

			const { redis } = await redisClient()
			await redis.set(key, 0, {
				EX: route.period,
				NX: true,
			})

			const requestsCount = await redis.incr(key)
			if (requestsCount == route.allowedRequests + 1) {
				console.info(`A user with IP ${req.ip} was blocked!`)
			}

			if (requestsCount > route.allowedRequests) {
				return res.status(429).json({ error: 'Too many attempts!', status: 429 })
			}
		}
		next()
	} catch (e) {
		next(e)
	}
}
