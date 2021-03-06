const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async(req,res,next)=>{
    try {
        // console.log(req.cookies)
        console.log(req.headers)
        const auth_token = req.headers.authorization
        console.log(auth_token)
        if(!auth_token) throw new Error('Login to continue')
        const { _id } = jwt.verify(auth_token,process.env.JWT_SECRET)
        console.log(_id)
        const user = await User.findOne({_id})
        // console.log(user)
        req.user = user
        next()
    } catch (e) {
        console.log(e)
        res.status(505).json({
            message: 'failed',
            error: e.message
        })
    }
}
module.exports = userAuth