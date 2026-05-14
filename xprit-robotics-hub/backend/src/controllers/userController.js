import { User } from '../models/index.js'
import { Op } from 'sequelize'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'xth-secret-key-2026'

// Crear cuenta
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body

    // Validar que no exista
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'Email ya existe' })
    }

    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
    })

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' })

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: user.toPublicJSON(),
      token,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear usuario' })
  }
}

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const isPasswordValid = await user.validatePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' })

    res.json({
      message: 'Login exitoso',
      user: user.toPublicJSON(),
      token,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error en login' })
  }
}

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query

    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    })

    const total = await User.count()

    res.json({
      total,
      limit,
      offset,
      users: users.map(u => u.toPublicJSON()),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
}

// Obtener perfil
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json(user.toPublicJSON())
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener perfil' })
  }
}

// Actualizar perfil
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params
    const { firstName, lastName, bio, location, website, avatar, coverImage } = req.body

    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    await user.update({
      firstName,
      lastName,
      bio,
      location,
      website,
      avatar,
      coverImage,
    })

    res.json({
      message: 'Perfil actualizado',
      user: user.toPublicJSON(),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar perfil' })
  }
}

// Verificar usuario (solo admin)
export const verifyUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    await user.update({ isVerified: true })

    res.json({
      message: 'Usuario verificado',
      user: user.toPublicJSON(),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al verificar usuario' })
  }
}

// Obtener usuarios (búsqueda)
export const searchUsers = async (req, res) => {
  try {
    const { q, limit = 20, offset = 0 } = req.query

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${q}%` } },
          { firstName: { [Op.like]: `%${q}%` } },
          { lastName: { [Op.like]: `%${q}%` } },
        ],
      },
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    res.json({
      total: users.length,
      users: users.map(u => u.toPublicJSON()),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error en búsqueda' })
  }
}
