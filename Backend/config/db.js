import mongoose from "mongoose";

const connectDB = async(req,res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then(()=> {
            console.log("MongoDB connected Successfully");
        })
        .catch((error)=> {
            console.log("MongoDB connection error:",error);
        })
    } catch (error) {
        console.log("MongoDB connection error:",error);
    }
}


export default connectDB;