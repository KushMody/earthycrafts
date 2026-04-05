import express from "express";
import { Resend } from "resend";
import dotenv from "dotenv";
import cors from "cors";
import formidable from "formidable";
import fs from "fs";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Use the API key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

// Handle the contact form submission (FormData)
app.post("/api/send-email", async (req, res) => {
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable Parse Error:", err);
      return res.status(500).json({ error: "File Parsing Failed" });
    }

    try {
      const getValue = (val) => Array.isArray(val) ? val[0] : val;
      const user_name = getValue(fields.user_name);
      const user_email = getValue(fields.user_email);
      const user_phone = getValue(fields.user_phone);
      const user_country = getValue(fields.user_country);
      const message = getValue(fields.message);

      if (!user_name || !user_email || !message) {
        return res.status(400).json({ error: "Missing Required Fields" });
      }

      const file = files.file;
      let attachments = [];

      if (file) {
        const fileObj = Array.isArray(file) ? file[0] : file;
        const fileBuffer = fs.readFileSync(fileObj.filepath);
        attachments.push({
          filename: fileObj.originalFilename,
          content: fileBuffer,
        });
      }

      const htmlContent = `
      <div style="font-family:sans-serif;color:#0c0c0c;max-width:600px;margin:auto;padding:20px;border:1px solid #efe7d2">
        <h2 style="color:#c29d59;border-bottom:1px solid #c29d59;padding-bottom:10px">New Contact Inquiry (Local)</h2>
        <p><strong>Name:</strong> ${user_name}</p>
        <p><strong>Email:</strong> ${user_email}</p>
        <p><strong>Phone:</strong> ${user_phone}</p>
        <p><strong>Country:</strong> ${user_country}</p>
        <div style="margin-top:20px;padding:15px;background:#f9f9f9;border-radius:8px">
          <strong>Message:</strong><br/>
          ${message}
        </div>
        <footer style="margin-top:30px;font-size:12px;color:#888">Sent via Local Dev Server</footer>
      </div>`;

      const { data, error } = await resend.emails.send({
        from: "EarthyCrafts <noreply@earthycrafts.com>",
        to: "gamingbhai0710@gmail.com",
        subject: "Website Contact Form - EarthyCrafts",
        html: htmlContent,
        attachments,
      });
      

      if (error) {
        console.error("Resend API Error:", error);
        return res.status(400).json({ error: error.message });
      }

      res.status(200).json({ success: true, id: data.id });
    } catch (catchError) {
      console.error("Server Handler Error:", catchError);
      res.status(500).json({ error: catchError.message });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
