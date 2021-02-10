const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const userAuth = require('../middleware/userAuth')
const Reservation = require('../models/reservation')

const {userErrorHandler} = require('../middleware/error')
const DateTrain = require('../models/date')

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
        const user = new User(req.body)
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
            cookies: req.cookies
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
    try {
        const train = await DateTrain.findOne({'_id':req.body.train_id}).populate('train_id')
        if(!train){
            throw new Error('No such train exist')
        }
        req.body.passengers.map((passenger)=>{
            if(train.classes[req.body.class][passenger.seat]){
                throw new Error(`Seat ${passenger.seat} is already reserved`)
            }
            if (passenger.seat > train.classes[req.body.class].length ) {
                throw new Error(`Seat ${passenger.seat} is not avl.`)
            }
            train.classes[req.body.class] [passenger.seat-1] = req.user._id
        })
        // const source = train.train_id.route.find()
        const source = train.train_id.route.filter((station) => station.station_name === 'Gaya')[0]
        const destination = train.train_id.route.filter((station)=> station.station_name === 'Dobhi')[0]
        console.log(destination)
        console.log()
        const distance = source.distace - destination.distace
        console.log(distance)
        const reservation = new Reservation({
            user: req.user._id,
            train:req.body.train_id,
            passengers: req.body.passengers,
            pnr: Date.now(),
            // source: req.body.source,
            // destination: req.body.destination,
            // fair:req.body.fair
        })    
        res.json({
            message:'success',
            data:{
                reservation,
                train
            }
        })
    } catch (e) {
        res.json({
            message:'failed',
            error:e.message
        })
    }
})

module.exports = router