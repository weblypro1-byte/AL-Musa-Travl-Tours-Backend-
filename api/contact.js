import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import Cors from "cors";

// Initialize CORS middleware
const cors = Cors({
  origin: "*",       // allow all origins (you can restrict later)
  methods: ["POST", "OPTIONS"],
});

// Helper to run middleware in Next/Vercel API
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Run CORS first
  await runMiddleware(req, res, cors);

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "⚠️ Only POST requests allowed" });
  }

  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"AL MUSA Tours and Travel" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: "New Contact Form Submission",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #eee; border-radius:10px; overflow:hidden;">
          <div style="background: #f38602; padding:20px; text-align:center;">
            <h2 style="color:#fff; margin:10px 0;">AL MUSA Tours and Travel</h2>
          </div>
          <div style="padding:20px; color:#333;">
            <h3>📌 New Contact Form Submission</h3>
            <p><b>Name:</b> ${firstName} ${lastName}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Phone:</b> ${phone || "N/A"}</p>
            <p><b>Message:</b></p>
            <blockquote style="background:rgba(18,18,18,0.07); padding:10px; border-left:4px solid rgb(255,104,4);">
              ${message}
            </blockquote>
          </div>
          <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:14px; color:#000;">
            <p>🚀 Developed with ❤️ by <b>WeblyPro</b></p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ success: false, message: "Email failed to send" });
  }
}
