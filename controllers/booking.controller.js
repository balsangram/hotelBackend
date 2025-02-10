const { Booking } = require("../models/Booking.model");
const jwt = require("jsonwebtoken");
const privateKey = "ghkdfdkkhdkddkdk";

const addbooking = async (req, res) => {
  try {
    console.log(req.body);
    // Extract data from request body
    const { hotelId, date, token } = req.body;

    // Validate input fields
    if (!hotelId || !date || !token) {
      return res.status(400).json({ message: "All fields are required" });
    }
    jwt.verify(token, privateKey, async function(err, decoded) {
      console.log(decoded.foo); // bar
      if (!decoded) {
        return res.status(401).json({ message: "unAuthorized" });
      }
      // Create a new booking instance
      const newBooking = new Booking({
        userId: decoded.userId,
        hotelId,
        date
      });

      // Save booking to the database
      await newBooking.save();

      // Send success response
      res
        .status(201)
        .json({ message: "Booking added successfully", booking: newBooking });
    });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message.error);
  }
};

const displaybooking = async (req, res) => {
  try {
    console.log(req.body);
    const { token } = req.params;

    jwt.verify(token, privateKey, async function(err, decoded) {
      console.log(decoded, "foo"); // bar
      if (!decoded) {
        return res.status(401).json({ message: "unAuthorized" });
      }
      const bookings = await Booking.find()
        .populate("userId", "name")
        .populate("hotelId", "name");
      res.status(200).json({ data: bookings });
    });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message.error);
  }
};

const updatebooking = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message.error);
  }
};

const deletebooking = async (req, res) => {
  try {
    console.log(req.params);
    
    const { token } = req.params;
    console.log(token,"token");
    
    const { id } = req.params; // Get bookingId from request parameters
    console.log(id,"id");
    jwt.verify(token, privateKey, async function(err, decoded) {
      console.log(decoded.foo); // bar
      if (!decoded) {
        return res.status(401).json({ message: "unAuthorized" });
      }
      // Check if booking exists
      const booking = await Booking.findById(id);
      console.log(booking);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      // Delete the booking
      await Booking.findByIdAndDelete(id);

      res.status(200).json({ message: "Booking deleted successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message.error);
  }
};

module.exports = { addbooking, displaybooking, updatebooking, deletebooking };
