import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const PostHashtag = sequelize.define('PostHashtag', {
  postId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Posts',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  hashtagId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Hashtags',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: false,
})

export default PostHashtag
