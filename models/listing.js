
//create a database models
const mongoose=require("mongoose");
const Review = require("./review.js");
const Schema=mongoose.Schema;

let listingschema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        filename: String,
        url: String,
    //     default:"https://unsplash.com/photos/a-large-swimming-pool-surrounded-by-palm-trees-_pPHgeHz1uk",
    //     set:(v)=>v === "" ? "https://unsplash.com/photos/a-large-swimming-pool-surrounded-by-palm-trees-_pPHgeHz1uk" :v,
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:
        {
            type:Schema.Types.ObjectId,
            ref:"User",
        },
});

listingschema.post("findOneAndDelete",async(Listing)=>{
    if(Listing)
    {
        await Review.deleteMany({_id:{$in:Listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingschema);

module.exports=Listing;