const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("user page");
});

router.get("/:id",(req,res)=>{
    res.send("user show page");
});

router.post("/",(req,res)=>{
    res.send("user page");
});


router.delete("/",(req,res)=>{
    res.send("user delete page");
});


module.exports =router;