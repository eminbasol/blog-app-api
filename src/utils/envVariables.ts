import dotenv from 'dotenv'
import { join } from 'path'

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '../../../', '.env') })

const envTypes = ['local', 'dev', 'staging', 'prod'] as const

type NodeEnv = Readonly<{
	port?: number
	envType?: typeof envTypes[number]
	jwtPrivateKey?: string
	adminEmail?: string
	adminPassword?: string
	cryptoPrivateKey?: string
	apiDbUrl?: string
	seed?: boolean
	corsWhitelist?: string
}>

type SanitizedNodeEnv = Required<NodeEnv>

const booleanProcessEnv = (variable?: string) => (variable ? variable.toLowerCase() === 'true' : undefined)

const numberProcessEnv = (variable?: string) => (variable ? parseInt(variable) : undefined)

const env: NodeEnv = {
	envType: process.env.PROJECT_ENV as NodeEnv['envType'],
	port: numberProcessEnv(process.env.PORT),
	jwtPrivateKey: process.env.API_JWT_KEY,
	adminEmail: process.env.API_ADMIN_EMAIL,
	adminPassword: process.env.API_ADMIN_PASSWORD,
	cryptoPrivateKey: process.env.API_CRYPTO_KEY,
	apiDbUrl: process.env.API_DB_URL,
	seed: booleanProcessEnv(process.env.API_SEED_DB),
	corsWhitelist: process.env.CORS_WHITELIST,
}

// Function to sanitize environment variables and check for required fields
const sanitize = (env: NodeEnv): SanitizedNodeEnv => {
	const missingKeys = Object.keys(env).filter((key) => env[key as keyof NodeEnv] === undefined)

	if (missingKeys.length > 0) {
		console.error(`Missing environment variables: ${missingKeys.join(', ')}`)
		throw new Error(`Missing environment variables: ${missingKeys.join(', ')}`)
	}

	if (!envTypes.includes(env.envType!)) {
		throw new Error(`Invalid environment value in .env. Possible values: ${envTypes.join(', ')}`)
	}

	return env as SanitizedNodeEnv
}

const sanitizedEnv: SanitizedNodeEnv = sanitize(env)

export default () => sanitizedEnv
