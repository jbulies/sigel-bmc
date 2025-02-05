import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { sendInvitationEmail } from '../services/email.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, token } = req.body;

    // Verificar si el token de invitación es válido
    const [invitations]: any = await pool.query(
      'SELECT * FROM invitations WHERE token = ? AND status = "Pendiente" AND expires_at > NOW()',
      [token]
    );

    if (!invitations.length) {
      return res.status(400).json({ message: 'Token de invitación inválido o expirado' });
    }

    const invitation = invitations[0];

    // Verificar si el email coincide con la invitación
    if (email !== invitation.email) {
      return res.status(400).json({ message: 'El email no coincide con la invitación' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const [result]: any = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, invitation.role]
    );

    // Actualizar el estado de la invitación
    await pool.query(
      'UPDATE invitations SET status = "Aceptada" WHERE id = ?',
      [invitation.id]
    );

    // Generar token JWT
    const token_jwt = jwt.sign(
      { id: result.insertId, role: invitation.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
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
    const { email, password } = req.body;

    // Buscar usuario
    const [users]: any = await pool.query(
      'SELECT * FROM users WHERE email = ? AND status = "Activo"',
      [email]
    );

    if (!users.length) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

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
    console.error('Error en login:', error);
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