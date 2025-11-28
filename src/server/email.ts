import nodemailer from "nodemailer";
import { env } from "~/env";

// Initialize Gmail SMTP
let gmailTransporter: nodemailer.Transporter | null = null;
if (env.GMAIL_USER && env.GMAIL_APP_PASSWORD) {
  gmailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.GMAIL_USER,
      pass: env.GMAIL_APP_PASSWORD,
    },
  });
}

export async function sendVerificationCode(email: string, code: string) {
  if (!gmailTransporter || !env.GMAIL_USER) {
    return { 
      success: false, 
      error: "Email service not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables." 
    };
  }

  try {
    await gmailTransporter.sendMail({
      from: env.GMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verification Code</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });
    
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      error: error?.message || "Failed to send email" 
    };
  }
}

