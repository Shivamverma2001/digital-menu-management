import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";
import { env } from "~/env";

// Initialize SendGrid if API key is provided
if (env.SENDGRID_API_KEY) {
  sgMail.setApiKey(env.SENDGRID_API_KEY);
}

// Initialize Gmail SMTP if credentials are provided
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
  // Try Gmail SMTP first (most reliable for delivery)
  if (gmailTransporter && env.GMAIL_USER) {
    try {
      console.log(`[EMAIL] Using Gmail SMTP to send to: ${email}`);
      console.log(`[EMAIL] Using FROM: ${env.GMAIL_USER}`);
      
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
      
      console.log(`[EMAIL] Email sent successfully via Gmail SMTP`);
      return { success: true };
    } catch (error: any) {
      console.error("[EMAIL] Gmail SMTP error:", error);
      // Fall through to SendGrid
    }
  }

  // Fallback to SendGrid if Gmail not configured
  if (env.SENDGRID_API_KEY) {
    try {
      console.log(`[EMAIL] Using SendGrid to send to: ${email}`);
      console.log(`[EMAIL] Using FROM: ${env.EMAIL_FROM}`);
      
      if (!env.EMAIL_FROM) {
        throw new Error("EMAIL_FROM is required when using SendGrid");
      }
      
      const msg = {
        to: email,
        from: env.EMAIL_FROM,
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
      };

      await sgMail.send(msg);
      console.log(`[EMAIL] Email sent successfully via SendGrid`);
      return { success: true };
    } catch (error: any) {
      console.error("[EMAIL] SendGrid error:", error);
      const errorDetails = error?.response?.body || error?.message;
      console.error("[EMAIL] SendGrid error details:", JSON.stringify(errorDetails, null, 2));
      
      // Return error instead of falling back
      return { 
        success: false, 
        error: errorDetails?.errors?.[0]?.message || error?.message || "Failed to send email via SendGrid" 
      };
    }
  }
  // No email service configured
  console.error("[EMAIL] No email service configured (GMAIL_USER + GMAIL_APP_PASSWORD or SENDGRID_API_KEY required)");
  return { success: false, error: "No email service configured" };
}

