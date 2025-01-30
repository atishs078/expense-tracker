const mongoose=require('mongoose')
const expenseSchema= mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    expense:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    expenseDate:{
        type:Date,
        default:Date.now
    }

})
module.exports=mongoose.model('expense', expenseSchema)