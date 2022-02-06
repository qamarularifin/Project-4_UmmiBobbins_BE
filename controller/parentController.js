const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Parent = require("../models/parentModel");
const SECRET = process.env.SECRET;
const checkIsUser = require("../middlewares/checkIsUser");

// get route parent
router.get("/", async (req, res) => {
  let getParent;
  try {
    getParent = await Parent.find({});
  } catch (err) {
    res.status(400).send({ message: "Invalid request body" });
    return;
  }
  res.send(getParent);
});

// show route
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const parent = await Parent.findById(id);
  res.send(parent);
});

// create route parent
router.post("/parent", async (req, res) => {
  let createdParent;
  try {
    createdParent = await Parent.create(req.body);
  } catch (err) {
    res.status(400).send({ message: "Invalid request body" });
    return;
  }
  res.send(createdParent);
});

//seeding for parent
router.post("/seed", async (req, res) => {
  let seedItems;

  try {
    seedItems = await Parent.create({
      userId: await User.findOne({ email: "parent1@parent1.com" }),
      name: "parent1",
      location: "yishun",
    });
  } catch (err) {
    res.send(err.message);
  }

  res.send(seedItems);
});

module.exports = router;
