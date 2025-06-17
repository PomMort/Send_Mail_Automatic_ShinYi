require('dotenv').config(); // giữ nguyên nếu chạy local
const nodemailer = require('nodemailer');
const readExcel = require('./utils/readExcel');

const emailList = readExcel('danhsach.xlsx');

// Cấu hình Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendEmails() {
    for (const person of emailList) {
        const mailOptions = {
            from: `"Marketing CTCP Van ShinYi" <${process.env.EMAIL_USER}>`,
            to: person.Email,
            subject: 'Chào bạn!',
            html: `<h3>Xin chào ${person.Name || 'bạn'},</h3><p>Đây là email tự động.</p>`
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`✅ Sent to ${person.Email} - ${info.messageId}`);
        } catch (error) {
            console.error(`❌ Failed to send to ${person.Email}: ${error.message}`);
        }

        await new Promise(r => setTimeout(r, 1000)); // Delay 1s để tránh bị Gmail chặn
    }
}

sendEmails();
