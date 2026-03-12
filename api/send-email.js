import { Resend } from "resend";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // required for file uploads
  },
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "File parsing error" });
    }

    try {
      // Formidable fields are usually arrays or objects depending on version
      // Normalizing for consistency
      const getValue = (val) => Array.isArray(val) ? val[0] : val;

      const user_name = getValue(fields.user_name);
      const user_email = getValue(fields.user_email);
      const user_phone = getValue(fields.user_phone);
      const user_country = getValue(fields.user_country);
      const message = getValue(fields.message);

      const file = files.file;
      let attachments = [];

      if (file) {
        // Handle both single and multiple (though UI is single)
        const fileObj = Array.isArray(file) ? file[0] : file;
        const fileBuffer = fs.readFileSync(fileObj.filepath);

        attachments.push({
          filename: fileObj.originalFilename,
          content: fileBuffer,
        });
      }

      const htmlContent = `
      <div style="font-family:'Forum',serif;color:#0c0c0c;max-width:600px;margin:auto;padding:20px;border:1px solid #efe7d2">
      
      <h2 style="color:#c29d59;border-bottom:1px solid #c29d59;padding-bottom:10px">
      New Custom Order Inquiry
      </h2>

      <p><strong>Name:</strong> ${user_name}</p>
      <p><strong>Email:</strong> ${user_email}</p>
      <p><strong>Phone:</strong> ${user_phone}</p>
      <p><strong>Country:</strong> ${user_country}</p>

      <div style="margin-top:20px;padding:15px;background:#f9f9f9;border-radius:8px">
      <strong>Request:</strong><br/>
      ${message}
      </div>

      <footer style="margin-top:30px;font-size:12px;color:#888">
      Sent from EarthyCrafts Studio Website
      </footer>

      </div>
      `;

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "kushmody0710@gmail.com",
        subject: "EarthyCrafts Custom Order Request",
        html: htmlContent,
        attachments,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Email failed", details: error.message });
    }
  });
}
