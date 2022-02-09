const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const BabySitter = require("../models/babySitterModel");
const Parent = require("../models/parentModel");
const moment = require("moment");

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/bookbabysitter", async (req, res) => {
  const parentUserId = req.body.parentUserId;
  const babySitterId = req.body.babySitterId;
  const fromTime = req.body.fromTime;
  const toTime = req.body.toTime;
  const totalAmount = req.body.totalAmount;
  const totalTime = req.body.totalTime;

  try {
    const newBooking = await Booking.create({
      parentUserId: parentUserId,
      babySitterId: babySitterId,
      fromTime: moment(fromTime).format("DD-MM-YYYY"),
      toTime: moment(toTime).format("DD-MM-YYYY"),
      totalAmount: totalAmount,
      totalTime: totalTime,
      transactionId: "1111",
    });

    const babySitterTemp = await BabySitter.findOne({ _id: babySitterId });
    babySitterTemp.currentBookings.push({
      bookingid: newBooking._id,
      fromTime: moment(fromTime).format("DD-MM-YYYY"),
      toTime: moment(toTime).format("DD-MM-YYYY"),
      parentUserId: parentUserId,
      babySitterId: babySitterId,
      status: newBooking.status, //status can put here because the default is set to "booked". So it overwrites required true condition
    });
    const parentTemp = await Parent.findOne({ _id: parentUserId });
    parentTemp.currentBookings.push({
      bookingid: newBooking._id,
      fromTime: moment(fromTime).format("DD-MM-YYYY"),
      toTime: moment(toTime).format("DD-MM-YYYY"),
      parentUserId: parentUserId,
      babySitterId: babySitterId,
      status: newBooking.status, //status can put here because the default is set to "booked". So it overwrites required true condition
    });
    await babySitterTemp.save();
    await parentTemp.save();
    res.send(newBooking);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
