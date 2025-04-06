import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * @description
 * utility function that generates password hashes
 * @param {*} password 
 * @returns {hashedPassword} 
 */
export async function generateHash(password){
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

/**
 * @description
 * utility that returns true when a password and it has matches
 * @param {*} password 
 * @param {*} hashedPassword 
 * @returns {Boolean}
 */
export async function compareHash(password, hashedPassword){
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};

/**
 * @description
 * utility function that generates access tokens
 * @param {object} user 
 * @returns {object}
 */
export function generateAccessToken(user){
    return jwt.sign(
        {email:user.email.trim(),
        userId: user._id},
        process.env.JWT_SECRET_KEY,
        {expiresIn: "30m"}
    );
}

/**
 * @description
 * utility that  generate refresh tokens
 * @param {String} user_id
 * @returns {String}
 */
export function generateRefreshToken(user_id){
    if(!user_id){
        return null;
    }
    return jwt.sign(
        {userId:user_id.trim()},
        process.env.JWT_SECRET_KEY,
        {expiresIn:"6d"}
    );
}

/**
 * @description
 * utility to check if token has expired 
 * @param {object} token 
 * @returns {Boolean} 
 */
export function tokenExpired(token){
    try{
        const decodedToken = jwt.decode(token,process.env.JWT_SECRET_KEY);
        if(!decodedToken || !decodedToken.exp){
            return true;
        }
        const currentTime = Math.floor(Date.now()/1000);
        return decodedToken.exp < currentTime;    
    }catch(error){
        return false;
    }
}

/**
 * @description
 * utility that checks if token is valid
 * @param {object} token 
 * @returns {boolean}
 */
export function tokenValidity(token){
    try{
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    }catch(error){
        return null;
    }
    
}