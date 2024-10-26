import request from 'supertest'
import { expect } from 'chai'
import initServer from '../../initServer'
import http from 'http'
import { getRandomPort } from '../../utils/randUtils'

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

describe('Admin Auth', () => {
	it('should login successfully with valid credentials', async () => {
		const res = await app.post('/v1/admin/auth/login').send({ username: 'admin', password: process.env.API_ADMIN_PASSWORD! })

		console.log('Admin Auth Login Response:', res.status, res.body)

		expect(res.status).to.equal(200)
		expect(res.body).to.have.property('accessToken')
	})

	it('should not login with invalid credentials', async () => {
		const res = await app.post('/v1/admin/auth/login').send({ username: 'invalidUser', password: 'invalidPassword' })

		console.log('Admin Auth Invalid Login Response:', res.status, res.body)

		expect(res.status).to.equal(404)
	})
})
