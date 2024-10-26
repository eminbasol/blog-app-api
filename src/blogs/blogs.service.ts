import { ErrorCodes, throwError } from '../utils/errors'
import prisma from '../utils/prisma'
import { BlogStatus, CreateBlog, UpdateBlog } from './types'
import { addDays, addHours, addMonths, isAfter, isBefore, isWithinInterval } from 'date-fns'

export const getPublicBlogs = async () => {
	const blogs = await prisma.blog.findMany({
		where: {
			groupId: null,
			status: BlogStatus.PUBLISHED,
		},
	})
	return blogs
}

export const getUserPublicBlogs = async (userId: number) => {
	const blogs = await prisma.blog.findMany({
		where: {
			authorId: userId,
			groupId: null,
			status: BlogStatus.PUBLISHED,
		},
	})
	return blogs
}

export const getBlogById = async (blogId: number, userId: number) => {
	const blog = await prisma.blog.findUnique({ where: { id: blogId } })
	if (!blog) {
		throw throwError('Blog not found', ErrorCodes.notFound, 400)
	}
	if (blog.authorId !== userId && blog.status !== BlogStatus.PUBLISHED) {
		throw throwError('Unauthorized', ErrorCodes.unauthorized, 401)
	}

	return blog
}

export const createBlog = async ({ title, content, userId, groupId }: CreateBlog) => {
	if (!title || !content) {
		throw throwError('Title and content are required', ErrorCodes.validationError, 400)
	}

	// Check the user's current blog count
	const draftsCount = await prisma.blog.count({
		where: {
			authorId: userId,
			OR: [{ status: BlogStatus.DRAFT }, { status: BlogStatus.PUBLISHED }],
		},
	})

	if (draftsCount >= 3) {
		throw throwError('You can only create up to 3 blogs at the same time', ErrorCodes.badRequest, 400)
	}

	const blog = await prisma.blog.create({
		data: {
			title,
			content,
			authorId: userId,
			groupId,
			status: BlogStatus.DRAFT,
		},
	})
	return blog
}

export const updateBlog = async ({ blogId, title, content }: UpdateBlog) => {
	if (!title || !content) {
		throw throwError('Title and content are required', ErrorCodes.validationError, 400)
	}
	const blog = await prisma.blog.findUnique({
		where: { id: blogId },
	})

	if (!blog) throw throwError('Blog not found', ErrorCodes.notFound, 404)

	if (blog.publishedAt && isAfter(new Date(), addDays(blog.publishedAt, 7))) {
		throw throwError('Editing period has expired', ErrorCodes.unauthorized, 401)
	}

	const updatedBlog = await prisma.blog.update({
		where: { id: blogId },
		data: {
			title,
			content,
		},
	})
	return updatedBlog
}

export const archiveBlog = async (blogId: number) => {
	const blog = await prisma.blog.findUnique({
		where: { id: blogId },
		select: { status: true, publishedAt: true },
	})

	if (!blog) throw throwError('Blog not found', ErrorCodes.notFound, 404)
	if (blog.status !== BlogStatus.PUBLISHED) {
		throw throwError('Blog must be published to be archived', ErrorCodes.badRequest, 400)
	}

	if (blog.publishedAt) {
		if (isAfter(addMonths(blog.publishedAt, 3), new Date())) {
			throw throwError('Blog cannot be archived until 3 months after publishing', ErrorCodes.unauthorized, 403)
		}
	}
	await prisma.blog.update({
		where: { id: blogId },
		data: {
			status: BlogStatus.ARCHIVED,
		},
	})
	return blogId
}

export const softDeleteBlog = async (blogId: number) => {
	const blog = await prisma.blog.findUnique({
		where: { id: blogId },
	})

	if (!blog) throw throwError('Blog not found', ErrorCodes.notFound, 404)

	if (blog.status !== BlogStatus.ARCHIVED) {
		throw throwError('Blog cannot be deleted until it is archived', ErrorCodes.unauthorized, 401)
	}
	await prisma.blog.update({
		where: { id: blogId },
		data: {
			status: BlogStatus.DELETED,
			deletedAt: new Date(),
		},
	})
	return blogId
}

