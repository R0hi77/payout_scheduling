import mongoose  from "mongoose";

const userschema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isPhoneVerified: {
        type:Boolean,
        default: false,
    },
    isAccountVerified:{
        type: Boolean,
        default: false,
    },
    otp:{
        type: String,
        required: false,
    },
    otpExpires:{
        type: Date,
        required: false,
    },
    refreshToken:{
        type: String,
        required: false
    }
},
{timestamps: true});

const TEN_MINUTES = 1000*60*10;

userschema.methods.generateOTP = function(){
 this.otp = Math.floor(Math.random()*1000000);
 this.otpExpires = new Date.now() + TEN_MINUTES;
};

export default mongoose.model("User", userschema);