    import User from './User.js'
    import Post from './Post.js'
    import Hashtag from './Hashtag.js'
    import PostHashtag from './PostHashtag.js'
    import Follow from './Follow.js'
    import Like from './Like.js'
    import Comment from './Comment.js'

    // Definir relaciones
    // User - Post
    User.hasMany(Post, { foreignKey: 'userId', as: 'posts', onDelete: 'CASCADE' })
    Post.belongsTo(User, { foreignKey: 'userId', as: 'author' })

    // User - Follow (Usuario que sigue)
    User.hasMany(Follow, { foreignKey: 'followerId', as: 'following', onDelete: 'CASCADE' })
    Follow.belongsTo(User, { foreignKey: 'followerId', as: 'follower' })

    // User - Follow (Usuario que es seguido)
    User.hasMany(Follow, { foreignKey: 'followingId', as: 'followers', onDelete: 'CASCADE' })
    Follow.belongsTo(User, { foreignKey: 'followingId', as: 'followingUser' })

    // User - Like
    User.hasMany(Like, { foreignKey: 'userId', as: 'likes', onDelete: 'CASCADE' })
    Like.belongsTo(User, { foreignKey: 'userId', as: 'user' })

    // Post - Like
    Post.hasMany(Like, { foreignKey: 'postId', as: 'likedBy', onDelete: 'CASCADE' })
    Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' })

    // Post - Comment
    Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments', onDelete: 'CASCADE' })
    Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' })

    // User - Comment
    User.hasMany(Comment, { foreignKey: 'userId', as: 'comments', onDelete: 'CASCADE' })
    Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' })

    // Comment - Comment (respuestas)
    Comment.hasMany(Comment, { foreignKey: 'parentCommentId', as: 'replies', onDelete: 'CASCADE' })
    Comment.belongsTo(Comment, { foreignKey: 'parentCommentId', as: 'parentComment' })

    // Post - Hashtag (muchos a muchos)
    Post.belongsToMany(Hashtag, { through: PostHashtag, foreignKey: 'postId', otherKey: 'hashtagId', as: 'hashtags' })
    Hashtag.belongsToMany(Post, { through: PostHashtag, foreignKey: 'hashtagId', otherKey: 'postId', as: 'posts' })

    // Post - Post (Remakes)
    Post.hasMany(Post, { foreignKey: 'remakeOf', as: 'remakes', onDelete: 'SET NULL' })
    Post.belongsTo(Post, { foreignKey: 'remakeOf', as: 'originalPost' })

    export { User, Post, Hashtag, PostHashtag, Follow, Like, Comment }
