const mongoose=require('mongoose')
const incomeSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    income:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    incomeDate:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('Income', incomeSchema)
