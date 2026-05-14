import express from 'express'
import * as likeController from '../controllers/likeController.js'

const router = express.Router()

// Likes
router.post('/like', likeController.likePost)
router.post('/unlike', likeController.unlikePost)
router.get('/post/:postId', likeController.getPostLikes)
router.get('/check', likeController.hasUserLiked)
router.get('/user/:userId', likeController.getUserLikedPosts)

export default router
