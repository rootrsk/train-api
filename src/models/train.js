const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const trainSchema = new mongoose.Schema({
    train_id:{
        type: Number,
        required: true,
        unique: true
    },
    train_name: {
        type: String,
        required: true
    },
    train_no: {
        type: String,
        required: true
    },
    class_ac:{
        type: Number,
        default:10
    },
    class_sleeper:{
        type: Number,
        default: 10
    },
    class_general:{
        type: Number,
        default: 10
    },
    route:[{
        _id:false,
        station_name:{
            type:String,
            required: true,
            trim:true,
            lowercase: true
            
        },
        station_code: {
            type: String,
        },
        arriving_time:{
            type: String,
            required: true
        },
        departure_time:{
            type: String,
            required: true
        },
        day:{
            type: Number,
            default: 0,
        },
        distance:{
            type: Number
        }
        
    }],
   
}, {
    timestamps: true
})

const Train = mongoose.model('Train', trainSchema)

module.exports = Train