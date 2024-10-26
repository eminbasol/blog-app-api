import { createClient } from 'redis'

let redis: ReturnType<typeof createClient> | null = null

export const redisClient = async () => {
	if (!redis) {
		const redisInstance = createClient({ url: process.env.API_REDIS_URL })
		redisInstance.on('error', (err) => {
			console.error('Redis Client Error', err)
		})

		await redisInstance.connect()
		redis = redisInstance
	}

	return { redis, redisReady: true }
}
