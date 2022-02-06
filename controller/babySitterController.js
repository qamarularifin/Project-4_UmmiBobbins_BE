const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const BabySitter = require("../models/babySitterModel");
const SECRET = process.env.SECRET;
const checkIsUser = require("../middlewares/checkIsUser");

// get all babysitters
router.get("/", async (req, res) => {
  let getBabySitters;
  try {
    getBabySitters = await BabySitter.find({});
  } catch (error) {
    res.status(500).send({ message: "Unexpected Error" });
    return;
  }
  res.send(getBabySitters);
});

// create route babysitter
router.post("/babysitter", async (req, res) => {
  let createdBabySitter;
  try {
    createdBabySitter = await BabySitter.create(req.body);
  } catch (err) {
    res.status(400).send({ message: "Invalid request body" });
    return;
  }
  res.send(createdBabySitter);
});

//post because receiving the roomid from the frontend and backend will post the data to frontend as per the schema specific to the roomid
router.post("/getbabysitterbyid", async (req, res) => {
  const babysitterid = req.body.xxx; // the req.body.roomid must be be same in frontend which is roomid
  try {
    const babySitter = await BabySitter.findById(babysitterid); //this will return an object related to the id
    // const room = await Room.findOne({ _id: roomid }); //this is another method which is working
    res.send(babySitter); //need to res.send so that front end can get the data via axios.post method
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

//seeding for babysitter
router.post("/seed", async (req, res) => {
  let seedItems;

  try {
    seedItems = await BabySitter.create({
      userId: await User.findOne({ email: "baby1@baby1.com" }),
      name: "baby1",
      location: "kembangan",
    });
  } catch (err) {
    res.send(err.message);
  }

  res.send(seedItems);
});

module.exports = router;
