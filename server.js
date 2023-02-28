require('dotenv').config()
const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const fileUpload = require('express-fileupload')
const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles : true 
}))


// routes 
app.use('/user' , require('./routes/userRouter'))
app.use('/api' , require('./routes/offerRouter'))
app.use('/contact' , require('./routes/contactRouter'))
// connect to mongodb
const URI = process.env.MONGODB_DB
mongoose.connect(URI, {

    useNewUrlParser : true , 
    useUnifiedTopology : true 
}).then(() => 
{console.log('connected to mongodb')},(error)=>{console.log('not connected to db'+error);});

const PORT = process.env.PORT || 6000
app.listen(PORT , ()=> {
    console.log("server is running on port ", PORT)
})


