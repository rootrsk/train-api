const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async(req,res,next)=>{
    try {
        const auth_token = req.cookies.auth_token 
        if(!auth_token) throw new Error('Login to continue')
        const { _id } = jwt.verify(auth_token,process.env.JWT_SECRET)
        
        const user = await User.findOne({_id})
        req.user = user
        next()
    } catch (e) {
        res.status(505).json({
            message: 'failed',
            error: e.message
        })
    }
}
module.exports = userAuth