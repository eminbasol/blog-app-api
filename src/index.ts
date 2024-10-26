import initServer from './initServer'
import envVariables from './utils/envVariables'
import { initSeeder } from '../prisma/seeds/initSeeder'

const main = async () => {
	const port = envVariables().port || 5000

	// Seed the database if required
	if (envVariables().seed) {
		await initSeeder()
	}

	const { server } = initServer(port)

	// Handle SIGINT (Ctrl+C) for graceful shutdown
	process.on('SIGINT', () => {
		console.log('SIGINT signal received.')
		server.close(() => {
			console.log('Server closed.')
			process.exit(0)
		})
	})

	// Handle SIGUSR2 (used by nodemon for restarts)
	process.on('SIGUSR2', () => {
		console.log('SIGUSR2 signal received.')
		server.close(() => {
			console.log('Server restarted.')
			process.kill(process.pid, 'SIGUSR2')
		})
	})
}

main().catch(console.error)
