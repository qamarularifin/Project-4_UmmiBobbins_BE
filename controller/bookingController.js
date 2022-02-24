const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const BabySitter = require("../models/babySitterModel");
const Parent = require("../models/parentModel");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51KQT8BIuVbRoacy64tgiYjjnfyA9TxpIvZn84g4tKn8mcBN2MAXEA1hB6b0zedpi4psihq2mhfDAPNUp7SPqnKd500NPWBOOhZ"
);

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

//perform booking which adds to booking-data, parent-data-currentbooking and babysistter-data-currentbooking
router.post("/bookbabysitter", async (req, res) => {
  const parentUserId = req.body.parentUserId;
  const babySitterId = req.body.babySitterId;
  const parentName = req.body.parentName;
  const babySitterName = req.body.babySitterName;
  const fromDate = req.body.fromDate;
  const toDate = req.body.toDate;
  const totalAmount = req.body.totalAmount;
  const totalDays = req.body.totalDays;
  const transactionId = uuidv4();
  const token = req.body.token;

  const parentTemp = await Parent.findOne({ userId: parentUserId });
  const babySitterTemp = await BabySitter.findOne({ _id: babySitterId });

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100,
        customer: customer.id,
        currency: "SGD",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      const newBooking = await Booking.create({
        parentId: parentTemp._id.toString(),
        babySitterId: babySitterId,
        parentName: parentName,
        babySitterName: babySitterName,
        fromDate: moment(fromDate).add(1, "days").format("DD-MM-YYYY"),
        toDate: moment(toDate).add(1, "days").format("DD-MM-YYYY"),
        totalAmount: totalAmount,
        totalDays: totalDays,
        transactionId: transactionId,
      });

      babySitterTemp.currentBookings.push(newBooking);
      parentTemp.currentBookings.push(newBooking);

      await babySitterTemp.save(); //save to database
      await parentTemp.save(); //save to database
      //cannot put below will cause UnhandledPromiseRejectionWarning: Error [ERR_HTTP_HEADERS_SENT]
      //res.send(newBooking); // send to Preview in network
    }

    res.send("Payment Successful. Your room is booked");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// get parent bookings by user id
router.post("/getparentbookingsbyuserid", async (req, res) => {
  const userId = req.body.userId;

  try {
    const findParentByUserId = await Parent.findOne({
      userId: userId,
    }).populate("currentBookings");

    res.send(findParentByUserId);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

// get babysitter bookings by user id
router.post("/getbabysitterbookingsbyuserid", async (req, res) => {
  const userId = req.body.userId;

  try {
    const findBabySitterByUserId = await BabySitter.findOne({
      userId: userId,
    }).populate("currentBookings");
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
    await Booking.findByIdAndRemove({ _id: bookingId }); //use findById cuz this is main id
    // cant delete the object id under currentBookings
    // const parent = await Parent.findOne({
    //   _id: parentId,
    // }).populate("currentBookings");

    // const parentBookings = parent.currentBookings;
    // const tempParent = parentBookings.filter(
    //   (booking) => booking.bookingId.toString() !== bookingId
    // );

    // console.log("parentBookings", parentBookings);
    // parent.currentBookings = tempParent;
    // //await parent.save();

    // ////////////////////
    // ////////////////////

    // const babySitter = await BabySitter.findOne({ _id: babySitterId }).populate(
    //   "currentBookings"
    // );

    // const babySitterBookings = babySitter.currentBookings;
    // const tempBabySitter = babySitterBookings.filter(
    //   (booking) => booking.bookingId.toString() !== bookingId
    // );
    // babySitter.currentBookings = tempBabySitter;

    //await babySitter.save();

    res.send("Booking deleted successfully");
  } catch (err) {
    res.status(400).send({ message: "Invalid request body" });
    return;
  }
});

router.post("/cancelbooking", async (req, res) => {
  const bookingId = req.body.bookingId;

  try {
    const booking = await Booking.findOne({ _id: bookingId });
    booking.status = "cancelled";
    await booking.save();

    res.send("Booking cancelled successfully");
  } catch (error) {
    res.status(400).send({ message: "Invalid request body" });
  }
});

router.post("/confirmbooking", async (req, res) => {
  const bookingId = req.body.bookingId;

  try {
    const booking = await Booking.findOne({ _id: bookingId });
    booking.status = "confirmed";
    await booking.save();
    res.send("Booking confirmed successfully");
  } catch (error) {
    res.status(400).send({ message: "Invalid request body" });
  }
});

module.exports = router;

// without stripe implementation
//perform booking which adds to booking-data, parent-data-currentbooking and babysistter-data-currentbooking
// router.post("/bookbabysitter", async (req, res) => {
//   const parentUserId = req.body.parentUserId;
//   const babySitterId = req.body.babySitterId;
//   const parentName = req.body.parentName;
//   const babySitterName = req.body.babySitterName;
//   const fromDate = req.body.fromDate;
//   const toDate = req.body.toDate;
//   const totalAmount = req.body.totalAmount;
//   const totalDays = req.body.totalDays;
//   const transactionId = uuidv4();

//   const parentTemp = await Parent.findOne({ userId: parentUserId });
//   const babySitterTemp = await BabySitter.findOne({ _id: babySitterId });

//   try {
//     const newBooking = await Booking.create({
//       parentId: parentTemp._id.toString(),
//       babySitterId: babySitterId,
//       parentName: parentName,
//       babySitterName: babySitterName,
//       fromDate: moment(fromDate).format("DD-MM-YYYY"),
//       toDate: moment(toDate).format("DD-MM-YYYY"),
//       totalAmount: totalAmount,
//       totalDays: totalDays,
//       transactionId: transactionId,
//     });

//     babySitterTemp.currentBookings.push(newBooking);
//     parentTemp.currentBookings.push(newBooking);

//     //////might not need if use reference/////
//     // babySitterTemp.currentBookings.push({
//     //   bookingId: newBooking._id,
//     //   fromDate: moment(fromDate).format("DD-MM-YYYY"),
//     //   toDate: moment(toDate).format("DD-MM-YYYY"),
//     //   parentId: parentTemp._id.toString(),
//     //   babySitterId: babySitterId,
//     //   parentName: parentName,
//     //   babySitterName: babySitterName,
//     //   totalAmount: totalAmount,
//     //   totalDays: totalDays,
//     //   transactionId: transactionId,
//     //   status: newBooking.status, //status can put here because the default is set to false. So it overwrites required true condition
//     // });

//     // parentTemp.currentBookings.push({
//     //   bookingId: newBooking._id,
//     //   fromDate: moment(fromDate).format("DD-MM-YYYY"),
//     //   toDate: moment(toDate).format("DD-MM-YYYY"),
//     //   parentId: parentTemp._id.toString(),
//     //   babySitterId: babySitterId,
//     //   parentName: parentName,
//     //   babySitterName: babySitterName,
//     //   totalAmount: totalAmount,
//     //   totalDays: totalDays,
//     //   transactionId: transactionId,
//     //   status: newBooking.status,
//     // });

//     await babySitterTemp.save(); //save to database
//     await parentTemp.save(); //save to database
//     res.send(newBooking);
//   } catch (error) {
//     return res.status(400).json({ message: error });
//   }
// });
