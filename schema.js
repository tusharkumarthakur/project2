const joi=require('joi');
// const Blog=require('./models/blog.js');
const { title } = require('process');

module.exports.blogSchema=joi.object({
     listing:joi.object({
        title:joi.string().required().min(4).max(50),
        slug:joi.string().required().min(4).max(50),
        author:joi.string().required().min(4).max(50),
        tag:joi.string().required(),
        category:joi.string().required(),
        image:joi.string(),
        content:joi.string().required().min(1),
        country:joi.string().required().min(2).max(50),
        published:joi.string().required(),
        // blogContent:joi.allow(),

    }).required()   
});

module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().required(),
        comment:joi.string().required(),
        created_at:joi.date().default(Date.now)
    }).required()
})


module.exports.ediBlogSchema=joi.object({
     listing:joi.object({

        title:joi.string().min(4).max(50).required(),
        slug:joi.string().min(4).max(50).required(),
        author:joi.string().min(4).max(50).required(),
        country:joi.string().min(2).max(50).required(),
        content:joi.string().required().min(1),
        // rate:joi.string(),

    }).required()
});

module.exports.signInSchema=joi.object({

        username:joi.string().required().min(2).max(20),
        name:joi.string().required().min(1).max(50),
        email:joi.string().required(),
        password:joi.string().required(),
        image:joi.string(),


});