import { Comment, User, Post } from '../models/index.js'

// Crear comentario
export const createComment = async (req, res) => {
  try {
    const { userId, postId, content, parentCommentId } = req.body

    // Validar que el usuario exista
    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // Validar que el post exista
    const post = await Post.findByPk(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' })
    }

    // Si es una respuesta, validar que el comentario padre exista
    if (parentCommentId) {
      const parentComment = await Comment.findByPk(parentCommentId)
      if (!parentComment) {
        return res.status(404).json({ error: 'Comentario padre no encontrado' })
      }
    }

    // Crear comentario
    const comment = await Comment.create({
      userId,
      postId,
      content,
      parentCommentId: parentCommentId || null,
    })

    // Actualizar contador de comentarios del post
    post.increment('commentCount')

    // Obtener comentario con relaciones
    const fullComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: { exclude: ['password'] },
        },
      ],
    })

    res.status(201).json({
      message: 'Comentario creado',
      comment: fullComment,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear comentario' })
  }
}

// Obtener comentarios de un post
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params
    const { limit = 20, offset = 0, parentOnly = true } = req.query

    const post = await Post.findByPk(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' })
    }

    const where = {
      postId,
      ...(parentOnly && { parentCommentId: null }),
    }

    const comments = await Comment.findAll({
      where,
      include: [
        {
          model: User,
          as: 'author',
          attributes: { exclude: ['password'] },
        },
        {
          model: Comment,
          as: 'replies',
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

    const total = await Comment.count({ where })

    res.json({
      postId,
      total,
      limit,
      offset,
      comments,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener comentarios' })
  }
}

// Obtener un comentario por ID
export const getCommentById = async (req, res) => {
  try {
    const { commentId } = req.params

    const comment = await Comment.findByPk(commentId, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: { exclude: ['password'] },
        },
        {
          model: Comment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'author',
              attributes: { exclude: ['password'] },
            },
          ],
        },
      ],
    })

    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' })
    }

    res.json(comment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener comentario' })
  }
}

// Actualizar comentario
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const { content } = req.body

    const comment = await Comment.findByPk(commentId)
    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' })
    }

    await comment.update({ content })

    const fullComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: { exclude: ['password'] },
        },
      ],
    })

    res.json({
      message: 'Comentario actualizado',
      comment: fullComment,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar comentario' })
  }
}

// Eliminar comentario
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params

    const comment = await Comment.findByPk(commentId)
    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' })
    }

    // Actualizar contador del post
    const post = await Post.findByPk(comment.postId)
    if (post) {
      post.decrement('commentCount')
    }

    await comment.destroy()

    res.json({ message: 'Comentario eliminado' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar comentario' })
  }
}

// Like a un comentario
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params

    const comment = await Comment.findByPk(commentId)
    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' })
    }

    comment.increment('likeCount')

    res.json({
      message: 'Like agregado al comentario',
      comment,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al agregar like' })
  }
}

// Obtener comentarios de un usuario
export const getUserComments = async (req, res) => {
  try {
    const { userId } = req.params
    const { limit = 20, offset = 0 } = req.query

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const comments = await Comment.findAll({
      where: { userId },
      include: [
        {
          model: Post,
          as: 'post',
          attributes: ['id', 'title'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    const total = await Comment.count({ where: { userId } })

    res.json({
      userId,
      total,
      limit,
      offset,
      comments,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener comentarios' })
  }
}
