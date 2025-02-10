const { Hotel } = require("../models/Hotel.model");
const jwt = require("jsonwebtoken");
const privateKey = "ghkdfdkkhdkddkdk";

const addhotel = async (req, res) => {
  try {
    console.log(req.body);
    const { name, location, roomAvailable, price, token } = req.body;

    const hotelExist = await Hotel.findOne({ name: name });
    if (hotelExist) {https://meet.google.com/prs-jede-sog
      return res.status(400).json({ message: "Hotel already exist" });
    }

    if (!name || !location || !roomAvailable || !price || !token) {
      return res.status(400).json({ message: "All fields are required" });
    }

    jwt.verify(token, privateKey, async function(err, decoded) {
      console.log(decoded, "foo"); // bar
      if (!decoded) {
        return res.status(401).json({ message: "unAuthorized" });
      }
      const hotel = new Hotel({ name, location, roomAvailable, price });
      hotel.save();
      res
        .status(200)
        .json({ message: "Hotel added successfully", data: req.body });
     
        
    });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message.error);
  }
};
const displayhotel = async (req, res) => {
  try {
    console.log(req.body);
    const { token } = req.params;

    jwt.verify(token, privateKey, async function(err, decoded) {
      console.log(decoded, "foo"); // bar
      if (!decoded) {
        return res.status(401).json({ message: "unAuthorized" });
      }
      const hotels = await Hotel.find();
      res.status(200).json({ data: hotels });
    });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message.error);
  }
};
const updatehotel = async (req, res) => {
  try {
    console.log("update");
    const { token } = req.params;
    const hotelId = req.params.id;
    const { name, location, roomAvailable, price } = req.body;
    jwt.verify(token, privateKey, async function(err, decoded) {
      console.log(decoded, "foo"); // bar
      if (!decoded) {
        return res.status(401).json({ message: "unAuthorized" });
      }
      const hotel = await Hotel.findById(hotelId);

      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }

      if (name) hotel.name = name;
      if (location) hotel.location = location;
      if (roomAvailable) hotel.roomAvailable = roomAvailable;
      if (price) hotel.price = price;

      hotel.save();
      res
        .status(200)
        .json({ message: "Hotel updated successfully", data: hotel });
    });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message.error);
  }
};
const deletehotel = async (req, res) => {
  try {
    // console.log("delete");
    const hotelId = req.params.id;
    console.log(hotelId);
    const token = req.params.token;
    console.log(token , "token");
    jwt.verify(token, privateKey, async function(err, decoded) {
      console.log(decoded, "decoder"); // bar
      if (!decoded) {
        return res.status(401).json({ message: "unAuthorized" });
      }
      const deleteHotel = await Hotel.findByIdAndDelete(hotelId);

      if (!deleteHotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }
      res.status(200).json({ message: "Hotel deleted successfully" });
      
    });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message.error);
  }
};

module.exports = { addhotel, displayhotel, updatehotel, deletehotel };
