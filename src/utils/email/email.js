import sgMail from "@sendgrid/mail";
import { composeError } from "../error.js";

export async function emailService(to, subject, template) {
  try {
    // Always set the API key - simpler and more testable
    sgMail.setApiKey(process.env.TWILLIO_SECRET);
    
    await sgMail.send({
      to: to,
      from: "no-reply@payoo.io",
      subject: subject,
      html: template
    });
  } catch(error) {
    composeError("email service failed", 500);
  }
}