export const publishBlog = async (blogId: number) => {
	const blog = await prisma.blog.findUnique({
		where: { id: blogId },
	})

	if (!blog) throw throwError('Blog not found', ErrorCodes.notFound, 404)

	// Ensure the blog is a draft
	if (blog.status !== 'DRAFT') {
		throw throwError('Only drafts can be published', ErrorCodes.badRequest, 400)
	}

	// Check if the draft is at least 24 hours old
	if (isBefore(new Date(), addHours(blog.createdAt, 24))) {
		throw throwError('Blog must be at least 24 hours old to be published', ErrorCodes.badRequest, 400)
	}
	const publishedBlog = await prisma.blog.update({
		where: { id: blogId },
		data: {
			status: BlogStatus.PUBLISHED,
			publishedAt: new Date(),
		},
	})
	return publishedBlog
}

export const restoreBlog = async (blogId: number) => {
	const blog = await prisma.blog.findUnique({
		where: { id: blogId },
	})
	if (!blog) throw throwError('Blog not found', ErrorCodes.notFound, 404)
	if (!blog || !blog.deletedAt) {
		throw throwError('Blog not found or not deleted', ErrorCodes.notFound, 404)
	}

	// Check if the restore is within 30 days
	if (isWithinInterval(new Date(), { start: new Date(blog.deletedAt), end: addDays(new Date(blog.deletedAt), 30) })) {
		const restoredBlog = await prisma.blog.update({
			where: { id: blogId },
			data: {
				deletedAt: null,
				publishedAt: null,
				status: BlogStatus.DRAFT,
			},
		})
		return restoredBlog
	} else {
		throw throwError('Restore period has expired', ErrorCodes.unauthorized, 401)
	}
}

export const addBlogToGroup = async (userId: number, groupId: number, title: string, content: string) => {
	const groupMembership = await prisma.groupMembership.findUnique({
		where: { userId_groupId: { userId, groupId } },
	})

	if (!groupMembership) {
		throw new Error('User is not a member of this group')
	}

	// Add blog as DRAFT for regular members, directly PUBLISHED for admins
	const status = groupMembership.roleId === 1 ? BlogStatus.PUBLISHED : BlogStatus.DRAFT

	const blog = await prisma.blog.create({
		data: {
			title,
			content,
			status,
			groupId,
			authorId: userId,
		},
	})

	return blog
}

export const updateBlogInGroup = async (userId: number, blogId: number, title: string, content: string) => {
	const blog = await prisma.blog.findUnique({ where: { id: blogId }, include: { group: true } })

	if (!blog) {
		throw throwError('Blog not found', ErrorCodes.notFound, 400)
	}

	if (!blog.groupId) {
		throw throwError('Blog is not part of a group', ErrorCodes.notFound, 400)
	}

	if (blog.publishedAt && isAfter(new Date(), addDays(blog.publishedAt, 7))) {
		throw throwError('Editing period has expired', ErrorCodes.unauthorized, 401)
	}

	const groupMembership = await prisma.groupMembership.findUnique({
		where: { userId_groupId: { userId, groupId: blog.groupId } },
	})

	if (!groupMembership || groupMembership.roleId === 3) {
		throw throwError('Admins and CoAdmins can update group blogs', ErrorCodes.unauthorized, 401)
	}

	return await prisma.blog.update({
		where: { id: blogId },
		data: {
			title,
			content,
		},
	})
}

export const deleteBlogInGroup = async (userId: number, blogId: number) => {
	const blog = await prisma.blog.findUnique({ where: { id: blogId }, include: { group: true } })

	if (!blog) {
		throw throwError('Blog not found', ErrorCodes.notFound, 400)
	}

	if (!blog.groupId) {
		throw throwError('Blog is not part of a group', ErrorCodes.notFound, 400)
	}

	if (blog.status !== BlogStatus.ARCHIVED) {
		throw throwError('Blog cannot be deleted until it is archived', ErrorCodes.unauthorized, 401)
	}

	const groupMembership = await prisma.groupMembership.findUnique({
		where: { userId_groupId: { userId, groupId: blog.groupId } },
	})

	if (!groupMembership || groupMembership.roleId === 3) {
		throw throwError('Admins and CoAdmins can delete group blogs', ErrorCodes.unauthorized, 401)
	}

	const deletedBlog = await prisma.blog.update({
		where: { id: blogId },
		data: {
			status: BlogStatus.DELETED,
			deletedAt: new Date(),
		},
	})
	return deletedBlog
}

