///using express router reconstruct the listing routes for better understanding
///first create the routes folder then create the diff routes files with there name


///due to same problem we cant require it


const express=require("express");
const router=express.Router();//method which helps to divided the large code into same diff routes which helps for understanding
const Listing=require("../models/listing.js");
const wrapAsync=require("../error/wrapAsync.js");
const ExpressError=require("../error/expressError.js");
const flash=require("connect-flash");
const {isLogin, isOwner}=require("../middlewares.js");

//this controller can dicide the code in another file to easy to edit
// require controllers for MVS Framwork (model,view,controller)
const listing_con=require("../controllers/listing_controller.js");


const multer  = require('multer'); ///for image uploadation
const {storage}=require("../cloud_config.js");
const upload = multer({storage});

//index route
router.get("/listings",listing_con.index);


//create new list/post
router.get("/listings/new",isLogin,listing_con.newListingform);
//add new listing
router.post("/listings",upload.single('image'),listing_con.addNewlisting);


// router.post("/listings",wrapAsync(async(req,res)=>{
//     let {title,description,image,price,location,country}=req.body;
//     let newlist={title,description,image,price,location,country};
//     const newlisting=new Listing(newlist);
//     await newlisting.save();
//     res.redirect("/listings");
// }));

//show detailes of perticular list
router.get("/listings/:id",listing_con.showSpecificInfo);



//editform for editing the post information
router.get("/listings/:id/edit",isLogin,isOwner,listing_con.editForm);//require isLogin middleware to check login

//update the information
router.put("/listings/:id",isOwner,upload.single('image'),listing_con.updateListing);
//delete the listing
router.delete("/listings/:id",isLogin,isOwner,listing_con.deleteListing);

module.exports=router;