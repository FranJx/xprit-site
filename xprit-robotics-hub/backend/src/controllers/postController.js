import { Post, User, Hashtag, PostHashtag, Comment } from '../models/index.js'
import { Op } from 'sequelize'

// Crear post
export const createPost = async (req, res) => {
  try {
    const { userId } = req.params
    const { title, description, image, images = [], type = 'proyecto', remakeOf, hashtags = [] } = req.body

    // Si la imagen viene como base64, limitar su tamaño antes de guardar
    let processedImage = image
    if (image && image.startsWith('data:image/')) {
      // Estimar tamaño: base64 es ~37% más grande que binario
      const sizeInBytes = Math.floor(image.length * 0.75)
      const maxBytes = 5 * 1024 * 1024 // 5MB
      if (sizeInBytes > maxBytes) {
        return res.status(400).json({ error: 'La imagen es demasiado grande. Máximo 5MB.' })
      }
    }

    // Validar que el usuario exista
    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // Crear post
    const post = await Post.create({
      userId,
      title,
      description,
      image,
      images,
      type,
      remakeOf: remakeOf || null,
    })

    // Procesar hashtags
    if (hashtags.length > 0) {
      for (const hashtagName of hashtags) {
        let hashtag = await Hashtag.findOne({ where: { name: hashtagName } })

        if (!hashtag) {
          hashtag = await Hashtag.create({ name: hashtagName })
        } else {
          hashtag.increment('usageCount')
        }

        await PostHashtag.create({
          postId: post.id,
          hashtagId: hashtag.id,
        })
      }
    }

    // Actualizar contador de posts del usuario
    user.increment('postCount')

    // Obtener post con relaciones
    const fullPost = await Post.findByPk(post.id, {
      include: [
        { model: User, as: 'author', attributes: { exclude: ['password'] } },
        { model: Hashtag, as: 'hashtags', through: { attributes: [] } },
      ],
    })

    res.status(201).json({
      message: 'Post creado exitosamente',
      post: fullPost,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear post' })
  }
}

// Obtener posts (feed)
export const getPosts = async (req, res) => {
  try {
    const { limit = 20, offset = 0, type, hashtag, userId } = req.query

    let where = {}
    if (type) {
      where.type = type
    }
    if (userId) {
      where.userId = parseInt(userId)
    }

    let includeOptions = [
      {
        model: User,
        as: 'author',
        attributes: { exclude: ['password'] },
      },
      {
        model: Hashtag,
        as: 'hashtags',
        through: { attributes: [] },
      },
    ]

    // Si busca por hashtag
    if (hashtag) {
      includeOptions[1] = {
        model: Hashtag,
        as: 'hashtags',
        where: { name: hashtag },
        through: { attributes: [] },
        required: true,
      }
    }

    const posts = await Post.findAll({
      where,
      include: includeOptions,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    const total = await Post.count({ where })

    res.json({
      total,
      limit,
      offset,
      posts,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener posts' })
  }
}

// Buscar posts
export const searchPosts = async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.json({ posts: [] })
    }

    const posts = await Post.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
        ],
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: { exclude: ['password'] },
        },
        {
          model: Hashtag,
          as: 'hashtags',
          through: { attributes: [] },
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 20,
    })

    res.json({ posts })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error en búsqueda' })
  }
}

// Obtener posts de un usuario
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const { limit = 20, offset = 0 } = req.query

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const posts = await Post.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: { exclude: ['password'] },
        },
        {
          model: Hashtag,
          as: 'hashtags',
          through: { attributes: [] },
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    const total = await Post.count({ where: { userId } })

    res.json({
      total,
      limit,
      offset,
      posts,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener posts del usuario' })
  }
}

// Obtener post por ID
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params

    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: { exclude: ['password'] },
        },
        {
          model: Hashtag,
          as: 'hashtags',
          through: { attributes: [] },
        },
      ],
    })

    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' })
    }

    res.json(post)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener post' })
  }
}

// Actualizar post
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params
    const { title, description, image, images, type, hashtags = [] } = req.body

    const post = await Post.findByPk(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' })
    }

    await post.update({
      title,
      description,
      image,
      images,
      type,
    })

    // Actualizar hashtags
    await PostHashtag.destroy({ where: { postId } })

    if (hashtags.length > 0) {
      for (const hashtagName of hashtags) {
        let hashtag = await Hashtag.findOne({ where: { name: hashtagName } })

        if (!hashtag) {
          hashtag = await Hashtag.create({ name: hashtagName })
        }

        await PostHashtag.create({
          postId: post.id,
          hashtagId: hashtag.id,
        })
      }
    }

    const fullPost = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: { exclude: ['password'] },
        },
        {
          model: Hashtag,
          as: 'hashtags',
          through: { attributes: [] },
        },
      ],
    })

    res.json({
      message: 'Post actualizado',
      post: fullPost,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar post' })
  }
}

// Eliminar post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params

    const post = await Post.findByPk(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' })
    }

    const user = await User.findByPk(post.userId)
    if (user) {
      user.decrement('postCount')
    }

    await post.destroy()

    res.json({ message: 'Post eliminado' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar post' })
  }
}

// Buscar posts por hashtag
export const searchByHashtag = async (req, res) => {
  try {
    const { hashtag } = req.params
    const { limit = 20, offset = 0 } = req.query

    const posts = await Post.findAll({
      include: [
        {
          model: Hashtag,
          as: 'hashtags',
          where: { name: hashtag },
          through: { attributes: [] },
          required: true,
        },
        {
          model: User,
          as: 'author',
          attributes: { exclude: ['password'] },
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    const total = await Post.count({
      include: {
        model: Hashtag,
        as: 'hashtags',
        where: { name: hashtag },
        through: { attributes: [] },
        required: true,
      },
    })

    res.json({
      hashtag,
      total,
      limit,
      offset,
      posts,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error en búsqueda de hashtag' })
  }
}
