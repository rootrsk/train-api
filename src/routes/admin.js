const express = require('express')
const User = require('../models/user')
const Train = require('../models/train')
const DateTrain = require('../models/date')
const router = new express.Router()
const {trainErrorHandler} = require('../middleware/error')
const Station = require('../models/stations')
const { default: axios } = require('axios')

// Get All user 
router.get('/admin/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.json({
            message: 'success',
            data: users
        })
    } catch (e) {
        res.json({
            message: 'error',
            error: 'Something went wrong.'
        })
    }
})
// // Get All Station List of India
// router.post('/admin/stations',async(req,res)=>{
//     try {
//         const stations = new Station(req.body)
//     } catch (e) {
//         res.json({
//             message:'failed',
//             error: e.message
//         })
//     }
// })
// Get all stations of India
router.post('/stations',async(req,res)=>{
    const response = await axios({
        url: 'https://gist.githubusercontent.com/apsdehal/11393083/raw/8faed8c05737c62fa04286cce21312951652fff4/Railway%2520Stations'
    })
    res.json({
        stations : response.data.data
    })
})
//Create New Train

//Get Trains According To Date By sending Date and Train Id
router.post('/admin/train-by-date',async(req,res)=>{
    console.log(req.body)
    try {
        const trains = await DateTrain.find({date:req.body.date.toString()}).populate('train_id')
        trains.map((train)=>console.log(train.date))
        res.json({
            message:'success',
            data: trains
        })
    } catch (e) {
        res.json({
            message:'failed',
            error:e.message
        })
    }
})

//Get All Trains 
router.get('/admin/trains',async(req,res)=>{
    try {
        const trains = await Train.find({})
        res.send({
            message: 'success',
            data: trains
        })
    } catch (e) {
        res.send({
            message: 'failed',
            error: 'Something went wrong'
        })
    }
})
//Create New Trains
router.post('/admin/trains', async (req, res) => {
    try {
        const train = new Train(req.body)
        await train.save()
        res.send({
            message: 'success',
            data: {
                train
            }
        })
    } catch (e) {
        res.send({
            message: 'failed',
            error: trainErrorHandler(e.message)
        })
    }
})
// Delete train by sending train_id in body
router.delete('/admin/trains',async(req,res)=>{
    try {
        const train = await Train.findByIdAndRemove(req.body.train_id)
        res.send({
            message: 'success',
            data: train
        })
    } catch (e) {
        res.send({
            message: 'failed',
            error: e.message
        })
    }
})


// create train with date by sending train_id and date 
// router.get('/admin/date-train',async(req,res)=>{
//     try {
//         const TrainByDate = await DateTrain.find()
//         res.json({
//             message:'success',
            
//         })
//     } catch (e) {
//         res.send({message:'failed',error:e.message})
//     }
// })
// Create New Train According To Date By sending Date and Train_Id
router.post('/admin/date-train',async(req,res)=>{
    try {
        const train = await Train.findById(req.body.train_id)
        if(!train){
            return res.json({
                message:'failed',
                error: 'No such train found'
            })
        }
        const dateTrain = new DateTrain({
            train_id: train._id,
            date:req.body.date,
            classes: {
                class_ac: Array(train.class_ac),
                class_sleeper: Array(train.class_sleeper),
                class_general: Array(train.class_general)
            }
        })
        await dateTrain.save()
        const trains = await DateTrain.find({date:req.body.date}).populate('train_id')
        res.json({
            message:'success',
            dateTrain,
            trains
        })
    } catch (e) {
        res.json({
            message: 'failed',
            error: e.message
        })
    }
})
//Delete Train Based on Date By Sending Train_Id
router.delete('/admin/date-train',async(req,res)=>{
    try {
        const train = await DateTrain.findByIdAndRemove(req.body.train_id)
        res.json({
            message:'success',
            data: train
        })
    } catch (e) {
        res.json({
            message:'failed',
            error: e.message
        })
    }
})

//Get trains for user reservation
router.get('/user/trains',async(req,res)=>{
    const match = {}
    try {
        if(req.query.date){
            match.date = req.query.date
        }
        const trains = await DateTrain.find(match).populate('train_id')
        
        res.json({
            message:'success',
            data:{
                trains
            }
        })
    } catch (e) {
        res.json({
            message: 'failed',
            error: e.message
        })
    }
})

module.exports = router