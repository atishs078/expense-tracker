const mongoose=require('mongoose')
const downloadSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    timeStamp:{
        type:Date,
        default:Date.now
    },
    fromDate:{
        type:Date,
        required:true
    },
    toDate:{
        type:Date,
        required:true
    }
})