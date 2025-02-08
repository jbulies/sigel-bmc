
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendInvitationEmail = async (email: string, token: string) => {
  try {
    const registrationUrl = `${process.env.FRONTEND_URL}/auth/register?token=${token}`;

    const mailOptions = {
      from: `"SIGEL" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Invitación para unirse a SIGEL',
      html: `
        <h1>¡Has sido invitado a SIGEL!</h1>
        <p>Has recibido una invitación para unirte a nuestra plataforma.</p>
        <p>Para completar tu registro, haz clic en el siguiente enlace:</p>
        <a href="${registrationUrl}">Completar registro</a>
        <p>Este enlace expirará en 24 horas.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error al enviar email de invitación:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

    const mailOptions = {
      from: `"SIGEL" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Recuperación de contraseña - SIGEL',
      html: `
        <h1>Recuperación de contraseña</h1>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href="${resetUrl}">Restablecer contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de recuperación enviado:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error al enviar email de recuperación:', error);
    throw error;
  }
};
