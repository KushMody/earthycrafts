import { Resend } from "resend";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Ensure API key is present
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: "Server Configuration Error", details: "RESEND_API_KEY is not set in Vercel environment variables." });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable Parse Error:", err);
      return res.status(500).json({ error: "File Parsing Failed", details: err.message });
    }

    try {
      const getValue = (val) => Array.isArray(val) ? val[0] : val;

      const user_name = getValue(fields.user_name);
      const user_email = getValue(fields.user_email);
      const user_phone = getValue(fields.user_phone);
      const user_country = getValue(fields.user_country);
      const message = getValue(fields.message);

      if (!user_name || !user_email || !message) {
        return res.status(400).json({ error: "Missing Required Fields", details: "Name, Email, and Message are required." });
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
      <div style="font-family:'Forum',serif;color:#0c0c0c;max-width:600px;margin:auto;padding:20px;border:1px solid #efe7d2">
        <h2 style="color:#c29d59;border-bottom:1px solid #c29d59;padding-bottom:10px">New Custom Order Inquiry</h2>
        <p><strong>Name:</strong> ${user_name}</p>
        <p><strong>Email:</strong> ${user_email}</p>
        <p><strong>Phone:</strong> ${user_phone}</p>
        <p><strong>Country:</strong> ${user_country}</p>
        <div style="margin-top:20px;padding:15px;background:#f9f9f9;border-radius:8px">
          <strong>Request:</strong><br/>
          ${message}
        </div>
        <footer style="margin-top:30px;font-size:12px;color:#888">Sent from EarthyCrafts Studio Website</footer>
      </div>`;

      const { data, error } = await resend.emails.send({
        from: "EarthyCrafts <noreply@yourdomain.com>",
        to: "gamingbhai0710@gmail.com",
        subject: "EarthyCrafts Website Inquiry Form",
        html: htmlContent,
        attachments,
      });

      if (error) {
        console.error("Resend API Error:", error);
        return res.status(400).json({ error: "Email Service Error", details: error.message });
      }

      return res.status(200).json({ success: true, id: data.id });

    } catch (catchError) {
      console.error("Server Handler Error:", catchError);
      return res.status(500).json({ error: "Internal Server Error", details: catchError.message });
    }
  });
}
