const mongoose = require('mongoose')

const stationSchema = new mongoose.Schema({
    stations:[{
        name:{
            type: String,
        },
        code:{
            type: String
        }
    }]
})

const Station = mongoose.model('Station',stationSchema)

module.exports = Station