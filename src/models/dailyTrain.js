const mongoose = require('mongoose')


const trainSchema = new mongoose.Schema({
    date:{
        type: Date,
        required: true
    },
    train_id: {
        type: mongoose.Schema.Types.ObjectId, //Id of train reffered to Train model
        ref: 'Train',
        required: true
    },
    late: {
        type: Number, // in minutes
        default: null
    },
    classes: {
        class_ac: [],
        class_sleeper: [],
        class_general: []
    }
    
})