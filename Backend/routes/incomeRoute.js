const express = require('express')
const router = express.Router()
const Income = require('../model/income')
const User = require('../model/user')
router.post('/addIncome', async (req, res) => {
    const { userId, email, income, category, incomeDate } = req.body
    if (!userId || !email || !income || !category) {
        return res.status(424).json({ message: "All fields are required" })
    }
    const userCheck = await User.findOne({ _id: userId })
    if (!userCheck) {
        return res.status(404).json({ message: "User Not Found" })
    }
    const newIncome = new Income({
        userId, email, income, category, incomeDate
    })
    await newIncome.save()
    return res.status(200).json({ message: "Income Added Succesfully" })
}
)
router.post('/getTotalIncome', async(req, res)=>{
    const {userId}=req.body
    if(!userId){
        return res.status(424).json({message: "UserID is Required"})
    }
    const userCheck = await User.findOne({_id: userId})
    if(!userCheck){
        return res.status(404).json({message: "User Not  Found"})
    }
    const getData = await Income.find({userId})
    return res.status(200).json({message: getData})
})
module.exports = router