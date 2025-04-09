import { composeError } from "../../utils/error.js"

describe("composeError()", ()=>{
    test("should return error object containing error message and error code",() =>{
        const errorMessage = "failed to make request";
        const errorCode = 400;
        const error = composeError(errorMessage,errorCode);

        expect(composeError(error)).toBeInstanceOf(Error);
        expect(error.message).toBe(errorMessage);
        expect(error.statusCode).toBe(errorCode);
    });
    test("should return different errors for different cases",()=> {
        const error1 = composeError("first error",500);
        const error2 = composeError("second error",400);
        expect(error1).not.toBe(error2);
    })
})