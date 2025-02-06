import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/database';
import { sendPasswordResetEmail } from '../services/email.service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    console.log('Received password:', password); // Add this log

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    const [users]: any = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!users.length) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const user = users[0];
    console.log('Stored hashed password:', user.password); // Add this log
    
    // Ensure password is a string and trim it
    const cleanPassword = String(password).trim();
    const isValid = await bcrypt.compare(cleanPassword, user.password);
    console.log('Password comparison result:', isValid);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', email);

    res.json({
      success: true,
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
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión'
    });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const [users]: any = await pool.query(
      'SELECT id FROM users WHERE email = ? AND status = "Activo"',
      [email]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [resetToken, expiresAt, users[0].id]
    );

    await sendPasswordResetEmail(email, resetToken);

    res.json({
      success: true,
      message: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña'
    });
  } catch (error) {
    console.error('Error al solicitar restablecimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud'
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const [users]: any = await pool.query(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW() AND status = "Activo"',
      [token]
    );

    if (!users.length) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Generar hash con bcrypt usando SALT_ROUNDS
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashedPassword, users[0].id]
    );

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al restablecer la contraseña'
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, invitationToken } = req.body;

    const [invitations]: any = await pool.query(
      'SELECT * FROM invitations WHERE token = ? AND status = "Pendiente" AND expires_at > NOW()',
      [invitationToken]
    );

    if (!invitations.length) {
      return res.status(400).json({
        success: false,
        message: 'Invitación inválida o expirada'
      });
    }

    const invitation = invitations[0];
    
    // Generar hash con bcrypt usando SALT_ROUNDS
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await pool.query('BEGIN');

    const [result]: any = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, invitation.role]
    );

    await pool.query(
      'UPDATE invitations SET status = "Completada" WHERE id = ?',
      [invitation.id]
    );

    await pool.query('COMMIT');

    const authToken = jwt.sign(
      { id: result.insertId, role: invitation.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Registro exitoso',
      token: authToken,
      user: {
        id: result.insertId,
        name,
        email,
        role: invitation.role
      }
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario'
    });
  }
};