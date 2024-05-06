const mongoose=require("mongoose")

const messageSchema=new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    users:Array,
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }

})
module.exports=mongoose.model("Messages",messageSchema)