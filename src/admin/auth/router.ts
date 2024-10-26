import { Router } from 'express'
import { login, register } from './auth.controller'
import { verifyAdminToken } from '../../utils/routeUtils'

const router = Router()

router.post('/login', login)
router.post('/register', verifyAdminToken, register)

export default router
