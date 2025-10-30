const User=require("../models/user");

module.exports.newUserSignup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newuser=new User({username,email});
    const registeruser= await User.register(newuser,password);
    console.log(registeruser);
    req.login(registeruser,(err)=>{///use to automatically login when user sigup 
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to StayFinder");
        res.redirect("/listings");
    });
    }catch (e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.userLogin=async(req,res)=>{
   req.flash("success","Welcome to StaySafe");
   let redirectUrl=res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);
};

module.exports.userLogout=(req,res)=>{
    req.logOut((err)=>{
       if(err){
            return next(err);
       } 
       req.flash("success","Logout Successfully");
       res.redirect("/listings");
    });
};