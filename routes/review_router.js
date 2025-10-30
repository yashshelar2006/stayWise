const express=require("express");
const router=express.Router({mergeParams:true});//method which helps to divided the large code into same diff routes which helps for understanding
const Listing=require("../models/listing.js");
const wrapAsync=require("../error/wrapAsync.js");
const ExpressError=require("../error/expressError.js");
const Review=require("../models/review.js");
const {isLogin, isReviewAuthor}=require("../middlewares.js");//require from middleware.js to check login 


//this controller can dicide the code in another file to easy to edit
// require controllers for MVS Framwork (model,view,controller)
const review_con=require("../controllers/review_controller.js");
//for review
router.post("/",isLogin,review_con.newReview);
// for deleting the review
router.delete("/:reviewId",isLogin,isReviewAuthor,review_con.deleteReview);
//isReviewAuthor is used to check while deleting the review ,only the onwer of this review can delete

module.exports=router;