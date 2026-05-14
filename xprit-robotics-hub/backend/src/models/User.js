import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import bcrypt from 'bcrypt'

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    validate: {
      len: [3, 50],
    },
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING(50),
  },
  lastName: {
    type: DataTypes.STRING(50),
  },
  bio: {
    type: DataTypes.TEXT,
  },
  avatar: {
    type: DataTypes.STRING, // URL de la imagen
  },
  coverImage: {
    type: DataTypes.STRING, // URL de portada
  },
  location: {
    type: DataTypes.STRING(100),
  },
  website: {
    type: DataTypes.STRING,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  followerCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  followingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  postCount: {
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
}, {
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(user.password, salt)
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
      }
    },
  },
})

// Método para verificar contraseña
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

// Método para obtener perfil público
User.prototype.toPublicJSON = function() {
  return {
    id: this.id,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    bio: this.bio,
    avatar: this.avatar,
    coverImage: this.coverImage,
    location: this.location,
    website: this.website,
    isVerified: this.isVerified,
    followerCount: this.followerCount,
    followingCount: this.followingCount,
    postCount: this.postCount,
    createdAt: this.createdAt,
  }
}

export default User
