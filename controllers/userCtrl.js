const users = require('../models/userModel')
const bcrypt =  require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl ={
register : async (req , res)=>{
  try {
    const {username , email , password} = req.body;
    const user = await  users.findOne({email})
    if(user) 
      return res.status(400).json({msg:'the email already exists.'})
    
    if(password.length < 6 ) 
      return res.status(400).json({msg:'password is at least 6 characters long .'})
    //password encryption
     const passwordHash = await bcrypt.hash(password , 10)
     const newUser=new users ({
        username , email , password :passwordHash 
     })
     await newUser.save()

     // create jsonwebtoken to authentication
     const accesstoken = createAccessToken({id : newUser._id})
     const refreshtoken = createRefreshToken({id : newUser._id})
     res.cookie('refreshtoken' ,  refreshtoken, {
        httpOnly : false , 
        path :'/user/refresh_token',
        maxAge: 7*24*60*60*1000,
       
     })
     res.json({accesstoken})
    
    //  res.json({msg : 'Register Success'})
  } catch (error) {
    return res.status(500).json({msg : error.message})
  }
        
},
login: async (req, res) =>{
    try {
        const {email, password} = req.body;
        console.log(req.body)
        const user = await users.findOne({email})
        console.log(user)

        if(!user) return res.status(400).json({msg: "User does not exist."})

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({msg: "Incorrect password."})
        console.log(isMatch)
        // If login success , create access token and refresh token
        const accesstoken = createAccessToken({id: user._id})
        const refreshtoken = createRefreshToken({id: user._id})

        res.cookie('refreshtoken', refreshtoken, {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 7*24*60*60*1000 // 7d
        })

        res.json({accesstoken})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}, 
logout : async (req, res) => {
    try {
        res.clearCookie('refreshtoken' , {  path :'/user/refresh_token'})
        return res.json({msg :'Logged out'})
        
    } catch (error) {
    return res.status(500).json({msg : error.message})  
    }

},
refreshToken :(req , res) => {
    try {
        const rf_token = req.cookies.refreshtoken;
        if(!rf_token) return res.status(400).json({msg : 'Please Login or Register'})
         
        jwt.verify(rf_token , process.env.REFRESH_TOKEN_SECRET ,(error , user) => {
               
            if(error) return res.status(400).json({msg : 'Login or Register'})
          
            const accessToken = createAccessToken({id : user.id})
         
            res.json({accessToken})
        })


       // res.json({rf_token})
        
    } catch (error) {
        return res.status(500).json({msg : error.message}) 
    }

       
},
getUser : async(req , res) => {
    try {
        const user = await users.findById(req.user.id).select('-password')
         if(!user) return res.status(400).json({msg :"user does not exist."}) 
         res.json(user)
    } catch (error) {
        return res.status(500).json({msg : error.message})   
    }
},
getAllUseres : async(req , res) => {
    try {
        const getAllUseres = await users.find({})
        res.status(200).send({response:getAllUseres}) 
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
},
UpdateUser : async(req,res) =>{
    try {
        const {username , email , password , role} = req.body;
        await users.findOneAndUpdate(({_id : req.params.id},{username , email , password , role}))
        res.json({msg : "updated user"}) 
        
    } catch (error) {
        return res.status(500).json({message : error.message}) 
    }
}
}
const createAccessToken= (user) => {
    return jwt.sign(user , process.env.ACCESS_TOKEN_SECRET , {expiresIn : '11m'})
}
const  createRefreshToken= (user) => {
    return jwt.sign(user , process.env.REFRESH_TOKEN_SECRET , {expiresIn : '7d'})
}


module.exports = userCtrl