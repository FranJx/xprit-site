import { User, Follow } from '../models/index.js'
import { Op } from 'sequelize'

// Seguir usuario
export const followUser = async (req, res) => {
  try {
    const { followerId, followingId } = req.body

    // Validar que no sea auto-seguimiento
    if (followerId === followingId) {
      return res.status(400).json({ error: 'No puedes seguirte a ti mismo' })
    }

    // Validar que ambos usuarios existan
    const follower = await User.findByPk(followerId)
    const following = await User.findByPk(followingId)

    if (!follower || !following) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // Verificar si ya sigue
    const existingFollow = await Follow.findOne({
      where: { followerId, followingId },
    })

    if (existingFollow) {
      return res.status(400).json({ error: 'Ya estás siguiendo a este usuario' })
    }

    // Crear relación
    await Follow.create({ followerId, followingId })

    // Actualizar contadores
    follower.increment('followingCount')
    following.increment('followerCount')

    res.status(201).json({
      message: 'Ahora estás siguiendo al usuario',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al seguir usuario' })
  }
}

// Dejar de seguir
export const unfollowUser = async (req, res) => {
  try {
    const { followerId, followingId } = req.body

    const follow = await Follow.findOne({
      where: { followerId, followingId },
    })

    if (!follow) {
      return res.status(404).json({ error: 'No estás siguiendo a este usuario' })
    }

    await follow.destroy()

    // Actualizar contadores
    const follower = await User.findByPk(followerId)
    const following = await User.findByPk(followingId)

    if (follower) follower.decrement('followingCount')
    if (following) following.decrement('followerCount')

    res.json({ message: 'Ya no estás siguiendo al usuario' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al dejar de seguir' })
  }
}

// Obtener seguidores
export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params
    const { limit = 20, offset = 0 } = req.query

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const followers = await Follow.findAll({
      where: { followingId: userId },
      include: [
        {
          model: User,
          as: 'follower',
          attributes: { exclude: ['password'] },
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    const total = await Follow.count({ where: { followingId: userId } })

    const followerUsers = followers.map(f => ({
      ...f.follower.toPublicJSON(),
      followedAt: f.createdAt,
    }))

    res.json({
      userId,
      total,
      limit,
      offset,
      followers: followerUsers,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener seguidores' })
  }
}

// Obtener usuarios que sigue
export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params
    const { limit = 20, offset = 0 } = req.query

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const following = await Follow.findAll({
      where: { followerId: userId },
      include: [
        {
          model: User,
          as: 'followingUser',
          attributes: { exclude: ['password'] },
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    const total = await Follow.count({ where: { followerId: userId } })

    const followingUsers = following.map(f => ({
      ...f.followingUser.toPublicJSON(),
      followedAt: f.createdAt,
    }))

    res.json({
      userId,
      total,
      limit,
      offset,
      following: followingUsers,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener seguidos' })
  }
}

// Verificar si un usuario sigue a otro
export const isFollowing = async (req, res) => {
  try {
    const { followerId, followingId } = req.query

    const follow = await Follow.findOne({
      where: { followerId, followingId },
    })

    res.json({
      followerId,
      followingId,
      isFollowing: !!follow,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al verificar seguimiento' })
  }
}
