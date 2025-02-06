import { Request, Response } from 'express';
import { pool } from '../config/database';

export const getReports = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    
    let query = `
      SELECT r.*, 
             u1.name as created_by_name,
             u2.name as assigned_to_name
      FROM reports r
      LEFT JOIN users u1 ON r.created_by = u1.id
      LEFT JOIN users u2 ON r.assigned_to = u2.id
    `;

    const params: any[] = [];

    // Filtrar reportes según el rol del usuario
    if (userRole === 'Usuario') {
      query += ' WHERE r.created_by = ?';
      params.push(userId);
    } else if (userRole === 'Logístico') {
      query += ' WHERE r.department = "Logística"';
    } else if (userRole === 'Informático') {
      query += ' WHERE r.department = "Informática"';
    }
    // El Administrador ve todos los reportes

    const [reports] = await pool.query(query, params);
    res.json(reports);
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ message: 'Error al obtener reportes' });
  }
};

export const createReport = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, department } = req.body;
    const userId = req.user?.id;

    const [result]: any = await pool.query(
      'INSERT INTO reports (title, description, priority, department, created_by) VALUES (?, ?, ?, ?, ?)',
      [title, description, priority, department, userId]
    );

    // Crear notificación para los usuarios correspondientes
    const [users]: any = await pool.query(
      'SELECT id FROM users WHERE role = ? OR role = "Administrador"',
      [department === 'Logística' ? 'Logístico' : 'Informático']
    );

    for (const user of users) {
      await pool.query(
        'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
        [
          user.id,
          'Nuevo reporte creado',
          `Se ha creado un nuevo reporte: ${title}`
        ]
      );
    }

    res.status(201).json({ 
      message: 'Reporte creado exitosamente',
      reportId: result.insertId 
    });
  } catch (error) {
    console.error('Error al crear reporte:', error);
    res.status(500).json({ message: 'Error al crear reporte' });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;
    const userRole = req.user?.role;
    const userId = req.user?.id;

    // Verificar permisos
    const [reports]: any = await pool.query(
      'SELECT * FROM reports WHERE id = ?',
      [id]
    );

    if (!reports.length) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    const report = reports[0];

    if (userRole === 'Usuario') {
      return res.status(403).json({ message: 'No tienes permiso para editar reportes' });
    }

    if ((userRole === 'Logístico' && report.department !== 'Logística') ||
        (userRole === 'Informático' && report.department !== 'Informática')) {
      return res.status(403).json({ message: 'No tienes permiso para editar este reporte' });
    }

    await pool.query(
      'UPDATE reports SET title = ?, description = ?, status = ?, priority = ? WHERE id = ?',
      [title, description, status, priority, id]
    );

    // Crear notificación para el creador del reporte
    await pool.query(
      'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
      [
        report.created_by,
        'Reporte actualizado',
        `Tu reporte "${report.title}" ha sido actualizado a estado: ${status}`
      ]
    );

    res.json({ message: 'Reporte actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar reporte:', error);
    res.status(500).json({ message: 'Error al actualizar reporte' });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role;

    // Verificar permisos
    const [reports]: any = await pool.query(
      'SELECT * FROM reports WHERE id = ?',
      [id]
    );

    if (!reports.length) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    const report = reports[0];

    if (userRole === 'Usuario') {
      return res.status(403).json({ message: 'No tienes permiso para eliminar reportes' });
    }

    if ((userRole === 'Logístico' && report.department !== 'Logística') ||
        (userRole === 'Informático' && report.department !== 'Informática')) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este reporte' });
    }

    await pool.query('DELETE FROM reports WHERE id = ?', [id]);

    res.json({ message: 'Reporte eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar reporte:', error);
    res.status(500).json({ message: 'Error al eliminar reporte' });
  }
};
