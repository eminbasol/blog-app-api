import { Router } from 'express'
import { login, refreshToken, checkToken, revokeToken, register } from './auth.controller'
import { verifyToken } from '../utils/routeUtils'
import { validator } from '../utils/validator'
const router = Router()

router.post('/login', validator('AuthSchemas', 'loginSchema'), login)
router.post('/register', validator('AuthSchemas', 'signUpSchema'), register)
router.post('/token/refresh', refreshToken)
router.get('/token/check', verifyToken, checkToken)
router.get('/token/revoke', verifyToken, revokeToken)

export default router
