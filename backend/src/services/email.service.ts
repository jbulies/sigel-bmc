import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendInvitationEmail = async (email: string, token: string) => {
  const registrationUrl = `${process.env.FRONTEND_URL}/auth/register?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Invitación para unirse a la plataforma',
    html: `
      <h1>¡Has sido invitado!</h1>
      <p>Has recibido una invitación para unirte a nuestra plataforma.</p>
      <p>Para completar tu registro, haz clic en el siguiente enlace:</p>
      <a href="${registrationUrl}">Completar registro</a>
      <p>Este enlace expirará en 24 horas.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};