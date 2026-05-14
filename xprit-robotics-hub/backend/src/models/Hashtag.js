import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Hashtag = sequelize.define('Hashtag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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

export default Hashtag
