import express from 'express'
import http from 'http'
import Cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import adminRouter from './admin/adminRouter'
import router from './router'
import { ErrorHandler } from './utils/errors'
import redisMiddleware from './utils/redisMiddleware'

const initServer = (port: number): { app: express.Express; server: http.Server } => {
	const app = express()
	const server = http.createServer(app)

	const origin = () => {
		const whitelist = process.env.CORS_WHITELIST ?? ''
		return whitelist.split(',')
	}
	const cors = { origin: origin(), credentials: true }
	app.set('trust proxy', true)
	app.use(helmet())
	app.use(Cors(cors))
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: true }))

	app.get('/', (req, res) => res.json({ connected: true }))

	app.use(redisMiddleware)
	app.use('/v1/admin', adminRouter)
	app.use('/v1/client', router)
	app.use(ErrorHandler)

	server.listen(port, () => console.log(`Express server is listening on port ${port}`))

	return { app, server }
}

export default initServer