export const approveGroupBlog = async (userId: number, blogId: number) => {
	const blog = await prisma.blog.findUnique({ where: { id: blogId }, include: { group: true } })

	if (!blog || blog.status !== 'DRAFT') {
		throw throwError('Blog not found or not in draft status', ErrorCodes.notFound, 400)
	}

	if (!blog.groupId) {
		throw throwError('Blog is not part of a group', ErrorCodes.notFound, 400)
	}

	// Ensure the blog is a draft
	if (blog.status !== 'DRAFT') {
		throw throwError('Only drafts can be published', ErrorCodes.badRequest, 400)
	}

	const groupMembership = await prisma.groupMembership.findUnique({
		where: { userId_groupId: { userId, groupId: blog.groupId } },
	})

	if (!groupMembership || groupMembership.roleId === 3) {
		throw throwError('Admins and CoAdmins can approve group blogs', ErrorCodes.unauthorized, 401)
	}

	// Check if the draft is at least 24 hours old
	if (isAfter(new Date(), addHours(blog.createdAt, 24))) {
		const publishedBlog = await prisma.blog.update({
			where: { id: blogId },
			data: {
				status: BlogStatus.PUBLISHED,
				publishedAt: new Date(),
			},
		})
		return publishedBlog
	} else {
		throw throwError('Blog must be at least 24 hours old to be published', ErrorCodes.badRequest, 400)
	}
}

export const getBlogVisibilityByRole = async (userId: number, groupId: number) => {
	const groupMembership = await prisma.groupMembership.findUnique({
		where: { userId_groupId: { userId, groupId } },
		select: { roleId: true },
	})

	if (!groupMembership) {
		throw throwError('User is not a member of this group', ErrorCodes.notFound, 400)
	}

	const visibleStatuses: BlogStatus[] =
		groupMembership.roleId === 1 || groupMembership.roleId === 2
			? (['PUBLISHED', 'DRAFT'] as BlogStatus[]) // Admin or Co-Admin can see both statuses
			: (['PUBLISHED'] as BlogStatus[]) // Member can see only published blogs

	return visibleStatuses
}

export const getGroupBlogs = async (userId: number, groupId: number) => {
	const visibleStatuses = await getBlogVisibilityByRole(userId, groupId)
	const blogs = await prisma.blog.findMany({
		where: {
			groupId,
			status: { in: visibleStatuses },
		},
		orderBy: { createdAt: 'desc' },
	})

	return blogs
}

export const getUserGroupBlogs = async (userId: number, groupId: number) => {
	const visibleStatuses = await getBlogVisibilityByRole(userId, groupId)
	const blogs = await prisma.blog.findMany({
		where: {
			authorId: userId,
			groupId,
			status: { in: visibleStatuses },
		},
		orderBy: { createdAt: 'desc' },
	})

	return blogs
}
export const getGroupBlogDetails = async (userId: number, groupId: number, blogId: number) => {
	const visibleStatuses = await getBlogVisibilityByRole(userId, groupId)

	const blog = await prisma.blog.findFirst({
		where: {
			id: blogId,
			groupId: groupId,
			status: { in: visibleStatuses },
		},
		include: { author: true },
	})
	if (!blog) {
		throw throwError('Blog not found or access denied', ErrorCodes.notFound, 404)
	}

	return blog
}
export const archiveGroupBlog = async (userId: number, groupId: number, blogId: number) => {
	const blog = await prisma.blog.findUnique({
		where: {
			id: blogId,
		},
	})

	if (!blog) {
		throw throwError('Blog not found', ErrorCodes.notFound, 404)
	}

	if (blog.publishedAt && isAfter(addMonths(blog.publishedAt, 3), new Date())) {
		throw throwError('Blog cannot be archived until 3 months after publishing', ErrorCodes.unauthorized, 401)
	}

	const groupMembership = await prisma.groupMembership.findUnique({
		where: { userId_groupId: { userId, groupId } },
		select: { roleId: true },
	})

	if (!groupMembership) {
		throw throwError('User not part of this group', ErrorCodes.notFound, 404)
	}

	const canArchive =
		groupMembership.roleId === 1 ||
		groupMembership.roleId === 2 || // Admin or Co-Admin
		(groupMembership.roleId === 3 && blog.authorId === userId && blog.status === BlogStatus.PUBLISHED) // Member archiving own published blog

	if (!canArchive) {
		throw throwError('Unauthorized to archive this blog', ErrorCodes.unauthorized, 403)
	}

	const archivedBlog = await prisma.blog.update({
		where: { id: blogId },
		data: { status: BlogStatus.ARCHIVED },
	})
	return archivedBlog.id
}
