export const accountVerificationTemplate = (user, otp) => { 
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your [Your Company Name] Code</title>
    <style>
        /* --- Brand Colors (REPLACE THESE) --- */
        :root {
            --brand-primary: #007bff; /* Example: Vibrant Blue */
            --brand-secondary: #e9ecef; /* Example: Light Grey */
            --text-dark: #1a2a4a;      /* Example: Dark Blue/Black */
            --text-light: #ffffff;
            --text-muted: #6c757d;
            --warning-red: #dc3545;
        }
        /* --- Base Styles --- */
        body { font-family: Arial, sans-serif; line-height: 1.5; color: var(--text-dark); margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 480px; /* Smaller width for conciseness */ margin: 20px auto; background-color: var(--text-light); padding: 25px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-top: 5px solid var(--brand-primary); /* Color Accent */ }
        .header { text-align: center; margin-bottom: 20px; }
        .header img { max-width: 120px; height: auto; } /* Slightly smaller logo */
        .content h1 { color: var(--brand-primary); font-size: 22px; margin-bottom: 15px; text-align: center; }
        .content p { margin-bottom: 15px; font-size: 15px; text-align: center; }
        /* --- OTP Section --- */
        .otp-container { text-align: center; margin: 25px 0; padding: 20px 15px; background-color: var(--brand-secondary); border-radius: 5px; }
        .otp-label { font-size: 14px; color: var(--text-muted); margin-bottom: 10px; display: block; }
        .otp-code { font-size: 36px; font-weight: bold; color: var(--brand-primary); letter-spacing: 6px; margin-bottom: 10px; display: block; }
        .otp-expires { font-size: 13px; color: var(--text-muted); }
        /* --- Warning & Footer --- */
        .warning { font-weight: bold; color: var(--warning-red); text-align: center; font-size: 14px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 25px; font-size: 12px; color: var(--text-muted); }
        .footer p { margin: 5px 0; }
        .footer a { color: var(--brand-primary); text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="[Link to Your Company Logo]" alt="[ Payoo ] Logo">
        </div>
        <div class="content">
            <h1>Your Verification Code</h1>
            <p>Hi ${user}, enter the code below to securely complete your sign-up for Payoo.</p>
        </div>

        <div class="otp-container">
            <span class="otp-label">Your One-Time Password:</span>
            <span class="otp-code">${otp}</span>
            <span class="otp-expires">This code expires in <strong>10 minutes</strong>.</span>
        </div>

        <p class="warning">🚨 Never share this code with anyone!</p>

        <div class="footer">
            <p>If you didn't request this, please ignore this email.</p>
            <p>Need help? <a href="[Link to Help Center/Support]">Contact Support</a></p>
            <p>&copy; 2025 Payoo</p>
            </div>
    </div>
</body>
</html>`
}