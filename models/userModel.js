const mongoose = require("mongoose")

const userShema = new mongoose.Schema ({
 username : {
   type:String,
   required: true ,
   trim:true  
 },
 email : {
    type:String,
    required: true,
    unique:true  
  },
  password : {
    type:String,
    required: true  
  },
  role : {
    type :Number,
    default: 0 
  }


},{
  timestamps : true
})
module.exports = mongoose.model('users' , userShema)