import sgMail from "@sendgrid/mail";
import { composeError } from "../error.js";

export async function emailService( to,subject,template){
    try { 
        if(!isApiKeySet){
        sgMail.setApiKey(process.env.TWILLIO_SECRET);
        isApiKeySet = true;}
     await sgMail.send({
        to: to,
        from: "no-reply@payoo.io",
        subject: subject,
        html: template
    });
    }catch(error){
        composeError("email service failed",500)
    }

}