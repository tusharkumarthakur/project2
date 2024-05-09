const { required } = require('joi');
const mongoose =require('mongoose');


const reviewSchema=new mongoose.Schema({
    
    comment:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
    },
    created_at:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
});

const Review=mongoose.model("Review",reviewSchema);

module.exports=Review;