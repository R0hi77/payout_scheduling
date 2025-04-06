import { composeError } from "../utils/error.js";
import { tokenExpired, tokenValidity } from "../utils/auth.js";

/**
 * @description
 * middleware for validating user request headers
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

export function verifyTokens() {
    return async function (req, res, next) {
        try {
            const authHeader = req.headers?.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return next(composeError("Invalid or missing authorization token", 401));
            }

            const token = authHeader.replace(/Bearer\s/i, "");

            if (tokenExpired(token)) {
                return next(composeError("Token expired. Unauthorized", 401));
            }

            const userDetails = tokenValidity(token);

            if (!userDetails) {
                return next(composeError("Invalid user token", 401));
            }

            req.user = userDetails;
            next();
        } catch (err) {
            next(composeError("An error occurred during token verification", 500));
        }
    };
}


