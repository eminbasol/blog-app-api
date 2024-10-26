import { Router } from 'express'
import { verifyAdminToken } from '../../utils/routeUtils'
import { approveUser, blockUser, getPendingUsers } from './user.controller'

const router = Router()

router.get('/', verifyAdminToken, getPendingUsers)
router.patch('/:id/approve', verifyAdminToken, approveUser)
router.patch('/:id/block', verifyAdminToken, blockUser)

export default router
