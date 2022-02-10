const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const BabySitter = require("../models/babySitterModel");
const Parent = require("../models/parentModel");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");

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
  const fromDate = req.body.fromDate;
  const toDate = req.body.toDate;
  const totalAmount = req.body.totalAmount;
  const totalDays = req.body.totalDays;
  const transactionId = uuidv4();

  const parentTemp = await Parent.findOne({ userId: parentUserId });
  const babySitterTemp = await BabySitter.findOne({ _id: babySitterId });
  console.log("parentTemp", parentTemp);
  console.log("babysitterTemp", babySitterTemp);

  try {
    const newBooking = await Booking.create({
      parentId: parentTemp._id.toString(),
      babySitterId: babySitterId,
      fromDate: moment(fromDate).format("DD-MM-YYYY"),
      toDate: moment(toDate).format("DD-MM-YYYY"),
      totalAmount: totalAmount,
      totalDays: totalDays,
      transactionId: transactionId,
    });

    babySitterTemp.currentBookings.push({
      bookingId: newBooking._id,
      fromDate: moment(fromDate).format("DD-MM-YYYY"),
      toDate: moment(toDate).format("DD-MM-YYYY"),
      parentId: parentTemp._id.toString(),
      babySitterId: babySitterId,
      totalAmount: totalAmount,
      totalDays: totalDays,
      transactionId: transactionId,
      status: newBooking.status, //status can put here because the default is set to false. So it overwrites required true condition
    });

    parentTemp.currentBookings.push({
      bookingId: newBooking._id,
      fromDate: moment(fromDate).format("DD-MM-YYYY"),
      toDate: moment(toDate).format("DD-MM-YYYY"),
      parentId: parentTemp._id.toString(),
      babySitterId: babySitterId,
      totalAmount: totalAmount,
      totalDays: totalDays,
      transactionId: transactionId,
      status: newBooking.status,
    });

    await babySitterTemp.save(); //save to database
    await parentTemp.save(); //save to database
    res.send(newBooking);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
