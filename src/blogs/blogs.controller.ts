import { NextFunction, Request, Response } from 'express'
import * as blogsService from './blogs.service'
import { ErrorCodes, throwError } from '../utils/errors'
import { CreateBlog, UpdateBlog } from './types'
import { logToDB } from '../utils/logger'

export const getPublicBlogs = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const blogs = await blogsService.getPublicBlogs()

		await logToDB(req, res)
		return res.status(200).json(blogs)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(err)
	}
}

export const getUserPublicBlogs = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const blogs = await blogsService.getUserPublicBlogs(Number(req.params.id))

		await logToDB(req, res)
		return res.status(200).json(blogs)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = res.locals.payload.userId
		const blog = await blogsService.getBlogById(Number(req.params.id), userId)

		await logToDB(req, res)
		return res.status(200).json(blog)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { title, content, groupId }: CreateBlog = req.body
		const userId = res.locals.payload.userId
		const blog = await blogsService.createBlog({ title, content, userId, groupId })

		await logToDB(req, res)
		return res.status(201).json(blog)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { title, content }: UpdateBlog = req.body
		const blog = await blogsService.updateBlog({ blogId: Number(req.params.id), title, content })

		await logToDB(req, res)
		return res.status(200).json(blog)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const archiveBlog = async (req: Request, res: Response, next: NextFunction) => {
	const blogId = Number(req.params.id)
	try {
		await blogsService.archiveBlog(blogId)
		await logToDB(req, res)
		return res.status(200).json(blogId)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const softDeleteBlog = async (req: Request, res: Response, next: NextFunction) => {
	const blogId = Number(req.params.id)
	try {
		await blogsService.softDeleteBlog(blogId)
		await logToDB(req, res)
		return res.status(200).json(blogId)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const publishBlog = async (req: Request, res: Response, next: NextFunction) => {
	const blogId = Number(req.params.id)
	try {
		await blogsService.publishBlog(blogId)
		await logToDB(req, res)
		return res.status(200).json(blogId)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const restoreBlog = async (req: Request, res: Response, next: NextFunction) => {
	const blogId = Number(req.params.id)
	try {
		await blogsService.restoreBlog(blogId)
		await logToDB(req, res)
		return res.status(200).json(blogId)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

// GroupBlogs Functions
export const addBlogToGroup = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = res.locals.payload.userId
		const groupId = Number(req.params.id)
		const { title, content } = req.body
		const groupBlog = await blogsService.addBlogToGroup(userId, groupId, title, content)

		await logToDB(req, res)
		return res.status(201).json(groupBlog)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const updateBlogInGroup = async (req: Request, res: Response, next: NextFunction) => {
	const userId = res.locals.payload.userId
	const blogId = Number(req.params.id)
	try {
		const { title, content } = req.body
		const updatedBlog = await blogsService.updateBlogInGroup(userId, blogId, title, content)
		await logToDB(req, res)
		return res.status(200).json(updatedBlog)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const deleteBlogInGroup = async (req: Request, res: Response, next: NextFunction) => {
	const userId = res.locals.payload.userId
	const blogId = Number(req.params.id)
	try {
		const deletedBlog = await blogsService.deleteBlogInGroup(userId, blogId)
		await logToDB(req, res)
		return res.status(200).json(deletedBlog)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const approveGroupBlog = async (req: Request, res: Response, next: NextFunction) => {
	const userId = res.locals.payload.userId
	const blogId = Number(req.params.id)
	try {
		const approvedBlog = await blogsService.approveGroupBlog(userId, blogId)
		await logToDB(req, res)
		return res.status(200).json(approvedBlog)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const getGroupBlogs = async (req: Request, res: Response, next: NextFunction) => {
	const userId = res.locals.payload.userId
	const groupId = Number(req.params.id)

	try {
		const blogs = await blogsService.getGroupBlogs(userId, groupId)
		await logToDB(req, res)
		return res.status(200).json(blogs)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const getUserGroupBlogs = async (req: Request, res: Response, next: NextFunction) => {
	const userId = res.locals.payload.userId
	const groupId = Number(req.params.id)

	try {
		const blogs = await blogsService.getUserGroupBlogs(userId, groupId)
		await logToDB(req, res)
		return res.status(200).json(blogs)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}

export const getGroupBlogDetails = async (req: Request, res: Response, next: NextFunction) => {
	const { groupId, blogId } = req.params
	const userId = res.locals.payload.userId
	try {
		const blogDetails = await blogsService.getGroupBlogDetails(userId, Number(groupId), Number(blogId))
		await logToDB(req, res)
		return res.status(200).json(blogDetails)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}
export const archiveGroupBlog = async (req: Request, res: Response, next: NextFunction) => {
	const { groupId, blogId } = req.params
	const userId = res.locals.payload.userId
	try {
		const archivedBlogId = await blogsService.archiveGroupBlog(userId, Number(groupId), Number(blogId))
		await logToDB(req, res)
		return res.status(200).json(archivedBlogId)
	} catch (e) {
		const err = e as Error
		await logToDB(req, res, err.message)
		next(e)
	}
}
