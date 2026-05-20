// 发送邮件接口,支持发送各类通知邮件并记录活动日志
// pages/api/getYoutubeVideos.js
import { generateEmailTemplate } from '@/lib/emailTemplates/emailTemplate';
import ActivityLogs from '@/models/ActivityLogs';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import nodemailer from 'nodemailer';

// Function to handle GET request
export async function POST(req, res) {
    const session = await getServerSession();

    const { to, subject, text, purpose, requestBy, emailType } = await req.json();

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {

        // Send mail with defined transport object
        const sendMail = await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to: 'chathurangacpm@gmail.com',
            subject,
            text,
            html: '',
        });




        if (purpose && purpose !== "IGNORE_ACTIVITY") {
            await ActivityLogs.create({
                userId: requestBy || '',
                activityType: "Mail send",
                activityDetails: purpose || `Mail send`,
                endpoint: req.url || '',
                method: "POST",
            });
        }

        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 400 });
    }

}