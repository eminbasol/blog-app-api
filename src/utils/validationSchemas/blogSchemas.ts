import Joi from 'joi'

const createBlogSchema = Joi.object({
	title: Joi.string().required(),
	content: Joi.string().required(),
	groupId: Joi.number().optional(),
})

const updateBlogSchema = Joi.object({
	title: Joi.string().required(),
	content: Joi.string().required(),
})

const blogSchemas = { createBlogSchema, updateBlogSchema }
export default blogSchemas
