const express=require("express");
const User = require("../models/user");
const passport = require("passport");
const router=express.Router();
const {afterLoginRedirect}=require("../middlewares.js")


///render signup form
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

const user_con=require("../controllers/user_controller.js");

//new user signup
router.post("/signup",user_con.newUserSignup);

//render login form
router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});

//user login 
router.post("/login",afterLoginRedirect,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),user_con.userLogin);


//user logout
router.get("/logout",user_con.userLogout);
module.exports=router;