const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Parent = require("../models/parentModel");
const BabySitter = require("../models/babySitterModel");
const SECRET = process.env.SECRET;
const checkIsUser = require("../middlewares/checkIsUser");

// get all users
router.get("/", async (req, res) => {
  let users;
  try {
    users = await User.find({});
  } catch (error) {
    res.status(500).send({ message: "Unexpected Error" });
    return;
  }
  //res.json({status: "ok"})
  res.send(users);
});

router.post("/signup", async (req, res) => {
  try {
    // const name = req.body.name;
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, 10);
    const role = req.body.role;
    await User.create({
      email: email,
      password: password,
      role: role,
    });
    res.json({ status: "ok" });
    //res.send(user)
  } catch (error) {
    res.json({ status: "error", error: "Duplicate email" });
  }
});

// create route expense
router.post("/dashboard", async (req, res) => {
  let newQuote;
  try {
    newQuote = await User.create({ quote: req.body.quote });
  } catch (err) {
    res.status(400).send({ message: "Invalid request body" });
    return;
  }
  res.json({ status: "ok", newQuote });
});

router.get("/dashboard/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    res.send(user);
  } catch (error) {
    res.json({ status: "error", error: "invalid data" });
  }
});

router.post("/dashboard/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id); // user returns an object that is tied to the username i.e, 123
  // const user = await User.findOne({  // user returns an object that is tied to the username i.e, 123
  //     email: req.body.email,
  //     //password: req.body.password // with this will not work for login
  // })

  try {
    await User.updateOne({ _id: user }, { $set: { quote: req.body.quote } });
    return res.json({ status: "ok" }); // get the quote based on the user email
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid session" });
  }
});

// update user profile // can update both email and enter new password
router.post("/dashboard/update-profile/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const password = await bcrypt.hash(req.body.password, 10);

  try {
    await User.updateMany(
      { _id: user },
      {
        $set: { email: req.body.email, password: password },
      }
    );
    return res.json({ status: "ok" }); // get the quote based on the user email
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "duplicate update" });
  }
});

router.delete("/deleteuser/:id", async (req, res) => {
  let deletedUser;
  try {
    deletedUser = await User.findByIdAndRemove(req.params.id);
    res.send(deletedUser);
  } catch (err) {
    res.status(400).send({ message: "Invalid request body" });
    return;
  }
});

// get userinfo
// router.get("/:id", async (req, res) => {
//     const { id } = req.params;
//     const findUser = await User.findById(id)
//     // returns object with username, password and role
//     res.send(findUser)
//   });

//   router.get("/:id", async(req,res)=>{

//     const token = req.headers["x-access-token"]

//     try{
//         const decoded = jwt.verify(token, SECRET) // authenticate token
//         const email = decoded.email
//         const user = await User.findOne({email: email})
//         return res.json({status: "ok", _id: user._id}) // get the quote based on the user email //quote will be exclusive to profile
//     } catch(error){
//         console.log(error)
//         res.json({status: "error", error: "invalid token"})
//     }

// })

module.exports = router;
