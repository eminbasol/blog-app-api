import { Router } from 'express'
import authRouter from './auth/router'
import userRouter from './user/router'

const adminRouter = Router()

// Define the base path for admin routes
adminRouter.use('/auth', authRouter)
adminRouter.use('/user', userRouter)

export default adminRouter
