import {composeError} from "../utils/error.js";

/**
 * @description
 * Middleware to check and validate request parameters before handling a request
 * @param  {...string} params 
 * @returns {RequestHandler}
 */

export function requireParams(...params){
    return (req, _res, next) => {
        params.forEach((param) => {
            if(req.body[param] == null){
                next( composeError("missing request parameters",400));
            }
        }
    );
    next();
    }
}

/**
 * @description
 * Middleware that checks and validates request query parameters before handling request
 * @param  {...any} queryParams 
 * @returns {requestHandler} 
 */

export function requireQueryParameters(...queryParams){
    return (req,_res,next) => {
        queryParams.forEach( (param) => {
            if(req.query[param] == null ){
                next(composeError("missing required parameters",400));
            }
        } );
        next();
    }
}

export function conditionals(handler, condition){
    if(Array.isArray(handler)){
        return handler.map((h) => conditionals(h,condition));
    }
    return (req,_res,next) => {
        if(condition(req))handler(req,_res,next);
        else next();
    };
}