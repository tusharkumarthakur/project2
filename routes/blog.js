const express=require('express');
const router=express.Router({mergeParams:true});

const wrapAsync=require('../utils/wrapAsync.js');
const {blogSchema,ediBlogSchema}=require("../schema.js");
const ExpressError=require('../utils/ExpressError.js');
const Blog=require("../models/blog");
const User=require("../models/user");
const {isLoggedIn,validUser}=require("../middleware.js");
const { index,searchBlog,likeBlog, renderNewForm, addingBlog, showBlog, changeImage, editBlog, editPostBlog, deleteBlog,publishBlog } = require('../controllers/listing.js');
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const { number } = require('joi');
const upload =multer({storage});
// const joi=require("joi");
// app.use(express.urlencoded({extended:true}));


//validators
 const validateBlog=(req,res,next)=>{
    // console.log(req.body);
    let {error}=blogSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el) => el.message).join(',');
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

 const validateEditBlog=(req,res,next)=>{
    // console.log(req.body);
    let {error}=ediBlogSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el) => el.message).join(',');
        throw new ExpressError(400,errMsg+" lol ");
    }else{
        next();
    }
}
// router.get("/:key",(req,res)=>{
//     res.send("noen");
// })
router.get("/",wrapAsync(index));

router.get("/new",isLoggedIn,wrapAsync(renderNewForm));

router.post("/" ,isLoggedIn,upload.single("image"),validateBlog,wrapAsync(addingBlog));
// router.post("/",  ,(req,res)=>{
//     res.send(req.file);
// })

router.get("/view/:id",wrapAsync( showBlog));

router.patch("/changeImage/:id",isLoggedIn,validUser,upload.single("image"),wrapAsync( changeImage));

router.post("/like/:id",isLoggedIn,wrapAsync( likeBlog));

router.get("/search",wrapAsync(searchBlog));

router.get("/edit/:id",isLoggedIn,validUser,wrapAsync( editBlog));

router.put("/:id",isLoggedIn,validUser,validateEditBlog,wrapAsync(editPostBlog));

router.patch("/editPublish/:id",isLoggedIn,validUser,wrapAsync(publishBlog));

router.delete("/:id/user/:u_id",isLoggedIn,validUser,wrapAsync( deleteBlog));

router.get("/linked/account/:id",isLoggedIn,async(req,res)=>{
    const {id} = req.params;
    const user=await User.findById(id);
    // console.log(user.allBlogs);
    const idBlog=[];
    for(let info of user.allBlogs){
        idBlog.push(await Blog.findById(info));
    }


    // if(user.follower);
    let follow=user.followers.includes(req.user._id)
    
    res.render("./users/show.ejs",{user,allData:idBlog,follow});
})

router.get("/posts/mostLiked",async (req,res)=>{
    let blogPosts=(await Blog.find({}))
    // console.log(blogPosts);
    blogPosts.sort((a, b) => b.likeBy.length - a.likeBy.length);
    // console.log(blogPosts);
    res.render("listings/mostLiked.ejs",{allData:blogPosts});
})

router.get("/posts/mostComment",async (req,res)=>{
    let blogPosts=(await Blog.find({}))
    // console.log(blogPosts);
    blogPosts.sort((a, b) => b.review.length - a.review.length);
    // console.log(blogPosts);
    res.render("listings/mostComment.ejs",{allData:blogPosts});
});


router.get("/posts/postReview",async (req,res)=>{
    let blogPosts=await Blog.find({}).populate("review");
    // console.log(blogPosts);
    // console.log(blogPosts);
    res.render("listings/review.ejs",{allData:blogPosts});
});

router.get("/posts/categories",async (req,res)=>{
    let blogPosts=await Blog.find({})
    // console.log(blogPosts);
    // console.log(blogPosts);
    let set=['Technology', 'Travel', 'Food', 'Fashion', 'Health', 'Others'];
    res.render("listings/category.ejs",{set,allData:blogPosts});
});

router.get("/posts/mostPosts",async (req,res)=>{
    let blogPosts=await User.find({}).populate("allBlogs");
    blogPosts.sort((a, b) => b.allBlogs.length - a.allBlogs.length);
    console.log(blogPosts);
    res.render("listings/usersBlog.ejs",{AllData:blogPosts});
});

module.exports = router;