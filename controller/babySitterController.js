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

//seeding for babysitter
router.post("/seed", async (req, res) => {
  let seedItems;

  try {
    seedItems = await BabySitter.create({
      userId: await User.findOne({ email: "baby@baby.com" }),
      name: "baby",
      location: "bedok",
    });
  } catch (err) {
    res.send(err.message);
  }

  res.send(seedItems);
});

module.exports = router;
