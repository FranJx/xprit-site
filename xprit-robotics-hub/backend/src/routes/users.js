import express from 'express'
import * as userController from '../controllers/userController.js'

const router = express.Router()

// Autenticación
router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)

// Búsqueda (debe ir ANTES de /:id)
router.get('/search', userController.searchUsers)

// Listar todos los usuarios
router.get('/', userController.getAllUsers)

// Perfil
router.get('/:id', userController.getUserProfile)
router.put('/:id', userController.updateUserProfile)

// Admin
router.patch('/:id/verify', userController.verifyUser)

export default router
