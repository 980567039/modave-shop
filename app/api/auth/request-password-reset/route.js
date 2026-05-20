
import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = Date.now() + 3600000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpires;
        await user.save();

        const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:5200'}/reset-password?token=${resetToken}`;

        // Try to send email
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_EMAIL,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.SMTP_EMAIL,
                to: user.email,
                subject: 'Password Reset Request',
                text: `You requested a password reset. Please click on the following link to reset your password: ${resetUrl}`,
                html: `<p>You requested a password reset.</p><p>Please click on the following link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
            };

            await transporter.sendMail(mailOptions);
            return NextResponse.json({ message: "Password reset email sent" }, { status: 200 });
        } catch (emailError) {
            console.error("Failed to send email:", emailError);
            // Log the reset URL to console for testing purposes
            console.log("=== Reset URL (for manual testing) ===");
            console.log(resetUrl);
            console.log("======================================");
            return NextResponse.json({ 
                message: "Password reset initiated. Email sending failed, check server logs for reset link.", 
                resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined 
            }, { status: 200 });
        }

    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: "Internal server error", message: error.message }, { status: 500 });
    }
}
