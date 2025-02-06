import { Request, Response } from 'express';
import { pool } from '../config/database';
import { sendInvitationEmail } from '../services/email.service';
import crypto from 'crypto';

export const createInvitation = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const [result]: any = await pool.query(
      'INSERT INTO invitations (email, role, token, expires_at, created_by) VALUES (?, ?, ?, ?, ?)',
      [email, role, token, expiresAt, req.user?.id]
    );

    await sendInvitationEmail(email, token);

    res.status(201).json({
      message: 'Invitación enviada exitosamente',
      invitationId: result.insertId
    });
  } catch (error) {
    console.error('Error al crear invitación:', error);
    res.status(500).json({ message: 'Error al crear invitación' });
  }
};

export const resendInvitation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [invitations]: any = await pool.query(
      'SELECT * FROM invitations WHERE id = ? AND status = "Pendiente"',
      [id]
    );

    if (!invitations.length) {
      return res.status(404).json({ message: 'Invitación no encontrada' });
    }

    const invitation = invitations[0];
    await sendInvitationEmail(invitation.email, invitation.token);

    res.json({ message: 'Invitación reenviada exitosamente' });
  } catch (error) {
    console.error('Error al reenviar invitación:', error);
    res.status(500).json({ message: 'Error al reenviar invitación' });
  }
};

export const cancelInvitation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result]: any = await pool.query(
      'UPDATE invitations SET status = "Expirada" WHERE id = ? AND status = "Pendiente"',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Invitación no encontrada' });
    }

    res.json({ message: 'Invitación cancelada exitosamente' });
  } catch (error) {
    console.error('Error al cancelar invitación:', error);
    res.status(500).json({ message: 'Error al cancelar invitación' });
  }
};

export const getPendingInvitations = async (req: Request, res: Response) => {
  try {
    const [invitations]: any = await pool.query(
      'SELECT * FROM invitations WHERE status = "Pendiente" ORDER BY created_at DESC'
    );

    res.json(invitations);
  } catch (error) {
    console.error('Error al obtener invitaciones:', error);
    res.status(500).json({ message: 'Error al obtener invitaciones' });
  }
};
