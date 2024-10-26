import authSchemas from './authSchemas'
import blogSchemas from './blogSchemas'

const schemas = {
	AuthSchemas: authSchemas,
	BlogSchemas: blogSchemas,
} as const

export type SchemaTypes = {
	[Key in keyof typeof schemas]: typeof schemas[Key]
}

const schemaTypes: SchemaTypes = schemas

export default schemaTypes
