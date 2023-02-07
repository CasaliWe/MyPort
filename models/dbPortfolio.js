const {DataTypes} = require('sequelize')

const db = require('../db/conn')

const User = db.define('Users', {
     nome: {
          type: DataTypes.STRING,
          required: true
     },
     userName: {
        type: DataTypes.STRING,
        required: true
     },
     imgName: {
         type: DataTypes.STRING,
         required: true
     },
     email: {
        type: DataTypes.STRING,
        required: true
     },
     senha: {
        type: DataTypes.STRING,
        required: true
     },
})

module.exports = User