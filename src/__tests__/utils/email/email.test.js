import { composeError } from "../../../utils/error";
import { emailService } from "../../../utils/email/email";

jest.mock("../../../utils/error");
jest.mock("@sendgrid/mail", () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue({})
}));

import sgMail from "@sendgrid/mail";

describe("emailService", () => {
  const to = "pyawinbe@gmail.com";
  const subject = "Test email";
  const template = '<p>email sent</p>';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TWILLIO_SECRET = "testkey";
    composeError.mockImplementation((message, code) => ({"msg": message, "statusCode": code}));
  });

  test("should send email successfully", async () => {
    await emailService(to, subject, template);
    
    expect(sgMail.setApiKey).toHaveBeenCalledWith("testkey");
    expect(sgMail.send).toHaveBeenCalledWith({
      to: to,
      from: "no-reply@payoo.io",
      subject: subject,
      html: template
    });
    expect(composeError).not.toHaveBeenCalled();
  });

  test("should call composeError when email sending fails", async () => {
    sgMail.send.mockRejectedValueOnce(new Error("Email sending failed"));
    
    await emailService(to, subject, template);
    
    expect(sgMail.send).toHaveBeenCalledTimes(1);
    expect(composeError).toHaveBeenCalledWith("email service failed", 500);
  });
});