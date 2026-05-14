import sequelize from './src/config/database.js'
import { User, Post, Hashtag, PostHashtag, Follow, Like, Comment } from './src/models/index.js'

async function seedDatabase() {
  try {
    // Sincronizar base de datos
    await sequelize.sync({ force: true })
    console.log('✅ Base de datos sincronizada')

    // Crear usuarios de prueba
    const users = await User.bulkCreate([
      {
        username: 'lenak',
        email: 'lena@example.com',
        password: 'password123',
        firstName: 'Lena',
        lastName: 'Kovač',
        bio: 'Ingeniera robótica de Eslovenia. Creadora de proyectos de código abierto.',
        location: 'Ljubljana, Eslovenia',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lena',
      },
      {
        username: 'matias_rios',
        email: 'matias@example.com',
        password: 'password123',
        firstName: 'Matías',
        lastName: 'Ríos',
        bio: 'Maker y entusiasta de la robótica. Buenos Aires, Argentina 🤖',
        location: 'Buenos Aires, Argentina',
        isVerified: false,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Matias',
      },
      {
        username: 'carlos_tech',
        email: 'carlos@example.com',
        password: 'password123',
        firstName: 'Carlos',
        lastName: 'Morales',
        bio: 'Desarrollador de firmware para drones autónomos',
        location: 'CDMX, México',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      },
      {
        username: 'sofia_hernandez',
        email: 'sofia@example.com',
        password: 'password123',
        firstName: 'Sofía',
        lastName: 'Hernández',
        bio: 'Estudiante de Ingeniería Robótica. Interesada en IA y visión computacional',
        location: 'Madrid, España',
        isVerified: false,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
      },
    ], { individualHooks: true })

    console.log(`✅ ${users.length} usuarios creados`)

    // Crear hashtags
    const hashtags = await Hashtag.bulkCreate([
      { name: 'ROS2' },
      { name: 'OpenCV' },
      { name: 'Impresión3D' },
      { name: 'Python' },
      { name: 'Servos' },
      { name: 'Arduino' },
      { name: 'Remake' },
      { name: 'CodigoAbierto' },
      { name: 'Drones' },
      { name: 'VisionComputacional' },
    ])

    console.log(`✅ ${hashtags.length} hashtags creados`)

    // Crear posts
    const posts = await Post.bulkCreate([
      {
        userId: users[0].id,
        title: 'Brazo robótico de 6 DOF con ROS2',
        description: 'Control por visión computacional con OpenCV y Raspberry Pi 4. Repositorio abierto + archivos STL incluidos. Este proyecto combina hardware custom con software de código abierto para lograr un brazo completamente autónomo.',
        image: 'https://images.unsplash.com/photo-1561557404-fc0cdc007a11?w=500&h=500&fit=crop',
        type: 'proyecto',
        visibility: 'public',
      },
      {
        userId: users[1].id,
        title: 'Mi versión del brazo con servos MG996R',
        description: 'Adapté el diseño original para servos económicos. ¡Me quedó increíble! Tiempo de build: 3 semanas. Es una versión simplificada pero funcional del brazo original.',
        image: 'https://images.unsplash.com/photo-1605906676811-e8f2e3b0f612?w=500&h=500&fit=crop',
        type: 'remake',
        remakeOf: 1,
        visibility: 'public',
      },
      {
        userId: users[2].id,
        title: 'Sistema de navegación autónoma para drones',
        description: 'Implementé un sistema de GPS + INS fusion usando un Raspberry Pi 4 y sensores IMU. Código disponible en GitHub.',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
        type: 'proyecto',
        visibility: 'public',
      },
      {
        userId: users[3].id,
        title: 'Tutorial: Cómo comenzar con ROS2 en Raspberry Pi',
        description: 'Una guía paso a paso para configurar ROS2 en una Raspberry Pi 4. Incluye instalación, configuración de red y primeros pasos con el simulador Gazebo.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop',
        type: 'tutorial',
        visibility: 'public',
      },
      {
        userId: users[0].id,
        title: 'Detección de objetos en tiempo real con YOLO',
        description: 'Implementación de YOLOv8 en una Jetson Nano para detectar piezas de robótica en una línea de ensamblaje. Precisión del 96%.',
        image: 'https://images.unsplash.com/photo-1620712014215-c78beae545bb?w=500&h=500&fit=crop',
        type: 'proyecto',
        visibility: 'public',
      },
    ])

    console.log(`✅ ${posts.length} posts creados`)

    // Asociar posts con hashtags
    await PostHashtag.create({ postId: posts[0].id, hashtagId: hashtags[0].id }) // ROS2
    await PostHashtag.create({ postId: posts[0].id, hashtagId: hashtags[1].id }) // OpenCV
    await PostHashtag.create({ postId: posts[0].id, hashtagId: hashtags[2].id }) // Impresión3D
    await PostHashtag.create({ postId: posts[0].id, hashtagId: hashtags[3].id }) // Python

    await PostHashtag.create({ postId: posts[1].id, hashtagId: hashtags[4].id }) // Servos
    await PostHashtag.create({ postId: posts[1].id, hashtagId: hashtags[5].id }) // Arduino
    await PostHashtag.create({ postId: posts[1].id, hashtagId: hashtags[6].id }) // Remake

    await PostHashtag.create({ postId: posts[2].id, hashtagId: hashtags[8].id }) // Drones
    await PostHashtag.create({ postId: posts[2].id, hashtagId: hashtags[0].id }) // ROS2

    console.log('✅ Hashtags asociados a posts')

    // Crear relaciones de seguimiento
    await Follow.create({ followerId: users[1].id, followingId: users[0].id })
    await Follow.create({ followerId: users[2].id, followingId: users[0].id })
    await Follow.create({ followerId: users[3].id, followingId: users[0].id })
    await Follow.create({ followerId: users[0].id, followingId: users[2].id })
    await Follow.create({ followerId: users[1].id, followingId: users[2].id })

    console.log('✅ Relaciones de seguimiento creadas')

    // Crear likes
    await Like.create({ userId: users[1].id, postId: posts[0].id })
    await Like.create({ userId: users[2].id, postId: posts[0].id })
    await Like.create({ userId: users[3].id, postId: posts[0].id })
    await Like.create({ userId: users[0].id, postId: posts[2].id })
    await Like.create({ userId: users[1].id, postId: posts[2].id })

    console.log('✅ Likes creados')

    // Crear comentarios
    await Comment.create({
      userId: users[1].id,
      postId: posts[0].id,
      content: '¡Increíble proyecto! Estoy intentando reproducirlo en mi garage.',
    })

    await Comment.create({
      userId: users[2].id,
      postId: posts[0].id,
      content: 'La integración con OpenCV es muy buena. ¿Qué sensores usas?',
    })

    console.log('✅ Comentarios creados')

    // Actualizar contadores
    for (const user of users) {
      const postCount = await Post.count({ where: { userId: user.id } })
      const followerCount = await Follow.count({ where: { followingId: user.id } })
      const followingCount = await Follow.count({ where: { followerId: user.id } })
      
      await user.update({
        postCount,
        followerCount,
        followingCount,
      })
    }

    for (const post of posts) {
      const likeCount = await Like.count({ where: { postId: post.id } })
      const commentCount = await Comment.count({ where: { postId: post.id } })
      
      await post.update({
        likeCount,
        commentCount,
      })
    }

    console.log('✅ Contadores actualizados')
    console.log('\n🎉 ¡Base de datos poblada exitosamente!')
    console.log(`\nDatos de prueba:`)
    console.log(`- ${users.length} usuarios`)
    console.log(`- ${posts.length} posts`)
    console.log(`- ${hashtags.length} hashtags`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error)
    process.exit(1)
  }
}

seedDatabase()
