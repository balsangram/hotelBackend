const mongoose =  require( "mongoose")

const hotelSchema = new mongoose.Schema({
    image : {
        type: String
    },
    name : {
        type : String ,
        require : true ,
        unique: true ,
    },
    location : {
        type : String ,
        require : true
    },
    roomAvailable : {
        type : Number,
        minimum : 0 
    },
    price: {
        type : Number ,
        minimum : 0
    }
}, {timestamps : true}
)

 const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = {Hotel}