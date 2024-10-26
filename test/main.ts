import { expect } from 'chai'
import request from 'supertest'
import initServer from '../src/initServer'
import http from 'http'
import { getRandomPort } from '../src/utils/randUtils'

const port = getRandomPort(50001, 59999)

let app: request.SuperTest<request.Test>
let server: http.Server

before(async () => {
	const { app: expressApp, server: httpServer } = initServer(port)
	app = request(expressApp) as unknown as request.SuperTest<request.Test>
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

describe('Main Endpoint', () => {
	it('should return a status of 200 and connected: true for the root endpoint', async () => {
		const res = await app.get('/') // Adjust the route based on your main.ts implementation
		console.info('Root Endpoint Response:', res.status, res.body)
		expect(res.status).to.equal(200)
		expect(res.body).to.have.property('connected', true)
	})
})
