import mongoose from "mongoose";
import { register } from "../../controllers/auth.js";
import User from "../../models/user.js";
import * as authUtils from "../../utils/auth.js";
import { emailService } from "../../utils/email/email.js";
import { accountVerificationTemplate } from "../../utils/email/templates/accountVerificationTemplate.js";

// Mock dependencies
jest.mock("../../models/user.js");
jest.mock("../../utils/auth.js");
jest.mock("../../utils/email/email.js");
jest.mock("../../utils/email/templates/accountVerificationTemplate.js");

describe("register middleware", () => {
  let mockReq;
  let mockRes;
  let mockNext;
  let mockUser;
  let registerMiddleware;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock request object
    mockReq = {
      body: {
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User"
      }
    };
    
    // Mock response object
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    
    mockNext = jest.fn();
    
    // Mock User model methods
    mockUser = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      otp: "123456",
      generateOTP: jest.fn(),
      save: jest.fn().mockResolvedValue(true),
      toObject: jest.fn().mockReturnValue({
        _id: "mockId123",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "hashedPassword123",
        otp: "123456"
      })
    };
    
    // Set up User model mock implementations
    User.findOne = jest.fn().mockResolvedValue(null); // No existing user by default
    User.mockImplementation(() => mockUser);
    
    // Mock auth utility functions
    authUtils.generateHash = jest.fn().mockReturnValue("hashedPassword123");
    authUtils.generateAccessToken = jest.fn().mockReturnValue("mockToken123");
    
    // Mock email service
    emailService.mockResolvedValue({});
    accountVerificationTemplate.mockReturnValue("<p>Verification template</p>");
    
    // Initialize middleware
    registerMiddleware = register();
  });

  test("should create a new user successfully", async () => {
    await registerMiddleware(mockReq, mockRes, mockNext);
    
    // Check that User.findOne was called to check for existing users
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    
    // Check that password was hashed
    expect(authUtils.generateHash).toHaveBeenCalledWith("password123");
    
    // Check that a new User was created with the request body
    expect(User).toHaveBeenCalledWith(mockReq.body);
    
    // Check that OTP was generated
    expect(mockUser.generateOTP).toHaveBeenCalled();
    
    // Check that the user was saved
    expect(mockUser.save).toHaveBeenCalled();
    
    // Check that verification email was sent
    expect(accountVerificationTemplate).toHaveBeenCalledWith("Test", "123456");
    expect(emailService).toHaveBeenCalledWith(
      "test@example.com", 
      "Payoo: Account Verification", 
      "<p>Verification template</p>"
    );
    
    // Check that token was generated
    expect(authUtils.generateAccessToken).toHaveBeenCalledWith(expect.objectContaining({
      _id: "mockId123",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com"
    }));
    
    // Check that the response was sent with status 201
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.send).toHaveBeenCalledWith({
      user: expect.not.objectContaining({ password: expect.any(String) }),
      token: "mockToken123"
    });
  });

  test("should return 400 if user with email already exists", async () => {
    // Mock an existing user
    User.findOne = jest.fn().mockResolvedValue({ email: "test@example.com" });
    
    await registerMiddleware(mockReq, mockRes, mockNext);
    
    // Check response
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: "user with email already exists"
    });
    
    // Verify that no user was created or saved
    expect(mockUser.save).not.toHaveBeenCalled();
    expect(emailService).not.toHaveBeenCalled();
  });

  test("should handle MongoDB duplicate key error (code 11000)", async () => {

    mockUser.save = jest.fn().mockRejectedValue({ code: 11000 });
    
    await registerMiddleware(mockReq, mockRes, mockNext);
    
    
    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: "user with email already exists"
    });
  });

  test("should handle general errors", async () => {

    mockUser.save = jest.fn().mockRejectedValue(new Error("Database error"));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    await registerMiddleware(mockReq, mockRes, mockNext);
    

    expect(consoleErrorSpy).toHaveBeenCalledWith("failed to create user account");
    
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: "failed to create user account"
    });
    
  
    consoleErrorSpy.mockRestore();
  });
});