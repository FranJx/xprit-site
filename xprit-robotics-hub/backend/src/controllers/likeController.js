import { Like, Post, User } from '../models/index.js'

// Dar like a un post
export const likePost = async (req, res) => {
  try {
    const { userId, postId } = req.body

    // Validar que el post exista
    const post = await Post.findByPk(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' })
    }

    // Validar que el usuario exista
    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // Verificar si ya dio like
    const existingLike = await Like.findOne({
      where: { userId, postId },
    })

    if (existingLike) {
      return res.status(400).json({ error: 'Ya has dado like a este post' })
    }

    // Crear like
    await Like.create({ userId, postId })

    // Actualizar contador
    post.increment('likeCount')

    res.status(201).json({
      message: 'Like agregado',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al agregar like' })
  }
}

// Eliminar like
export const unlikePost = async (req, res) => {
  try {
    const { userId, postId } = req.body

    const like = await Like.findOne({
      where: { userId, postId },
    })

    if (!like) {
      return res.status(404).json({ error: 'No has dado like a este post' })
    }

    await like.destroy()

    // Actualizar contador
    const post = await Post.findByPk(postId)
    if (post) {
      post.decrement('likeCount')
    }

    res.json({ message: 'Like removido' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al remover like' })
  }
}

// Obtener likes de un post
export const getPostLikes = async (req, res) => {
  try {
    const { postId } = req.params
    const { limit = 20, offset = 0 } = req.query

    const post = await Post.findByPk(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' })
    }

    const likes = await Like.findAll({
      where: { postId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    const total = await Like.count({ where: { postId } })

    const userLikes = likes.map(like => ({
      ...like.user.toPublicJSON(),
      likedAt: like.createdAt,
    }))

    res.json({
      postId,
      total,
      limit,
      offset,
      users: userLikes,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener likes' })
  }
}

// Verificar si un usuario ha dado like
export const hasUserLiked = async (req, res) => {
  try {
    const { userId, postId } = req.query

    const like = await Like.findOne({
      where: { userId, postId },
    })

    res.json({
      userId,
      postId,
      hasLiked: !!like,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al verificar like' })
  }
}

// Obtener posts que un usuario ha dado like
export const getUserLikedPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const { limit = 20, offset = 0 } = req.query

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const likes = await Like.findAll({
      where: { userId },
      include: [
        {
          model: Post,
          as: 'post',
          include: [
            {
              model: User,
              as: 'author',
              attributes: { exclude: ['password'] },
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    const total = await Like.count({ where: { userId } })

    const posts = likes.map(like => ({
      ...like.post.toJSON(),
      likedAt: like.createdAt,
    }))

    res.json({
      userId,
      total,
      limit,
      offset,
      posts,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener posts guardados' })
  }
}
