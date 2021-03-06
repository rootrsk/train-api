const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const userAuth = require('../middleware/userAuth')
const Reservation = require('../models/reservation')

const {userErrorHandler} = require('../middleware/error')
const DateTrain = require('../models/date')
const Train = require('../models/train')

router.get('/',(req,res)=>{
    res.send({
        message: 'success',
        data: {
            welcome: 'Welcome to Bhushan Train Api',
            headers :req.useragent
        }
    })
})

router.post('/signup',async(req,res)=>{    
    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            contact_no: req.body.contact,
            password: req.body.password
        })
        await user.save()
        const token = user.genAuthToken()
        
        user.tokens = user.tokens.concat({
            token: token,
            browser: req.useragent.browser,
            device: req.useragent.os
        })
        let options = {
            // maxAge: 1000*60*60, // would expire after 30 seconds
            httpOnly: false, // The cookie only accessible by the web server
            signed: false // Indicates if the cookie should be signed
        }
        res.cookie('auth_token', token, options)
        res.send({
            message: 'success',
            data: user,
            token,
            cookies: req.cookies
        })
    } catch (e) {
        console.log(e)
        const error = userErrorHandler(e.message)
        res.send({
            message: 'failed',
            error
        })
    }
})

router.post('/login',async(req,res)=>{

    try {
        console.log(req.headers.authorization)
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = user.genAuthToken()
        user.tokens = user.tokens.concat({
            token: token,
            browser: req.useragent.browser,
            device: req.useragent.os
        })
        
        let options = {
            // maxAge: 1000*60*60, // would expire after 30 seconds
            httpOnly: false, // The cookie only accessible by the web server
            signed: false // Indicates if the cookie should be signed
        }
        res.cookie('auth_token',token,options)
        res.send({
            message:'success',
            data:user,
            token,
        })
    } catch (e) {
        res.send({
            message: 'failed',
            error: e.message
        })
    }
})


router.get('/user/me',userAuth,async(req,res)=>{
    res.json({
        message: 'success',
        data:{
            user: req.user,
            isAutheticated: true
        }
    })
})

router.post('/user/reservation',userAuth,async(req,res)=>{
    // console.log(req.body)
    try {
        const train = await DateTrain.findOne({'_id':req.body.train_id}).populate('train_id')
        if(!train){
            throw new Error('No such train exist')
        }
        req.body.passengers.map((passenger)=>{
            if(train.classes[passenger.class][passenger.seat]){
                throw new Error(`Seat ${passenger.seat} is already reserved`)
            }
            if (passenger.seat > train.classes[passenger.class].length ) {
                throw new Error(`Seat ${passenger.seat} is not avl.`)
            }
            train.classes[passenger.class] [passenger.seat-1] = req.user._id
        })
        // const source = train.train_id.route.find()
        const source = train.train_id.route.filter((station) => station.station_name === req.body.start_station)[0]
        const destination = train.train_id.route.filter((station)=> station.station_name === req.body.end_station)[0]
        console.log(destination)
        console.log(source)
        const distacnce = destination.distance - source.distance
        const reservation = new Reservation({
            user: req.user._id,
            train:req.body.train_id,
            passengers: req.body.passengers,
            pnr: Date.now(),
            source: source.station_name,
            destination: destination.station_name,
            fair: distacnce * 2
        })    
        res.status(200).json({
            message:'success',
            reservation,
            train
        })
    } catch (e) {
        console.log(e)
        res.json({
            message:'failed',
            error:e.message
        })
    }
})
router.post('/user/train-by-date', async (req, res) => {
    console.log(req.body)
    try {
        let match = { }
        if(req.body.date) {
            match['date'] = new Date(req.body.date)
        }
        if (req.body.filterStation[0] || req.body.filterStation[1]) {
            match['train.route.station_name'] = {$in: req.body.filterStation}
        }
        if(req.body.filterStation[0] && req.body.filterStation[1]){
            match['train.route.station_name'] = {$all : req.body.filterStation}
        }
        const trains = await DateTrain.aggregate([
            {$lookup: {
                from: 'trains',
                localField: "train_id",
                foreignField: "_id",
                as: "train"
            }
            },{
                $unwind: '$train'
            },{
                $match:match
            }
        ])
        trains.map((train) => console.log(train.date))
        res.json({
            message: 'success',
            data: trains
        })
    } catch (e) {
        res.json({
            message: 'failed',
            error: e.message
        })
    }
})

router.post('/train',async(req,res)=>{
    try {
        console.log(req.body.id)
        const train = await DateTrain.findById(req.body.id).populate('train_id')
        if(!train) throw new Error('No such Train Found.')
        res.json({
            message: 'success',
            train
        })

    } catch (e) {
        res.json({
            message: 'failed',
            error: e.message
        })
    }
})
module.exports = router