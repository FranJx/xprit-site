import express from 'express'
import * as postController from '../controllers/postController.js'

const router = express.Router()

// Búsqueda (debe estar ANTES de rutas con :postId para evitar conflictos)
router.get('/search', postController.searchPosts)
router.get('/hashtag/:hashtag', postController.searchByHashtag)

// Posts
router.get('/', postController.getPosts)
router.post('/:userId', postController.createPost)
router.get('/user/:userId', postController.getUserPosts)
router.get('/:postId', postController.getPostById)
router.put('/:postId', postController.updatePost)
router.delete('/:postId', postController.deletePost)

export default router
