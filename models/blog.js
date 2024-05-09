const mongoose=require("mongoose");
const { type } = require("os");

const Review=require('./review.js');
const User=require('./user.js');
const { ref } = require("joi");


const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,  
    },
    slug:{
        type:String,
        default:"unfilled"
        // required:true,
    },
    published:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    
    tags:{
        type:[String],
        default:["not filled"],
        // required:true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Technology', 'Travel', 'Food', 'Fashion', 'Health', 'Others']
    },

    created_at:{
        type:Date,
        default: new Date(),
        
    },
    country:{
            type:String,
            default:"unknown",
        },
    updated_at:{
        type:Date,
        default:new Date(),
    },
    image:{
        url:{
            type:String,
            default:'https://cdn4.iconfinder.com/data/icons/solid-part-6/128/image_icon-512.png',
        },
        filename:{
            type:String,
            default:'NANS_DEV/wlbuskvipltspqulojge',
        }
        
    },
    review:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    likeBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }]
});


blogSchema.post("findOneAndDelete",async (blog)=>{
    if(blog){
        
         await Review.deleteMany({_id:{$in: blog.review}});

        }
   
});
const Blog=mongoose.model("Blog",blogSchema);


module.exports =Blog;