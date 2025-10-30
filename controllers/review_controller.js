const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.newReview=async(req,res)=>{//"/listings/:id/review"
    let {id}=req.params;
    let listing= await Listing.findById(id);
    let {rating,comment}=req.body;
    let re={rating,comment};
    let newReview=new Review(re);

    newReview.author=req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","new Review created");
    res.redirect(`/listings/${id}`);

};

module.exports.deleteReview=async(req,res)=>{//"/listings/:id/review"
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};