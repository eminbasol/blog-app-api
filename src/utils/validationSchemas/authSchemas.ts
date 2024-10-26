import Joi from 'joi'

const signUpSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).required(),
	password: Joi.string()
		.regex(/[ -~]*[a-z][ -~]*/)
		.message('The password must contain at least one lowercase letter (A-Z).')
		.regex(/[ -~]*[A-Z][ -~]*/)
		.message('The password must contain at least one uppercase letter (A-Z).')
		.regex(/[ -~]*(?=[ -~])[^0-9a-zA-Z][ -~]*/)
		.message('The password must contain at least one special character (*, #, @, etc.).')
		.regex(/[ -~]*[0-9][ -~]*/)
		.message('The password must contain at least one number (0-9).')
		.regex(/^[^\s]+$/)
		.message('The password should not contain any spaces or gaps.')
		.min(8)
		.max(64)
		.required(),
	email: Joi.string().email().required(),
})

const loginSchema = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required(),
})

const authSchemas = { signUpSchema, loginSchema }
export default authSchemas
