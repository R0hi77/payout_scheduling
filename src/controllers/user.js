import User from "../models/user.js";
import { composeError } from "../utils/error.js";
import { emailService } from "../utils/email/email.js";





export const PatchTypes = {
    verifyOTP:{
        requiredParams:["otp","email"],
        handler: verifyOTP()
    },
    generateAndResendOTP:{
        requiredParams:["email"],
        handler: resendOTP()
    }
}

/**
 * @description
 * Middleware that returns a function that accepts the req object and compares it to the parameter passed
 * @param {string} patchType 
 * @returns {Function}
 */
export function isPatchType (patchType){
    return(req) => req.body.isPatchType === patchType;
}
/**
 * @description
 * Middleware than handles otp verifications
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns 
 */
export function verifyOTP() {
    return async function (req, res, next) {
        try {
            const { otp, email } = req.body;

            if (!otp || !email) {
                return next(composeError("missing request parameters", 400));
            }

            const currentUser = await User.findOne({ email: email.trim(), otp });

            if (!currentUser) {
                return res.status(400).send("invalid user");
            }

            const currentTime = new Date();

            if (currentTime > currentUser.otpExpires) {
                return res.status(400).send({ message: "OTP has expired" });
            }

            await User.updateOne(
                { email: email },
                { $set: { isAccountVerified: true } }
            );

            return res.status(200).send({ message: "user verified" });
        } catch (error) {
            console.error(`Failed to complete account registration. ${error.message}`);
            return res.status(500).send("internal server error");
        }
    };
}


/**
 * @description
 * Middleware to request otp resend
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns 
 */
export function resendOTP() {
    return async function (req, res, next) {
        try {
            const { email } = req.body;

            if (!email) {
                return next(composeError("email is required", 400));
            }

            const user = await User.findOne({ email: email.trim() });

            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }

            user.generateOTP();
            await user.save();

            await emailService(
                user.email,
                "Payoo: Request for OTP",
                accountVerificationTemplate(user.firstName, user.otp)
            );

            return res.status(200).send({ message: "otp sent" });
        } catch (error) {
            console.error(`Failed to resend OTP. ${error.message}`);
            return res.status(500).send("internal server error");
        }
    };
}
