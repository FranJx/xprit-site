import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.STRING, // URL de la imagen principal
  },
  images: {
    type: DataTypes.JSON, // Array de URLs adicionales
    defaultValue: [],
  },
  type: {
    type: DataTypes.ENUM('proyecto', 'remake', 'tip', 'tutorial', 'noticia', 'avance'),
    defaultValue: 'proyecto',
  },
  remakeOf: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Posts',
      key: 'id',
    },
    allowNull: true,
  },
  parentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Posts',
      key: 'id',
    },
    allowNull: true,
  },
  threadOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  likeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  commentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  shareCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  visibility: {
    type: DataTypes.ENUM('public', 'private', 'followers'),
    defaultValue: 'public',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
})

export default Post
