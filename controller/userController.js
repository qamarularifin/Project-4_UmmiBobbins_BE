const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET


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


router.post("/signup", async(req,res)=>{
 
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
            role: req.body.role

        });
        res.json({status: "ok"})
        //res.send(user)
    } catch (error) {
        res.json({status: "error", error: "Duplicate email"})
        
    }   
})

router.post("/login", async(req,res)=>{
   
        const user = await User.findOne({
            email: req.body.email,
            //password: req.body.password
        })

        if (!user){
            return res.json({status: "error", error: "Invalid login"})
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password)

        if (isPasswordValid) {

            const token = jwt.sign({
                name: user.name,
                email: user.email
            }, SECRET)
            //res.json is to show in network. Note: go to Preview
            return res.json(
                {status: "ok", user: token}
            )
        } else{
            return res.json(
                {status: "error", user: false}
            )
        }
 
  
       
})


// use this get request to render (permanent) fields in the dashboard
// this get request consists of token that is unique to a user
// hence, all the data will be unique to the user based on email specified
router.get("/dashboard", async(req,res)=>{
   
    const token = req.headers["x-access-token"]

    try{
        const decoded = jwt.verify(token, SECRET) // authenticate token
        const email = decoded.email
        const user = await User.findOne({email: email})
        return res.json({status: "ok", 
                         quote: user.quote, 
                         email: user.email,
                         name: user.name,
                         role: user.role,
                         _id: user._id,
                         }) // get the quote based on the user email //quote will be exclusive to profile 
    } catch(error){
        console.log(error)
        res.json({status: "error", error: "invalid token"})
    }
    
})


router.post("/dashboard", async(req,res)=>{
   
    const token = req.headers["x-access-token"]

    try{
        const decoded = jwt.verify(token, SECRET)  // authenticate token
        const email = decoded.email
        await User.updateOne(
            {email: email},
            {$set: {quote: req.body.quote}}
            )
        return res.json({status: "ok"}) // get the quote based on the user email
    } catch(error){
        console.log(error)
        res.json({status: "error", error: "invalid token"})
    }
    
})

// update user profile

router.put("/:id/update", async(req,res)=>{
   
    const token = req.headers["x-access-token"]

    try{
        const decoded = jwt.verify(token, SECRET)  // authenticate token
        const email = decoded.email
        await User.updateOne(
            {email: email},
            {$set: {name: req.body.name}},
            {$set: {email: req.body.email}},
            {$set: {password: req.body.password}},
            

            )
        return res.json({status: "ok"}) // get the quote based on the user email
    } catch(error){
        console.log(error)
        res.json({status: "error", error: "invalid token"})
    }
    
})


// router.put("/:id/update", async (req, res) => {
//     let updatedUser;
//     try {
//       updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//       });
//     } catch (err) {
//       res.status(400).send({ message: "Invalid request body" });
//     }
//     res.send(updatedUser);
//   });

// update user profile
// router.put("/update/:id", async (req,res) =>{
//     const { id } = req.params;
//     const user = await User.findById(id)

//     if (user){
//         user.name = req.body.name || user.name,
//         user.email = req.body.email || user.email;
        
//         if (req.body.password){
//             user.password = req.body.password
//         }

//         const updatedUser = await user.save()
//         res.json({
//             _id: updatedUser._id,
//             name: updatedUser.name,
//             email: updatedUser.email

//         })
//     } else{
//         res.status(404);
//         throw new Error("User not found")
//     }
// })

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