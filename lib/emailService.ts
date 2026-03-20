import { Product } from "../types/product";

/**
 * Handle Automatic Low Stock Email Notifications
 * Trigger when quantity <= minimum stock
 * Use Nodemailer or similar SMTP service
 */

export async function sendLowStockNotification(product: Product): Promise<void> {
  const { name, quantity, minStock, supplier } = product;
  const managerEmail = process.env.MANAGER_EMAIL;
  
  if (!managerEmail) {
    console.error("MANAGER_EMAIL not found in environment variables");
    return;
  }

  const subject = `Low Stock Alert 🚨: ${name}`;
  
  const text = `
    Low Stock Alert 🚨

    Product Name: ${name}
    Current Quantity: ${quantity}
    Minimum Level: ${minStock}
    Preferred Supplier: ${supplier}

    Action Required: Please refill inventory soon.
  `;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #f3e8ff; padding: 24px; border-radius: 12px; background: #fffafb;">
      <h1 style="color: #f472b6; border-bottom: 2px solid #f9fafb; padding-bottom: 12px;">Low Stock Alert 🚨</h1>
      <p style="font-size: 16px; color: #475569;">The following product is reaching its minimum stock level:</p>
      
      <div style="background: white; border-radius: 8px; padding: 16px; border: 1px solid #fdf2f8;">
        <p><strong>Product:</strong> ${name}</p>
        <p><strong>Current Stock:</strong> <span style="color: #ef4444; font-weight: bold;">${quantity}</span></p>
        <p><strong>Required Threshold:</strong> ${minStock}</p>
        <p><strong>Supplier:</strong> ${supplier}</p>
      </div>

      <p style="margin-top: 24px; color: #7c3aed; font-weight: bold;">Action Required: Refill Inventory</p>
      <footer style="margin-top: 24px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f9fafb; padding-top: 12px;">
        Angelic Beauty & Wellness Studio | Automated Management System
      </footer>
    </div>
  `;

  try {
    console.log(`Sending professional alert for ${name} using Nodemailer placeholder...`);
    // Example: await transporter.sendMail({ from: process.env.EMAIL_USER, to: managerEmail, subject, text, html });
  } catch (error) {
    console.error("Nodemailer error sending alert:", error);
  }
}
