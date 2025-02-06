import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import pool from '../config/database';
import { sendInvitationEmail, sendPasswordResetEmail } from '../services/email.service';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

const jwtSignOptions: SignOptions = {
  expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, token } = req.body;

    const [invitations]: any = await pool.query(
      'SELECT * FROM invitations WHERE token = ? AND status = "Pendiente" AND expires_at > NOW()',
      [token]
    );

    if (!invitations.length) {
      return res.status(400).json({ message: 'Token de invitación inválido o expirado' });
    }

    const invitation = invitations[0];

    if (email !== invitation.email) {
      return res.status(400).json({ message: 'El email no coincide con la invitación' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result]: any = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, invitation.role]
    );

    await pool.query(
      'UPDATE invitations SET status = "Aceptada" WHERE id = ?',
      [invitation.id]
    );

    const token_jwt = jwt.sign(
      { id: result.insertId, role: invitation.role },
      JWT_SECRET,
      jwtSignOptions
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token: token_jwt
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log('Login attempt with email:', req.body.email);
    const { email, password } = req.body;

    // Log the raw password input
    console.log('Raw password input:', {
      value: password,
      type: typeof password,
      length: password?.length,
      isString: typeof password === 'string'
    });

    // Ensure password is a string
    if (typeof password !== 'string') {
      console.log('Password is not a string:', typeof password);
      return res.status(400).json({ message: 'Formato de contraseña inválido' });
    }

    // First check: Find user by email
    const [users]: any = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    console.log('Users found:', users.length);

    if (!users.length) {
      console.log('No user found with email:', email);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];
    console.log('User status:', user.status);
    console.log('Stored hashed password:', user.password);

    // Second check: Verify user status
    if (user.status !== 'Activo') {
      console.log('User account is not active');
      return res.status(401).json({ message: 'Cuenta de usuario inactiva' });
    }

    // Third check: Verify password
    // Ensure we're comparing strings
    const trimmedPassword = password.trim();
    console.log('Password comparison:', {
      trimmedPassword,
      trimmedLength: trimmedPassword.length,
      originalLength: password.length,
      hasWhitespace: password !== trimmedPassword
    });
    
    const isValidPassword = await bcrypt.compare(trimmedPassword, user.password);
    console.log('Password validation result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      jwtSignOptions
    );

    console.log('Login successful for user:', email);

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in login process:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

export const verifyInvitation = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const [invitations]: any = await pool.query(
      'SELECT * FROM invitations WHERE token = ? AND status = "Pendiente" AND expires_at > NOW()',
      [token]
    );

    if (!invitations.length) {
      return res.status(400).json({ message: 'Token de invitación inválido o expirado' });
    }

    res.json({
      message: 'Token de invitación válido',
      email: invitations[0].email
    });
  } catch (error) {
    console.error('Error al verificar invitación:', error);
    res.status(500).json({ message: 'Error al verificar invitación' });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Verificar si el usuario existe
    const [users]: any = await pool.query(
      'SELECT id FROM users WHERE email = ? AND status = "Activo"',
      [email]
    );

    if (!users.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token en la base de datos
    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [resetToken, resetTokenExpiry, users[0].id]
    );

    // Enviar email
    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'Se ha enviado un enlace de recuperación a tu email' });
  } catch (error) {
    console.error('Error en recuperación de contraseña:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    // Verificar token
    const [users]: any = await pool.query(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );

    if (!users.length) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar contraseña y limpiar token
    await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashedPassword, users[0].id]
    );

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    res.status(500).json({ message: 'Error al resetear contraseña' });
  }
};
