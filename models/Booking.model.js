const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
hotelId :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Hotel"
} ,
userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
},
date : {
    type : Date ,
    require : true
}
} , {timestamps : true}
)

const Booking = mongoose.model("Booking", bookingSchema);
module.exports =  {Booking};