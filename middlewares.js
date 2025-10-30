const Listing = require("./models/listing");
const Review=require("./models/review.js");

module.exports.isLogin=(req,res,next)=>{
    if(!req.isAuthenticated()){//authentication for checking login
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Login to Edit the Information");
        return res.redirect("/login");
    };
    next();
};

module.exports.afterLoginRedirect=(req,res,next)=>{///when ew login in specific router then after login redirect in same route

    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    };
    next();
};

module.exports.isOwner=async(req,res,next)=>{///for extra authorization it check theoriginal owner to edit,update,delete the listing

    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id))
    {
        req.flash("error","You Don't have permission, You not a Owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id))
    {
         req.flash("error","You Don't have permission, You not a Author");
        return res.redirect(`/listings/${id}`);
    }
    next();
}