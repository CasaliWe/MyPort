const {DataTypes} = require('sequelize')

const db = require('../db/conn')

const dbPortfolio = require('./dbPortfolio')


const Info = db.define('info', {
           
       trabalho:{
           type: DataTypes.STRING,
           required: true
        },
        cidade:{
            type: DataTypes.STRING,
            required: true
        },
        instagram:{
           type: DataTypes.STRING,
           required: true
        },
        linkedin:{
           type: DataTypes.STRING,
           required: true
        },
        whatsapp:{
            type: DataTypes.STRING,
            required: true
        },
        bio:{
            type: DataTypes.STRING,
            required: true
        },
        email:{
            type: DataTypes.STRING,
            required: true
        },
        link:{
            type: DataTypes.STRING,
            required: true
        }, 
        projetos:{
            type: DataTypes.STRING,
            required: true
        },
        views:{
            type: DataTypes.STRING,
            required: true
        },
     
})


dbPortfolio.hasMany(Info)
Info.belongsTo(dbPortfolio)

module.exports = Info