const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {

  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"Test Auth Service" <${testAccount.user}>`,
    to,
    subject,
    text,
  });

  console.log('Email sent:', nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
