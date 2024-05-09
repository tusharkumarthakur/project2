const Blog=require("./models/blog");
const Review=require("./models/review");
const wrapAsync = require("./utils/wrapAsync");
module.exports.isLoggedIn=  (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        // console.log(req.session.redirectUrl+" this is original path");
        // console.log(req);
        req.flash("failure","You must need to logged in");
        return res.redirect("/user/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        // console.log("i am in side saveRedirectUrl");
    res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.validUser=wrapAsync( async (req,res,next)=>{
    const {id}=req.params;
    
    const data= await Blog.findById(id);
    if(!data.owner._id.equals(res.locals.curUser._id)){
        req.flash("failure","You don't have permission");
        return res.redirect('back');
    };
    next();
});

module.exports.reviewValidUser= wrapAsync( async (req,res,next)=>{
    const {id,r_id}=req.params;
    
    const data= await Review.findById(r_id);
    if(!data.author.equals(res.locals.curUser._id)){
        req.flash("failure","You don't have permission to delete this comment");
        return res.redirect('back');
    };
    next();
});