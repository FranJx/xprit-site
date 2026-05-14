import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Follow = sequelize.define('Follow', {
  followerId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  followingId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Users',
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

export default Follow
