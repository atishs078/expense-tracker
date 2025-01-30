const express = require('express');
const router = express.Router();
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtSecret = "ABCDEFGHIJKLMNOPQRSTVWXYZ"; // Keep this in environment variables for better security
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(422).json({ error: "Please fill in all fields" });
        }
        let userCheck = await User.findOne({ email });
        if (userCheck) {
            return res.status(422).json({ error: "User already exists" });
        }
        if (password.length < 8) {
            return res.status(422).json({ error: "Password must be at least 8 characters long" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashPassword,
        });
        await newUser.save();
        const data = {
            user: {
                id: newUser._id,
            },
        };
        const authToken = await jwt.sign(data, jwtSecret);
        res.status(201).json({ message: "User registration successful", authToken, user:newUser._id });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: "Please Fill All Fields" })
    }
    try {
        const userCheck = await User.findOne({ email })
        if (!userCheck) {
            return res.status(400).json({ error: "Invalid Credentials" })
        }
        const passwordCheck=await bcrypt.compare(password,userCheck.password)
        if(passwordCheck){
            const data={
                user:{
                    id:userCheck._id
                }
            }
            const authtoken=await jwt.sign(data,jwtSecret)
            res.status(200).json({message:"Login Succesfull", authtoken, user:userCheck._id})
        }
    } catch (error) {
        console.log(error)

    }

})

router.post('/getUserDetails', async (req, res) => {
    const {_id}=req.body
    try{
    if(!_id){
        return res.status(404).json({error:"UserID required"})
    }
    const userCheck=await User.findOne({_id})
    if(!userCheck){
        return res.status(404).json({error: "User Not Found"})
    }
    return res.status(200).json({uname: userCheck.name, email: userCheck.email, createdAt: userCheck.timeStamp})
}
catch(e){
    console.log(e)
}
})
module.exports = router;
