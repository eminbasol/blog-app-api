import { Router } from 'express'
import { verifyToken } from '../utils/routeUtils'
import { createGroup, deleteGroup, getGroupById, getGroups, getUserGroups, updateGroup } from './groups.controller'
import { addMemberToGroup, joinGroup, removeMemberFromGroup, revokeCoAdmin, selectCoAdmin } from './members/members.controller'

const router = Router()

router.get('/', verifyToken, getGroups)
router.get('/user/:id', verifyToken, getUserGroups)
router.get('/:id', verifyToken, getGroupById)
router.post('/', verifyToken, createGroup)
router.put('/:id', verifyToken, updateGroup)
router.delete('/:id', verifyToken, deleteGroup)

// groupMember routes
router.post('/:groupId/members/', verifyToken, joinGroup)
router.post('/:groupId/members/:userId', verifyToken, addMemberToGroup)
router.delete('/:groupId/members/:userId', verifyToken, removeMemberFromGroup)
router.post('/:groupId/co-admin/:userId', verifyToken, selectCoAdmin)
router.delete('/:groupId/co-admin/:userId', verifyToken, revokeCoAdmin)

export default router
