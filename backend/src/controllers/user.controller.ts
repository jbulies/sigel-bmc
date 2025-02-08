
import { Request, Response } from 'express';
import pool from '../config/database';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const [users]: any = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [userId]
    );

    if (!users.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error al obtener perfil de usuario' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, currentPassword, newPassword } = req.body;

    const [users]: any = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (!users.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = users[0];

    if (currentPassword && newPassword) {
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Contraseña actual incorrecta' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

      await pool.query(
        'UPDATE users SET name = ?, password = ? WHERE id = ?',
        [name, hashedPassword, userId]
      );
    } else {
      await pool.query(
        'UPDATE users SET name = ? WHERE id = ?',
        [name, userId]
      );
    }

    res.json({ 
      message: 'Perfil actualizado exitosamente',
      user: {
        id: user.id,
        name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error al actualizar perfil de usuario' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const [users]: any = await pool.query(
      'SELECT id, name, email, role, status FROM users WHERE status = "Activo"'
    );
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    await pool.query(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name, email, role, id]
    );

    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

export const deactivateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query(
      'UPDATE users SET status = "Inactivo" WHERE id = ?',
      [id]
    );

    res.json({ message: 'Usuario desactivado exitosamente' });
  } catch (error) {
    console.error('Error al desactivar usuario:', error);
    res.status(500).json({ message: 'Error al desactivar usuario' });
  }
};
