import { Router } from 'express'
import { verifyToken } from '../utils/routeUtils'
import {
	addBlogToGroup,
	approveGroupBlog,
	archiveBlog,
	archiveGroupBlog,
	createBlog,
	deleteBlogInGroup,
	getBlogById,
	getGroupBlogDetails,
	getGroupBlogs,
	getPublicBlogs,
	getUserGroupBlogs,
	getUserPublicBlogs,
	publishBlog,
	restoreBlog,
	softDeleteBlog,
	updateBlog,
	updateBlogInGroup,
} from './blogs.controller'
import { validator } from '../utils/validator'

const router = Router()

router.get('/', verifyToken, getPublicBlogs)
router.get('/user/:id', verifyToken, getUserPublicBlogs)
router.get('/:id', verifyToken, getBlogById)
router.post('/', verifyToken, validator('BlogSchemas', 'createBlogSchema'), createBlog)
router.put('/:id', verifyToken, validator('BlogSchemas', 'updateBlogSchema'), updateBlog)
router.patch('/:id/archive', verifyToken, archiveBlog)
router.patch('/:id/soft-delete', verifyToken, softDeleteBlog)
router.patch('/:id/publish', verifyToken, publishBlog)
router.patch('/:id/restore', verifyToken, restoreBlog)

//Group Blogs
router.post('/groups/:id', verifyToken, addBlogToGroup)
router.post('/groups/blog/:id', verifyToken, updateBlogInGroup)
router.delete('/groups/blog/:id', verifyToken, deleteBlogInGroup)
router.put('/groups/blog/:id/approve', verifyToken, approveGroupBlog)
router.get('/groups/:id/blogs', verifyToken, getGroupBlogs)
router.get('/groups/:id/user-blogs', verifyToken, getUserGroupBlogs)
router.get('/groups/:groupId/blogs/:blogId', verifyToken, getGroupBlogDetails)
router.patch('/groups/:groupId/blogs/:blogId/archive', verifyToken, archiveGroupBlog)

export default router
