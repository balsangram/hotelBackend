const express = require("express");

const router = express.Router();
const {login ,registration ,updateUser ,deleteUser} = require("../controllers/auth.controller");
const {addhotel ,displayhotel ,updatehotel ,deletehotel} = require("../controllers/hotel.controller");
const {addbooking ,displaybooking ,updatebooking  ,deletebooking} = require("../controllers/booking.controller");

// user 
router.post("/login", login);
router.post("/registration", registration);
router.patch("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);

// hotels 
router.post("/addhotel", addhotel);
router.get("/displayhotel/:token", displayhotel);
router.put("/updatehotel/:id/:token", updatehotel);
router.delete("/deletehotel/:id/:token", deletehotel);

// bookings
router.post("/addbooking", addbooking);
router.get("/displaybooking/:token", displaybooking);
router.put("/updatebooking/:id/:token", updatebooking);
router.delete("/deletebooking/:id/:token", deletebooking);

module.exports = router ;