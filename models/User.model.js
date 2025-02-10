const  mongoose  = require("mongoose");

const userSchema = new mongoose.Schema({
    Image:{
        type: String
    },
    name:{
        type: String ,
        require: true
    },
    email :{
        type: String,
        require : true,
        lowercase: true,
        unique: true
    },
    password :{
        type: String ,
        require: [true , "password is required"]
    },
    role : {
        type : Boolean,
        default : false 
    }
} , {timestamps : true}
)

const User = mongoose.model("User",userSchema)
module.exports = {User}