const Review=require("../models/review");
const Blog=require("../models/blog");
module.exports.postReview= async (req,res)=>{

    let {review}=req.body;
    const item=await Blog.findById(req.params.id);
    // const sum=await Blog.findById()

    
    const reviewData=new Review({
        rating:review.rating,
        comment:review.comment,
    });
    reviewData.author=req.user._id;
    
    // console.log(reviewData +"review data"+item);
    // const _id=req.params.id;
    item.review.unshift(reviewData);
    // console.log(item);
    let info=await reviewData.save();
    let p=await item.save();
    // console.log(info);
    // console.log("its saved");
    req.flash("success","comment added!");
    res.redirect(`/blog/view/${req.params.id}`);

}

module.exports.deleteReview= async (req,res)=>{
    const {id,r_id}=req.params;
    
    await Blog.findByIdAndUpdate(id,{$pull :{review:r_id}});
    await Review.findByIdAndDelete(r_id);
    req.flash("success","comment deleted!");
    res.redirect(`/blog/view/${id}`);

};

