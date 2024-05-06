import mongoose from "mongoose";

const url="mongodb://localhost:27017/chatApp";

export const connect=async ()=>{
  await mongoose.connect(url, {
    useNewUrlParser:true,
    useUnifiedTopology:true
  });
  console.log("Connected to mongoose");
}