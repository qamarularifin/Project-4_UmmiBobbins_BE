const express = require("express")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const router = express.Router()


router.post("/login", async(req,res)=>{
   
    const user = await User.findOne({  // user returns an object that is tied to the username i.e, 123
        email: req.body.email,
        //password: req.body.password
    })

    if (!user){
        return res.json({status: "error", error: "Invalid login"})
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password) //user.password is the object which has password as one of the keys

    if (isPasswordValid) {

        req.session.user = user // this basically makes cookie and add session to user with session id
        console.log("sesssionsss", req.session)
        //res.json is to show in network. Note: go to Preview
        return res.json(
            {status: "ok", userData: req.session}
        )
    } else{
        return res.json(
            {status: "error", userData: false}
        )
    }

})


// DELETE SESSION FOR LOGGING OUT
router.delete("/", async (req, res) => {
    req.session.destroy(() => {
        return res.json(
            {status: "ok"}
        )
    })
})


module.exports = router