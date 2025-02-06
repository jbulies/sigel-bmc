import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { sendPasswordResetEmail } from '../services/email.service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email y contraseña son requeridos' 
      });
    }

    const [users]: any = await pool.query(
      'SELECT * FROM users WHERE email = ? AND status = "Activo"',
      [email]
    );

    if (!users.length) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

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

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, token } = req.body;

    const [invitations]: any = await pool.query(
      'SELECT * FROM invitations WHERE token = ? AND status = "Pendiente" AND expires_at > NOW()',
      [token]
    );

    if (!invitations.length) {
      return res.status(400).json({ 
        success: false,
        message: 'Token de invitación inválido o expirado' 
      });
    }

    const invitation = invitations[0];

    if (email !== invitation.email) {
      return res.status(400).json({ 
        success: false,
        message: 'El email no coincide con la invitación' 
      });
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
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token: token_jwt
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al registrar usuario' 
    });
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
      return res.status(400).json({ 
        success: false,
        message: 'Token de invitación inválido o expirado' 
      });
    }

    res.json({
      success: true,
      message: 'Token de invitación válido',
      email: invitations[0].email
    });
  } catch (error) {
    console.error('Error al verificar invitación:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al verificar invitación' 
    });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const [users]: any = await pool.query(
      'SELECT * FROM users WHERE email = ? AND status = "Activo"',
      [email]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const resetToken = jwt.sign(
      { id: users[0].id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?',
      [resetToken, users[0].id]
    );

    await sendPasswordResetEmail(email, resetToken);

    res.json({
      success: true,
      message: 'Se ha enviado un correo con las instrucciones para restablecer la contraseña'
    });

  } catch (error) {
    console.error('Error al solicitar restablecimiento de contraseña:', error);
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
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );

    if (!users.length) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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