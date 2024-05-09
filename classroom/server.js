const express=require("express");
const app=express();

const cookieParser=require("cookie-parser");
const session=require("express-session");
// const cookiesParser=require("cookie-parser");
const users=require('./routes/user');
const flash=require("connect-flash");
const posts=require("./routes/post");
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
// app.use(cookieParser("secret"));
app.use(session({secret:"secretcode",resave:false,saveUninitialized:true,}));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.errorMsg=req.flash("error");
    res.locals.successMsg=req.flash("success");
    next();
})

app.get("/test",(req,res)=>{
    res.send("hell naah!");
});

app.get("/register",(req,res)=>{
    const {name="anonaymous"}=req.query;
    req.session.name=name;
    console.log(req.session);
    if(name==="anonaymous"){
        req.flash("error","not registered");
    }else{
        req.flash("success","you registered successfully");
    }
    res.redirect("/greet"); 
});




app.get("/greet",(req,res)=>{
    
    res.render("page.ejs",{name:req.session.name});
})



// app.get("/countsession",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     console.dir(req.session);
//     res.send(`session count ${req.session.count}`);
// })

// app.get("/getcookies",(req,res)=>{
//     res.cookie("name","tushar");
//     res.send("cookie is sended");
// });


// app.get("/singnedcookie",(req,res)=>{
//     res.cookie("age","14",{signed:true});
//     res.send("signedcookie is sended");
// });



// app.get("/greet",(req,res)=>{
//     let {name="anonymous"}=req.cookies;
//     res.send(`hello,${name}`);
// })


// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     console.dir(req.signedCookies);
//     res.send("home route");
// });

//user

// app.use("/user",users);

//post


app.use("/post",posts);
app.listen(4000,()=>{
    console.log("You are on port 4000");
});