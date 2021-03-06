const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const BabySitter = require("../models/babySitterModel");
const SECRET = process.env.SECRET;
const checkIsUser = require("../middlewares/checkIsUser");

// get all babysitters
router.get("/getallbabysitters", async (req, res) => {
  let getBabySitters;
  try {
    getBabySitters = await BabySitter.find({}).populate("currentBookings");
    res.send(getBabySitters);
  } catch (error) {
    res.status(500).send({ message: "Unexpected Error" });
    return;
  }
});

// get individual babysitter by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const babySitter = await BabySitter.findById(id);
    res.send(babySitter);
  } catch (err) {
    res.status(400).send({ message: "Invalid request body" });
  }
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
  const babysitterid = req.body.id; // the req.body.roomid must be be same in frontend which is roomid
  try {
    const babySitter = await BabySitter.findById(babysitterid); //this will return an object related to the id
    // const room = await Room.findOne({ _id: roomid }); //this is another method which is working

    res.send(babySitter); //need to res.send so that front end can get the data via axios.post method
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

// create new babysitter profile
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
    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

// parent new profile creation
router.post("/createbabysitternewprofile", async (req, res) => {
  try {
    const userId = req.body.userId;
    const name = req.body.name;
    const location = req.body.location;
    const image = req.body.image;
    const ratePerDay = req.body.ratePerDay;
    const description = req.body.description;

    const newBabySitter = await BabySitter.create({
      userId: userId,
      name: name,
      location: location,
      image: image,
      ratePerDay: ratePerDay,
      description: description,
    });
    res.send(newBabySitter);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.put("/:id/edit", async (req, res) => {
  let editBabySitter;
  try {
    editBabySitter = await BabySitter.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
  } catch (err) {
    res.status(400).send({ message: "Invalid request body" });
  }
  res.send(editBabySitter);
});

//findbabysitterbyuserid
router.post("/getbabysitterbyuserid", async (req, res) => {
  const userId = req.body.userId;
  try {
    const babySitter = await BabySitter.findOne({ userId: userId });

    res.send(babySitter);
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
      name: "Bulbasaur-babysitter",
      location: "kembangan",
      ratePerHour: 40,
      image:
        "https://static.wikia.nocookie.net/ultimate-pokemon-fanon/images/1/1f/001Bulbasaur_OS_anime_2.png/revision/latest/scale-to-width-down/400?cb=20160513021913",
    });
  } catch (err) {
    res.send(err.message);
  }

  res.send(seedItems);
});

module.exports = router;

//https://cdn.ndtv.com/tech/images/gadgets/pikachu_hi_pokemon.jpg?
//https://static.wikia.nocookie.net/ultimate-pokemon-fanon/images/1/1f/001Bulbasaur_OS_anime_2.png/revision/latest/scale-to-width-down/400?cb=20160513021913
