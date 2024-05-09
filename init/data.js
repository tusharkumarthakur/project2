const mongoose=require("mongoose");
const Blog=require("../models/blog.js");

// const newId = new ObjectId();
const data = [

  {
    _id: "66221010e7483fb59c45823f",
    title: "Stand",
    slug: "sdit slug",
    published: "true",
    content: "This is a new sample blog content.",
    author: "New Author",
    tags: ["nnnnno", "tag"],
    created_at: new Date("2024-04-19T06:26:48.014Z"),
    country: "qq",
    updated_at: new Date("2024-04-23T16:26:01.540Z"),
    image: {
        url: "https://res.cloudinary.com/dgwl0ogtx/image/upload/v1713508368/NANS_DEV/lffqaybyosrfleqtz7cr.png",
        filename: "NANS_DEV/lffqaybyosrfleqtz7cr"
    },
    review: [],
    likeBy: ["66220e201f52d3981b5a064d"],
    owner: "66162e1b85010c000f5e5e60",
    __v: 95
}


];



    module.exports =data;