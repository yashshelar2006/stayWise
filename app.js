if(process.env.NODE_ENV !="production")
{
require('dotenv').config(); ///for accessing the .env elements
}
// console.log(process.env.secret); 


const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const mogo_url="mongodb://127.0.0.1:27017/stayhome";
// const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./error/wrapAsync.js");
const ExpressError=require("./error/expressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');///for session store
const flash=require("connect-flash");


//review
const Review=require("./models/review.js");
const {reviewSchema}=require("./schema.js");///for validation not use in above code

//autontication
const passport=require("passport");
const localStarytegy =require("passport-local");
const User=require("./models/user.js");


///require the reconstructed routes 
const listing_router=require("./routes/listing_router.js");
const reviews_router=require("./routes/review_router.js");///require reviews routes
const user_router=require("./routes/user_router.js");//user authomtication routes
const Listing = require('./models/listing.js');


app.use(express.urlencoded({extends:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);///for ejs-meta
app.use(express.static(path.join(__dirname,"/public")));//adding style 
//mongoose connection


const mongoURL=process.env.ATLAST_URL;///get form mongoDB Atlet 
main()
.then(()=>{
    console.log("connect to DB")
})
.catch((err)=>{
    console.log(err);
}); 

async function main() {
    await mongoose.connect(mongoURL);
};

const session_store= MongoStore.create(
    {
        mongoUrl:mongoURL,
        crypto: {
            secret:process.env.SECRET,
        },
        touchAfter:24*3600,
    }
);

session_store.on("error",()=>{
    console.log("error in mongo session store",err);
});
const sessionOption={
                        store:session_store,
                        secret:process.env.SECRET,
                        resave:false,
                        saveUninitialized:true,
                        cookie:{
                            expires:Date.now()+7*24*60*60*1000,
                            maxAge:7*24*60*60*1000,
                        },
                        httpOnly:true, 
};

app.use(session(sessionOption));
app.use(flash());

// #authontication

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStarytegy(User.authenticate()));
passport.serializeUser(User.serializeUser());//to store the user info in session
passport.deserializeUser(User.deserializeUser());//to remove the user info from session


//local variables
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});


//all routes created in listing_router
app.use("/",listing_router);

//all the review routes are created in review_router file and require here
app.use("/listings/:id/review",reviews_router);
app.use("/",user_router);

app.post("/search",async(req,res)=>{
   const search_ele = req.body.search.toLowerCase();
   const results = await Listing.find({
   location: { $regex: search_ele, $options: "i" }
   });
  
  res.render("listings/search", { results, search_ele });
//   console.log(results);
});

/////first time add data

// app.get("/listingtest",(req,res)=>{
//     let samplelist=new Listing(
//         {
//             title:"New Building",
//             description:"Near the city center",
//             price:3000,
//             location:"kolhapur,maharashtra",
//             country:"India",
//         });
        
//         samplelist.save();
//         console.log("saved succ");
//         res.send("success");
// })

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"page not"));
// });
// app.use((err,req,res,next)=>{
//     let {status,message}=err;
//     res.status(status).send(message);
// });
app.listen(2006,()=>{
    console.log("sever listen on 2006 port"); 
});