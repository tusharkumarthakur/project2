const express=require("express");
const router=express.Router({mergeParams:true});

const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload =multer({storage});

const ExpressError=require('../utils/ExpressError.js');
// const wrapAsync=require('../utils/wrapAsync.js');

const Blog=require("../models/blog.js");
// const User=require("../models/user.js");

const {isLoggedIn, saveRedirectUrl}=require("../middleware.js");
const {signInSchema}=require("../schema.js");
const User=require("../models/user.js");
const passport=require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { signupForm, addingUser, userAdded,loginForm, logoutUser } = require("../controllers/user.js");

//validation schema

 const userValidationSchema=(req,res,next)=>{
    console.log(req.body);
    let {error}=signInSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el) => el.message).join(',');
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

router.get("/signup",wrapAsync(signupForm));

router.post("/signup",upload.single("image"),userValidationSchema, wrapAsync(  addingUser));

router.get("/login",wrapAsync(loginForm));

router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureFlash:true,
    failureRedirect:"/user/login",
}), wrapAsync(userAdded));

router.get("/logout",isLoggedIn,logoutUser);

router.get("/info",isLoggedIn, wrapAsync(async (req,res,next)=>{
    const {_id}=req.user;
    // const profileUserId=await User.find({username:username});
    let allPosts=await Blog.find({owner:_id});
    allPosts.reverse();
    // console.log(allPosts);
    // console.log(req.user);
    res.render("./users/info.ejs",{allData:allPosts});
}));

router.get("/search/username",async (req,res)=>{

    const search=req.query.search;
    const user=await User.findOne({"username":search});
    console.log(user);
    if(user){

        res.redirect(`/blog/linked/account/${user._id}`);
    }
    else{
    req.flash("failure","Not Found!");
    res.redirect("back");
    }

})


router.post("/delete/:id",isLoggedIn,async(req,res)=>{
    let deleteUser=await User.findById(req.params.id);
    for(let user of deleteUser.allBlogs){
        await Blog.findByIdAndDelete(user)
    }
    await User.findByIdAndDelete(req.params.id);
    if(deleteUser){
         req.flash("success","User deleted!");
         res.redirect("/blog");
    }else{
         req.flash("failure","User not found!");
         res.redirect("back");
    }
    
})


router.post("/follower/:id/post/:p_id",async (req,res)=>{
    const user=await User.findById(req.params.p_id);
    const client=await User.findById(req.params.id);
    
    if(user.followers.includes(req.params.id)){
        user.followers.remove(await User.findById(req.params.id));
        client.following.remove(await User.findById(req.params.p_id));

    }else{
    user.followers.unshift(await User.findById(req.params.id));
    client.following.push(await User.findById(req.params.p_id));
    }
    await user.save();
    await client.save();

    res.redirect("back");
})

module.exports = router;