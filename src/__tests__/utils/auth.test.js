import { compareHash, generateAccessToken, generateHash, generateRefreshToken, tokenExpired, tokenValidity } from "../../utils/auth"
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config({path:'.env.test'});

describe("auth utility",() => {

    describe("generateHash()", () => {
        test("should return hashed version of string",async ()=>{
            const hashedPassword = await generateHash("waitnowhere");
            expect(hashedPassword).toMatch('$2b$');
        });
        
        test("should return string", async ()=>{
            const hashedPassword = await generateHash("testp12!assworD");
            expect(typeof hashedPassword).toBe('string'); 
        });
    });

    describe("compareHash()",() => {
        test("should return true if password and hash match",async () => {
            const password = "sick0mod3";
            const salt =await bcrypt.genSalt();
            const hash = await bcrypt.hash(password, salt);
            const isMatch = await compareHash(password,hash);

            expect(isMatch).toBe(true);
        })
    });

    describe("generateAccessToken()",()=>{
        test("should return jwt valid token",()=>{
            const user ={
                "email":"user@example.com",
                "_id": "12344567788",
            };
            const token = generateAccessToken(user);
            expect(typeof token).toBe('string');
        })
    });

    describe("generateRefreshToken()",()=>{
        test("should return null ",()=>{
            expect(generateRefreshToken("")).toBe(null);
        });
        test("should return jwt token",()=>{
            const user_id = "123456789";
            expect(typeof generateRefreshToken(user_id) ).toBe('string')
        })
    
    describe("tokenExpired()",()=>{
        test("should return true",()=>{
            expect(tokenExpired("")).toBe(true);
        })
    });

    describe("tokenValidity()",()=>{
        test("should return null",()=>{
            expect(tokenValidity()).toBe(null);
        })
    })
        
    })
})