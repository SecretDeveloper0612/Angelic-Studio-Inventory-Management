import nodemailer from "nodemailer";
import { Product } from "../types/product";

/**
 * Professional Google SMTP Integration
 * Sends alerts using Gmail App Password
 */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendLowStockNotification(product: Product): Promise<void> {
  const { name, quantity, minStock, supplier } = product;
  const managerEmail = process.env.MANAGER_EMAIL;
  
  if (!managerEmail || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email configuration missing. Check .env.local variables.");
    return;
  }

  const subject = `Low Stock Alert 🚨: ${name}`;
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; border: 1px solid #fce7f3; overflow: hidden; border-radius: 24px; background: white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
      <div style="background: linear-gradient(to right, #ec4899, #db2777); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">Low Stock Alert 🚨</h1>
        <p style="color: #fce7f3; margin-top: 10px; font-weight: bold; opacity: 0.9;">ANGELIC STUDIO INVENTORY REGISTRY</p>
      </div>
      
      <div style="padding: 40px;">
        <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 30px;">The following product has dropped below its safe threshold and requires immediate replenishment:</p>
        
        <div style="background: #fdf2f8; border-radius: 16px; padding: 24px; border: 1px solid #fbcfe8;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #9d174d; font-weight: bold; text-transform: uppercase; font-size: 10px; border-bottom: 1px solid #fecaca;">Product Name</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #fecaca; text-align: right; font-weight: 800; color: #1e293b;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9d174d; font-weight: bold; text-transform: uppercase; font-size: 10px; border-bottom: 1px solid #fecaca;">Current Stock</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #fecaca; text-align: right; font-weight: 800; color: #ef4444; font-size: 18px;">${quantity} UNITS</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9d174d; font-weight: bold; text-transform: uppercase; font-size: 10px; border-bottom: 1px solid #fecaca;">Safety Threshold</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #fecaca; text-align: right; font-weight: 800; color: #1e293b;">${minStock} UNITS</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9d174d; font-weight: bold; text-transform: uppercase; font-size: 10px;">Preferred Supplier</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 800; color: #1e293b;">${supplier || "Not specified"}</td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 40px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}/inventory" style="background: #1e293b; color: white; padding: 18px 30px; border-radius: 14px; text-decoration: none; font-weight: 800; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Update Registry Now</a>
        </div>
      </div>

      <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
        <p style="font-size: 10px; color: #94a3b8; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Automated Security Notification | Do not reply</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Angelic Studio Registry" <${process.env.EMAIL_USER}>`,
      to: managerEmail,
      subject,
      html,
    });
    console.log(`Professional Stock Alert sent for: ${name}`);
  } catch (error) {
    console.error("Critical: Failed to deliver stock alert email:", error);
  }
}
