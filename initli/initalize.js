
const mongoose=require("mongoose");
const mogo_url="mongodb://127.0.0.1:27017/stayhome";
const Listing=require("../models/listing.js");
const initdata=require("./sampdata.js");


//mongoose connection
main()
.then(()=>{
    console.log("connect to DB")
})
.catch((err)=>{
    console.log(err);
}); 

async function main() {
    await mongoose.connect(mogo_url);
}

const initDB=async()=>{
    await Listing.deleteMany({});///deleting existing data
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"68e3b2bbc517d3c81017a333",}));
    await Listing.insertMany(initdata.data);///insert the new data
    console.log("data was initalized");
};
initDB();