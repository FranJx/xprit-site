import express from 'express'
import * as followController from '../controllers/followController.js'

const router = express.Router()

// Seguimiento
router.post('/follow', followController.followUser)
router.post('/unfollow', followController.unfollowUser)
router.get('/followers/:userId', followController.getFollowers)
router.get('/following/:userId', followController.getFollowing)
router.get('/check', followController.isFollowing)

export default router
