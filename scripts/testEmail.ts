import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 465,
  secure: true, // SSL/TLS
  auth: {
    user: 'nuvie@nuvie001.shop',
    pass: 'LIng0755**',
  },
});

async function sendTest() {
  try {
    const info = await transporter.sendMail({
      from: '"Nuvie Clothing" <nuvie@nuvie001.shop>',
      to: 'ling@example.com', // 收件人
      subject: '测试邮件',
      text: '这是测试邮件',
    });

    console.log('发送成功:', info);
  } catch (err) {
    console.error('发送失败:', err);
  }
}

sendTest();