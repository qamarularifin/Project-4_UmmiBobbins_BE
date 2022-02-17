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
  const babySitterName = req.body.babySitterName;
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
      babySitterName: babySitterName,
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
      babySitterName: babySitterName,
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
      babySitterName: babySitterName,
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

// get parent bookings by user id
router.post("/getparentbookingsbyuserid", async (req, res) => {
  const userId = req.body.userId;

  try {
    const findParentByUserId = await Parent.findOne({ userId: userId });

    res.send(findParentByUserId);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

// get babysitter bookings by user id
router.post("/getbabysitterbookingsbyuserid", async (req, res) => {
  const userId = req.body.userId;

  try {
    const findBabySitterByUserId = await BabySitter.findOne({ userId: userId });
    res.send(findBabySitterByUserId);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/deletebooking", async (req, res) => {
  const bookingId = req.body.bookingId;
  const parentId = req.body.parentId;
  const babySitterId = req.body.babySitterId;
  try {
    const parent = await Parent.findOne({
      _id: parentId,
    });

    const parentBookings = parent.currentBookings;
    const tempParent = parentBookings.filter(
      (booking) => booking.bookingId.toString() !== bookingId
    );

    parent.currentBookings = tempParent;
    await parent.save();

    ////////////////////
    ////////////////////

    const babySitter = await BabySitter.findOne({ _id: babySitterId });

    const babySitterBookings = babySitter.currentBookings;
    const tempBabySitter = babySitterBookings.filter(
      (booking) => booking.bookingId.toString() !== bookingId
    );
    babySitter.currentBookings = tempBabySitter;

    await babySitter.save();

    await Booking.findByIdAndRemove({ _id: bookingId }); //use findById cuz this is main id

    res.send("Booking deleted successfully");
  } catch (err) {
    res.status(400).send({ message: "Invalid request body" });
    return;
  }
});

module.exports = router;
