type RateLimitConfig = {
	name: string
	allowedRequests: number
	period: number
	method?: string
}

const redisRateLimits: { [key: string]: RateLimitConfig } = {
	default: {
		name: 'default',
		allowedRequests: 2000,
		period: 5 * 60,
	},
	'POST:/v1/client/auth/login': {
		name: 'login',
		allowedRequests: 5,
		period: 60,
	},
}

export default redisRateLimits
