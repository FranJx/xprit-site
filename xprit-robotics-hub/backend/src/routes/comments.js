import express from 'express'
import * as commentController from '../controllers/commentController.js'

const router = express.Router()

// Comentarios
router.post('/', commentController.createComment)
router.get('/post/:postId', commentController.getPostComments)
router.get('/:commentId', commentController.getCommentById)
router.put('/:commentId', commentController.updateComment)
router.delete('/:commentId', commentController.deleteComment)
router.post('/:commentId/like', commentController.likeComment)
router.get('/user/:userId', commentController.getUserComments)

export default router
