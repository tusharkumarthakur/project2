if(process.env.NODE_ENV !="production"){
    require("dotenv").config(); 
}
// console.log(process.env.SECRET);
const express=require("express");
const mongoose=require("mongoose");
const wrapAsync=require('./utils/wrapAsync.js');
const ExpressError=require('./utils/ExpressError.js');
const ejsMate=require('ejs-mate');
const dbUrl=process.env.ATLASDB_URL;

const methodOverride=require("method-override");
const blogRouter=require('./routes/blog.js');
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");

const User=require("./models/user.js");

const path=require("path");
const { stat } = require("fs/promises");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
// const mongocenect="await mongoose.connect('mongodb://127.0.0.1:27017/test')";

const app=express();
app.use(flash());
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 12*3600,
});

store.on("err",()=>{
    console.log("error occured in session store",err);
})


const sessionInfo={
    store,
    secret:process.env.SECRET,
    resave:"false",
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};
app.use(session(sessionInfo));
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));


main().then(()=>{console.log("connection successful")}).catch(err=>console.log("connection failed"));
async function main(){
    await mongoose.connect(dbUrl);
}
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.failure=req.flash("failure");
    res.locals.error=req.flash("error");
    res.locals.curUser=req.user;
    // console.log("ur id ", res.locals.curUser);
    // console.log(res.locals.success);
    next();
});
app.get("/",(req,res,next)=>{
    res.redirect("/blog");
})
app.use("/blog",blogRouter);
app.use("/review",reviewRouter);
app.use("/user",userRouter);

app.all("*",wrapAsync((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
}));

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("listings/error.ejs",{message});
    // res.status(statusCode).send(message);
});



app.listen(8080,()=>{
    console.log("we are on port",8080);
});