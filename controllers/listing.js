const Blog=require("../models/blog");
const User=require("../models/user");
module.exports.index= async (req,res,next)=>{
    // console.log(req.user);
    const allData=await Blog.find({});
    allData.reverse();
    res.render("listings/home.ejs",{allData});
    
};

module.exports.renderNewForm=(req,res)=>{
    // console.log(curUser);
    // console.log(res.locals.curUser);
    res.render("listings/new.ejs");
};

module.exports.addingBlog=async (req,res,next)=>{
    
        const {listing}=req.body;
         let tags = listing.tag.split(/[ ,]+/); // Split by comma or space

        // Remove any empty strings or whitespace-only tags
        tags = tags.filter(tag => tag.trim() !== '');
        // console.log(tags);

        // console.log(listing);
        
        const newUser=new Blog({
        ...req.body.listing
    });
    const ownerPost=await User.findById(req.user._id);
    ownerPost.allBlogs.unshift(newUser._id);
    await ownerPost.save();

    // console.log(ownerPost);
    newUser.tags=tags;
    if(req.file) {
        // console.log("inside field");
         const url=req.file.path;
         const filename=req.file.filename;
         newUser.image={url,filename};
    
    }
    // console.log(listing);
    newUser.owner=req.user._id;
    await newUser.save()

    req.flash("success","New Blog Added!");
    res.redirect("/blog");
    
}

module.exports.searchBlog= async (req,res,next)=>{
    const word=req.query.search;
    // console.log(word);
    let user=await Blog.find({"title":{$regex: new RegExp(word, 'i')}});
    if(user.length==0){
        // console.log("nothing in title");
        user=await Blog.find({"content":{$regex: new RegExp(word, 'i')}});
    }
    // console.log("user search word =>",user);         
    res.render("listings/search",{allData:user,word});
};

module.exports.likeBlog=async (req,res,next)=>{
    const {id}=req.params;
    const user=await Blog.findById(id);
    console.log(user);
    const userId=req.user._id;
    if(user.likeBy.includes(userId)){
        user.likeBy.remove(userId);
        
    }else{
    // console.log(userId);
    // const user=await Blog.findById(id);
    user.likeBy.push(userId);
    }
    await user.save();
    res.redirect(`/blog/view/${id}`);

};


module.exports.showBlog=async (req,res)=>{
    
    const {id}=req.params;
    const user=await Blog.findById(id).populate({path:"review",populate:{
        path:"author",
    }}).populate("owner");

    if(!user){
        req.flash("failure","The blog you trying to find does not exist!");
        res.redirect("/");
    }
    // console.log(user);
    // console.log(user.review[0].author.image.url);
    res.render("listings/info",{user});
};

module.exports.changeImage=async (req,res)=>{
    // console.log(req.file);
    const url=req.file.path;
    const filename=req.file.filename;
    // console.log(url+" == "+filename);
const {id}=req.params;

const user=await Blog.findById(id);
user.image={url,filename};
user.save();
// user.image.filename=filename;
req.flash("success","Image changed!");
res.redirect('back');

};


module.exports.publishBlog= async (req,res)=>{

    const value=req.body;
    const {id}=req.params;
    if(value.off==="false"){

    const user = await Blog.findByIdAndUpdate(id, { "published": "false" }, { runValidators: true });

    }else{
        const user = await Blog.findByIdAndUpdate(id, { "published": "true" }, { runValidators: true });
    }
    res.redirect('back');
}


module.exports.editBlog=async (req,res)=>{

    const {id}=req.params;
    // console.log(id);
   
    const user=await Blog.findById(id).populate("owner");
    
    // console.log
    if(!user){
        req.flash("failure","The blog you trying to find does not exist!");
        res.redirect("/blog");
    }
    

    res.render("listings/edit.ejs",{user});

};

module.exports.editPostBlog= async (req,res)=>{
    const {listing}=req.body;

    const {id}=req.params;
    
    const data= await Blog.findById(id);
    
    // console.log(listing);

    await Blog.findByIdAndUpdate(id,{...listing,updated_at:Date.now()},{runValidators:true});
    
    req.flash("success","Blog Edited!");
    
    res.redirect(`/blog/view/${id}`);

};

module.exports.deleteBlog=async (req,res)=>{
    
    const {id}=req.params;
    await User.findByIdAndUpdate(req.params.u_id,{$pull:{allBlogs:req.params.id}});
    await Blog.findByIdAndDelete(id);

    req.flash("success","Blog deleted!");
    
    res.redirect("/blog");
}