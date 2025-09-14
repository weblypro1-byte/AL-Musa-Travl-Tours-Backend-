import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("⚠️ Only POST requests allowed");
  }

  const { email } = req.body;

  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"AL MUSA Tours and Travel" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: "New Mail Received!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:500px; margin:auto; border:1px solid #eee; border-radius:10px; overflow:hidden;">
          <div style="background:#0077b6; padding:20px; text-align:center;">
           
            <h2 style="color:#fff; margin:10px 0;">AL MUSA Tours and Travel</h2>
          </div>
          <div style="padding:20px; color:#333; text-align:center;">
            <h3>🎉 New Client</h3>
            <p>A new user has sent an E-Mail.</p>
            <p style="font-size:16px; margin-top:10px;"><b>Email:</b> ${email}</p>
          </div>
          <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:14px; color:#555;">
            🚀 Developed with ❤️ by <b>WeblyPro</b>
          </div>
        </div>
      `,
     
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Subscription email sent!" });
  } catch (error) {
    console.error("❌ Error in subscribe route:", error);
    res.status(500).json({ success: false, message: "Failed to send subscription email" });
  }
}
