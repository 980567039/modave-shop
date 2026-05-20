// import Order from '@/models/Order';
import nodemailer from 'nodemailer';

class EmailService {
  // ✅ 使用 Namecheap 邮箱 SMTP
  static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,                  // mail.yourdomain.com
    port: Number(process.env.SMTP_PORT) || 465,   // 465 SSL 或 587 TLS
    secure: process.env.SMTP_SECURE === 'true',   // true for 465, false for 587
    auth: {
      user: process.env.SMTP_EMAIL,               // 你的邮箱地址
      pass: process.env.SMTP_PASSWORD,           // 邮箱密码
    },
  });
  
  // ✅ 发送邮件方法
  static async sendEmail({ to, subject, html = '', text = '', attachments = [], userName = '', orderId }) {
    try {
      // 处理多个收件人
      const emailTo = Array.isArray(to) ? to.join(',') : to;

      // 发送邮件
      const info = await this.transporter.sendMail({
        from: `"Nuvie Clothing" <${process.env.SMTP_EMAIL}>`, // 发件人
        to: emailTo,
        subject,
        text,
        html,
        attachments,
      });

      // console.log('Email sent:', info.messageId);

      // 如果有 orderId，则标记订单已发送邮件
      // if (orderId) {
      //   await Order.updateOne(
      //     { _id: orderId },
      //     { $set: { emailSent: true } }
      //   );
      // }

      return {
        success: true,
        message: 'Email sent successfully',
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // ✅ 验证 SMTP 连接是否可用
  static async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('SMTP connection successful');
      return true;
    } catch (error) {
      console.error('SMTP Connection verification failed:', error);
      return false;
    }
  }
}

export default EmailService;