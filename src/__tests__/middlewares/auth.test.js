import { tokenExpired, tokenValidity } from "../../utils/auth";
import { verifyTokens } from "../../middlewares/auth";
import { composeError } from "../../utils/error";

jest.mock("../../utils/auth");
jest.mock("../../utils/error");

describe("verifyToken", () => {
  let mockReq;
  let mockRes;
  let mockNext;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { headers: {} };
    mockRes = {};
    mockNext = jest.fn();
    composeError.mockImplementation((message, code) => ({ msg: message, statusCode: code }));
  });
  
  test("should call next", async () => {
    const token = "12334ksdvskersdv";
    mockReq.headers.authorization = `Bearer ${token}`;
    
    // Setup mock return values
    tokenExpired.mockReturnValue(false);
    tokenValidity.mockReturnValue({ user_id: "123455" });
    
    const middleware = verifyTokens();
    await middleware(mockReq, mockRes, mockNext);
    
    // Verify the mocks were called with the correct arguments
    expect(tokenExpired).toHaveBeenCalledWith(token);
    expect(tokenValidity).toHaveBeenCalledWith(token);
    
    // Check that next was called once
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
