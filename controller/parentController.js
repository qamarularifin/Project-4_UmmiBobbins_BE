const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Parent = require("../models/parentModel");
const BabySitter = require("../models/babySitterModel");
const SECRET = process.env.SECRET;
const checkIsUser = require("../middlewares/checkIsUser");

// get route parent
router.get("/getallparents", async (req, res) => {
  let getParents;
  try {
    getParents = await Parent.find({});
    res.send(getParents);
  } catch (err) {
    res.status(400).send({ message: "Invalid request body" });
    return;
  }
});

// get individual parent by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const parent = await Parent.findById(id);
    res.send(parent);
  } catch (err) {
    res.status(400).send({ message: "Invalid request body" });
  }
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

// create new parent profile
router.post("/new-profile/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  try {
    await User.updateOne(
      { _id: user },
      {
        $set: { created: req.body.created },
      }
    );
    return res.json({ status: "ok" }); // get the quote based on the user email
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "duplicate update" });
  }
});

// parent new profile creation
router.post("/createparentnewprofile", async (req, res) => {
  try {
    const userId = req.body.userId;
    const name = req.body.name;
    const location = req.body.location;
    const image = req.body.image;
    const description = req.body.description;

    const newParent = await Parent.create({
      userId: userId,
      name: name,
      location: location,
      image: image,
      description: description,
    });
    res.send(newParent);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.put("/:id/edit", async (req, res) => {
  let editParent;
  try {
    editParent = await Parent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(editParent);
  } catch (err) {
    res.status(400).send({ message: "Invalid request body" });
  }
});

//findparentbyuserid
router.post("/getparentbyuserid", async (req, res) => {
  const userId = req.body.userId;
  try {
    const parent = await Parent.findOne({ userId: userId });

    res.send(parent);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/getmessagefrombabysitter", async (req, res) => {
  const id = req.body.id;
  //const babySitterUserId = req.body.babySitterUserId;
  const messages = req.body.messages;

  try {
    const parent = await Parent.findById(id);
    //const babySitter = await BabySitter.findOne({ userId: babySitterUserId });

    parent.messages.push(messages);
    await parent.save();
    res.send("message successfully sent");
    // console.log("fff", parent);
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
