// import React from 'react'
// import nodemailer from "nodemailer";

// export default async function sendMail({ to, name, subject, body }) {
//     const { SMTP_PASSWORD, SMTP_EMAIL } = process.env;
//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: SMTP_EMAIL,
//             pass: SMTP_PASSWORD
//         }
//     })

//     try {
//         const transporterTest = await transporter.verify();
//         console.log(transporterTest);
//     } catch (error) {
//         console.log(error);
//     }

//     try {
//         const send = await transporter.sendMail({
//             from: SMTP_EMAIL,
//             to: "cpmwebdeveloper@gmail.com",
//             html: "hello dear"
//         });

//         console.log("send ===", send);
//     } catch (error) {
//         console.log(error);
//     }
// }