import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Like = sequelize.define('Like', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  postId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Posts',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  updatedAt: false,
})

export default Like
