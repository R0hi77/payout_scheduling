import mongoose from "mongoose";

export async function DBconnector(){
    try{
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Database connected successfully");
    }catch(error){
        console.error("Database connection error",error.message)
        process.exit(1);
    }
};