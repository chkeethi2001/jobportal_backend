import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const send_OTP = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "raghavendramani89@gmail.com",
      pass: "nmczbedeuhsjosxb",
    },
  });
  await transporter.sendMail({
    from: "CodeAcademy",
    to: to,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  });
};

export const send_Token = async (to, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "raghavendramani89@gmail.com",
      pass: "nmczbedeuhsjosxb",
    },
  });
  await transporter.sendMail({
    from: "CodeAcademy",
    to: to,
    subject: "Your reset Password Link",
    text: `Your Link is http://localhost:5173/reset/password/${token}. It is valid for 10 minutes.`,
  });
};

export async function emailCert(toEmail, subject, text, pdfBuffer, filename) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "raghavendramani89@gmail.com",
      pass: "nmczbedeuhsjosxb",
    },
  });
  await transporter.sendMail({
    from: '"LMS" <no-reply@lms.example>',
    to: toEmail,
    subject,
    text,
    attachments: [{ filename, content: pdfBuffer }],
  });
}
