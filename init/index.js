const mongoose=require("mongoose");
const data=require("./data.js");

const Blog=require("../models/blog.js");
// const { log } = require("console");

mongoose.connect("mongodb://127.0.0.1:27017/clgpro").then(()=>console.log("index connection passed")).catch(err=>console.log("connection failed"));
const newData=data.map((obj)=>({...obj,owner:"66123b3a916427b4fe82b966"}));
Blog.insertMany(newData);
console.log("data inserted");