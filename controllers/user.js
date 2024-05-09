const User=require("../models/user");
module.exports.signupForm=(req,res)=>{
    res.render("./users/signup.ejs");
}


module.exports.addingUser=async (req,res,next)=>{
    try{

        const {username,name,email,password}=req.body;
    // console.log(username,email,password);
    const newUser=new User({
        username:username,
        email:email,
        name:name,
    });
    
    const registerdUser=await User.register(newUser,password);
    req.login(registerdUser,(err)=>{
        if(err){
            next(err);
        }
    });
   
    if(req.file) {
        // console.log("inside field");
         const url=req.file.path;
         const filename=req.file.filename;
         newUser.image={url,filename};
    
    }
    await newUser.save();
    req.flash("success","User registered Successfully");
    res.redirect("/blog");

    }catch(e){
        req.flash("failure",e.message);
        res.redirect("/user/signup");
    }
    // console.log(newUser);
    
    
};

module.exports.userAdded=async (req,res)=>{
    req.flash("success","you are logged in");
    // console.log(res.locals.saveRedirectUrl);
    const address=res.locals.redirectUrl || "/blog";
    // console.log(address);
    res.redirect(address);
};


module.exports.loginForm=(req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.logoutUser=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You'r successfully logged out");
        res.redirect("/blog");
    })
};

