import { requireParams, requireQueryParameters } from "../../middlewares";
import { composeError } from "../../utils/error";

jest.mock('../../utils/error',()=>({
   composeError: jest.fn((message,code)=>({msg:message,statusCode:code}))
}));

describe("require params() middleware",()=>{
    let req;
    let res;
    let next;

    beforeEach(()=>{
        jest.clearAllMocks();
        req = {body:{},query:{}};
        res = {};
        next = jest.fn();
    })
    test("should call next middleware",()=>{
        const middleware = requireParams("email","password");
        req.body = {email:"test@email.com",password:"testpass1234"};
        middleware(req,res,next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(composeError).not.toHaveBeenCalled();
    });
    test("should call compose error",()=>{
        const middleware = requireParams("id","link","code");
        req.body = {link:"tryeis",code:"78890"};
        middleware(req,res,next);
        expect(next).toBeCalled();
        expect(composeError).toBeCalled();
    })

    test("should call next middleware",()=>{
        const middleware = requireQueryParameters("signed","code");
        req.query = {signed:"left-right",code:"sick"}
        middleware(req,res,next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(composeError).not.toHaveBeenCalled()

    });

    test("should call compose error ",()=>{
        const middleware = requireQueryParameters("signed","code");
        req.query = {signed:"left-right"}
        middleware(req,res,next);
        expect(next).toBeCalled();
        expect(composeError).toBeCalled()
        // expect(next).toHaveBeenCalledWith(expect.objectContaining({
        //     msg: 'missing request parameters',
        //     statusCode: 400,
        //   }));

    })
});


