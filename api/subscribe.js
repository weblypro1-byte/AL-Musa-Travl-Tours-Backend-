import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import Cors from "cors";

// Initialize CORS
const cors = Cors({
  origin: "*", // you can restrict this later to your frontend domain
  methods: ["POST", "OPTIONS"],
});

// Helper to run middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Run CORS
  await runMiddleware(req, res, cors);

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "⚠️ Only POST requests allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
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
      subject: "New Subscription Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:500px; margin:auto; border:1px solid #eee; border-radius:10px; overflow:hidden;">
          <div style="background:#0077b6; padding:20px; text-align:center;">
            <h2 style="color:#fff; margin:10px 0;">AL MUSA Tours and Travel</h2>
          </div>
          <div style="padding:20px; color:#333; text-align:center;">
            <h3>🎉 New Subscriber</h3>
            <p>A new user has subscribed to your updates.</p>
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
