import { Router } from 'express'
import authRouter from './auth/router'
import usersRouter from './users/router'
import blogsRouter from './blogs/router'
import groupsRouter from './groups/router'

const router = Router()

// Define the base path for client routes
router.use('/auth', authRouter)
router.use('/users', usersRouter)
router.use('/blogs', blogsRouter)
router.use('/groups', groupsRouter)

export default router
