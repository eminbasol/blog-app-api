import { Router } from 'express'
import { getUserById } from './users.controller'
import { verifyToken } from '../utils/routeUtils'

const router = Router()

router.get('/:id', verifyToken, getUserById)

export default router
