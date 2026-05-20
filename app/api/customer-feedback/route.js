// 处理客户反馈,发送邮件通知并保存反馈记录
// pages/api/getYoutubeVideos.js
import ActivityLogs from '@/models/ActivityLogs';
import CustomerFeedback from '@/models/CustomerFeedback';
import User from '@/models/User';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import nodemailer from 'nodemailer';

// Function to handle GET request
export async function POST(req, res) {
    const session = await getServerSession();

    const { from, title, text, requestBy, type } = await req.json();

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        // Send mail with defined transport object
        await transporter.sendMail({
            from,
            to: process.env.SUPER_ADMIN_URL,
            subject: title,
            text,
        });

        await CustomerFeedback.create({
            userId: requestBy || '',
            title,
            type,
            context: text,
        });

        return NextResponse.json({ message: 'Success' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 400 });
    }
}