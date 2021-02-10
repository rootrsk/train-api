const mongoose = require('mongoose')


const reservationSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    train:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'DateTrain',
        required: true
    },
    source: String,
    destination:String,
    fair: Number,
    payment: String,
    class: String,
    pnr: Number,
    passengers:[{
        _id : false,
        name:{
            type:String,
            required: true
        },
        age:{
            type: Number,
            required : true
        },
        seat:{
            type: Number
        }
    }],
},{timestamps: true})

const Reservation = mongoose.model('Reservation',reservationSchema)

module.exports = Reservation