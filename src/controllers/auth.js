import User from "../models/user.js";
import { generateAccessToken, generateHash } from "../utils/auth.js";
import { emailService } from "../utils/email/email.js";
import { accountVerificationTemplate } from "../utils/email/templates/accountVerificationTemplate.js";

/**
 * @description
 * Middleware to handle user registeration
 * @param {object} req
 * @param {object} res  
 * @param {object} next 
 */
export function register() {
    return async (req, res, next) => {
      try {
        const existingUser = await User.findOne({email: req.body.email});
        if(existingUser) {
          return res.status(400).send({"message": "user with email already exists"})
        }
        
        req.body.password = generateHash(req.body.password);
        const newUser = new User(req.body);
        newUser.generateOTP();
        await newUser.save();
        
        const template = accountVerificationTemplate(newUser.firstName, newUser.otp);
        await emailService(newUser.email, "Payoo: Account Verification", template)
        
        const userObject = newUser.toObject();
        delete userObject.password;
        const authToken = generateAccessToken(userObject);
        
        return res.status(201).send({
          "user": userObject,
          "token": authToken
        });
      } catch(error) {
        if(error.code === 11000) {
          return res.status(409).send({"message": "user with email already exists"});
        }
        console.error("failed to create user account");
        return res.status(500).send({"message": "failed to create user account"})
      }
    };
  }



