const express = require('express')
const User = require('../models/user')
const Train = require('../models/train')
const DateTrain = require('../models/date')
const router = new express.Router()
const {trainErrorHandler} = require('../middleware/error')
const Station = require('../models/stations')
const { default: axios } = require('axios')


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

router.post('/admin/stations',async(req,res)=>{
    try {
        const stations = new Station(req.body)
    } catch (e) {
        res.json({
            message:'failed',
            error: e.message
        })
    }
})
router.post('/stations',async(req,res)=>{
    const response = await axios({
        url: 'https://gist.githubusercontent.com/apsdehal/11393083/raw/8faed8c05737c62fa04286cce21312951652fff4/Railway%2520Stations'
    })
    res.json({
        stations : response.data.data
    })
})
router.post('/admin/trains', async (req, res) => {
    try {
        const train = new Train(req.body)
        await train.save()
        res.send({
            message: 'success',
            data: {
                train,
                token: Math.random() * 10000000000
            }
        })
    } catch (e) {
        res.send({
            message: 'failed',
            error: trainErrorHandler(e.message)
        })
    }
})

//
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
// delete train by sending train_id in body
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
        res.json({
            message:'success',
            dateTrain
        })
    } catch (e) {
        res.json({
            message: 'failed',
            error: e.message
        })
    }
})
//delete date train by sending train_id
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

//get trains for user reservation
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