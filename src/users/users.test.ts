import request from 'supertest'
import { expect } from 'chai'
import initServer from '../initServer'
import http from 'http'
import { getRandomPort } from '../utils/randUtils'

const port = getRandomPort(50001, 59999)

let app: request.SuperTest<request.Test>
let server: http.Server

before(async () => {
	const { app: expressApp, server: httpServer } = initServer(port)
	// @ts-ignore
	app = request(expressApp) as request.SuperTest<request.Test>
	server = httpServer
})

after(async () => {
	if (server) {
		await new Promise<void>((resolve, reject) => {
			server.close((err) => {
				if (err) reject(err)
				else resolve()
			})
		})
	}
})

describe('Client user', () => {
	it('should get user profile data', async () => {
		const res = await app.get('/v1/client/user/profile').send()

		console.log('Get profile response:', res.status, res.body)

		expect(res.status).to.equal(200)
	})

	it('should not get user profile data', async () => {
		const res = await app.post('/v1/client/user/profile').send()

		console.log('Get profile invalid Response:', res.status, res.body)

		expect(res.status).to.equal(404)
	})
})
