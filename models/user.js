const { required, ref, date } = require("joi");
const mongoose=require("mongoose");
const { type } = require("os");
const Schema=mongoose.Schema;
let Blog=require("./blog.js");

const passportLocalMongoose=require("passport-local-mongoose");
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    allBlogs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog"
    }],
    created_at:{
        type:Date,
        default:Date.now(),
    },
    image:{
        url:{
            type:String,
            default:'https://cdn0.iconfinder.com/data/icons/cryptocurrency-137/128/1_profile_user_avatar_account_person-132-512.png',
        },
        filename:{
            type:String,
            default:'NANS_DEV/wlbuskvipltspqulojge',
        }
        
    },
    about:{
        type:String,
        default:""
    },

    
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],



});


userSchema.plugin(passportLocalMongoose);
const User=mongoose.model("User",userSchema);



module.exports=User;