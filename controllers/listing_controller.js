const Listing=require("../models/listing.js");
const {isLogin, isOwner}=require("../middlewares.js");

module.exports.index=async(req,res)=>{
    const alldata=await Listing.find();
    res.render("listings/index.ejs" ,{alldata});
};

module.exports.newListingform=(req,res)=>{//require isLogin middleware to check login 
    res.render("listings/newpost.ejs");
};

module.exports.addNewlisting=async(req,res,next)=>{
    let url=req.file.path;//image url
    let filename=req.file.filename;
    let {title,description,image,price,location,country}=req.body;
    let newlist={title,description,image,price,location,country};
    const newlisting=new Listing(newlist);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","new Listing created");
    res.redirect("/listings");
};

module.exports.showSpecificInfo=async(req,res)=>{
    let {id}=req.params;
    let specificdata=await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if(!specificdata)
    {
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{specificdata});
};

module.exports.editForm=async(req,res)=>{ 
    let {id}=req.params;
    let editdata= await Listing.findById(id);
     if(!editdata)
    {
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listings");
    }
    let original_image=editdata.image.url;
    original_image=original_image.replace("/upload","/upload/h_250,w_250");
    res.render("listings/edit.ejs",{editdata,original_image});
};

module.exports.updateListing=async(req,res)=>{
     let {id}=req.params;
     let {title,description,image,price,location,country}=req.body;
     let newlist={title,description,image,price,location,country};
     let updatedata=await Listing.findByIdAndUpdate(id,newlist);

    if(typeof req.file !=="undefined"){
     let url=req.file.path;//image url
     let filename=req.file.filename;
     updatedata.image={url};
     await updatedata.save();
    }
     req.flash("success","Listing updated");
     res.redirect(`/listings/${id}`);

};

module.exports.deleteListing=async(req,res)=>{//require isLogin middleware to check login 
    let {id}=req.params;
    const deletedata= await Listing.findByIdAndDelete(id);
    console.log(deletedata);
    req.flash("success","Listing Deleted");
    res.redirect("/listings")
};