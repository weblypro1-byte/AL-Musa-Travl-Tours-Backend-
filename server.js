const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // ✅ load .env variables

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check / simple text routes
app.get("/", (req, res) => {
  res.send("✅ Backend is running well!");
});

app.get("/contact", (req, res) => {
  res.send("📬 Contact route is ready to receive POST requests!");
});

app.get("/subscribe", (req, res) => {
  res.send("📧 Subscribe route is ready to receive POST requests!");
});

// POST route for contact form
app.post("/contact", async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // from .env
        pass: process.env.EMAIL_PASS, // from .env
      },
    });

    const mailOptions = {
        from: `"AL MUSA Tours and Travel" <${process.env.EMAIL_USER}>`,
        to: process.env.OWNER_EMAIL, // Owner’s email from .env
      subject: "New Contact Form Submission",
      html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #eee; border-radius:10px; overflow:hidden;">
        <div style="background: #f38602; padding:20px; text-align:center;">
          <img src="cid:brandLogo" alt="Logo" width="60" />
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
      attachments: [
        {
          filename: "logoo.png",
          path: path.join(__dirname, "logoo.png"),
          cid: "brandLogo",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ success: false, message: "Email failed to send" });
  }
});

// POST route for subscribe form
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // from .env
        pass: process.env.EMAIL_PASS, // from .env 
      },
    });

    const mailOptions = {
        from: `"AL MUSA Tours and Travel" <${process.env.EMAIL_USER}>`,
        to: process.env.OWNER_EMAIL, // Owner’s email from .env
      subject: "New Mail Received!",
      html: `
      <div style="font-family: Arial, sans-serif; max-width:500px; margin:auto; border:1px solid #eee; border-radius:10px; overflow:hidden;">
        <div style="background:#0077b6; padding:20px; text-align:center;">
          <img src="cid:brandLogo" alt="Logo" width="60" />
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
      attachments: [
        {
          filename: "logoo.png",
          path: path.join(__dirname, "logoo.png"),
          cid: "brandLogo",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Subscription email sent!" });
  } catch (error) {
    console.error("❌ Error in subscribe route:", error);
    res.status(500).json({ success: false, message: "Failed to send subscription email" });
  }
});

// Catch-all for invalid GET routes
app.use((req, res) => {
    res.status(404).send("⚠️ Route exists only for POST requests.");
  });
  

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
