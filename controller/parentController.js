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

//post because receiving the roomid from the frontend and backend will post the data to frontend as per the schema specific to the roomid
router.post("/getparentbyid", async (req, res) => {
  const parentid = req.body.id; // the req.body.roomid must be be same in frontend which is roomid
  try {
    const parent = await Parent.findById(parentid); //this will return an object related to the id
    // const room = await Room.findOne({ _id: roomid }); //this is another method which is working
    res.send(parent); //need to res.send so that front end can get the data via axios.post method
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

//seeding for parent
router.post("/seed", async (req, res) => {
  let seedItems;

  try {
    seedItems = await Parent.create({
      userId: await User.findOne({ email: "parent1@parent1.com" }),
      name: "Edward",
      location: "Ang Mo Kio",
      image:
        "https://cdn3.vectorstock.com/i/1000x1000/83/52/cartoon-cute-parents-and-baby-vector-22198352.jpg",
    });
  } catch (err) {
    res.send(err.message);
  }

  res.send(seedItems);
});

module.exports = router;

//https://cdn2.vectorstock.com/i/1000x1000/19/16/parents-hugging-a-baby-vector-16381916.jpg

//https://cdn3.vectorstock.com/i/1000x1000/83/52/cartoon-cute-parents-and-baby-vector-22198352.jpg
