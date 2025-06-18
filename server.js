require('dotenv').config(); // giữ nguyên nếu chạy local
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-emails', upload.fields([
  { name: 'excel', maxCount: 1 },
  { name: 'images', maxCount: 10 } // cho phép tối đa 10 ảnh, có thể tăng nếu muốn
]), async (req, res) => {
  const { subject, message } = req.body;
  const filePath = req.files['excel'][0].path;
  const imageFiles = req.files['images'] || [];

  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {
      if (!row.Email) continue;

      const mailOptions = {
        from: `"Marketing CTCP Van ShinYi" <${process.env.EMAIL_USER}>`,
        to: row.Email,
        subject,
        html: `<p>${message}</p>`,
        attachments: imageFiles.map(file => ({
          filename: file.originalname,
          path: file.path
        }))
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Sent to ${row.Email}`);
      await new Promise((r) => setTimeout(r, 1000)); // Delay tránh spam
    }

    res.send(`<h3>Gửi thành công tới ${data.length} khách hàng!</h3>`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Đã xảy ra lỗi khi gửi email.');
  } finally {
    fs.unlinkSync(filePath); // Xoá file Excel sau khi dùng
    imageFiles.forEach(file => fs.unlinkSync(file.path)); // Xoá file ảnh sau khi gửi xong
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
