const express=require("express");
const router=express.Router();

const ExpressError=require('../utils/ExpressError.js');
const wrapAsync=require('../utils/wrapAsync.js');

// const Review=require('../models/review.js');
// const Blog=require('../models/blog.js');

const {reviewSchema}=require("../schema.js");
const { isLoggedIn, reviewValidUser } = require("../middleware.js");
const { postReview, deleteReview } = require("../controllers/review.js");

 const validateReview=(req,res,next)=>{
    // console.log(req.body);
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el) => el.message).join(',');
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

router.post("/:id/review",isLoggedIn,validateReview ,wrapAsync(postReview));

router.delete("/:id/review/:r_id",isLoggedIn,reviewValidUser,wrapAsync(deleteReview));


module.exports =router;