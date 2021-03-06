const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const useragent = require('express-useragent')
const cookieParser = require('cookie-parser')
require("dotenv").config();

const PORT = process.env.PORT | 3000
const userRouter = require('./src/routes/user')
const adminRouter = require('./src/routes/admin')
const app = express()
app.use(express.json())
app.use(useragent.express())
app.use(cookieParser())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next()
})

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=>console.log('connected to database')).catch(()=>console.log('Unable to connect to database.'))

app.use(userRouter)
app.use(adminRouter)

app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`)
})
