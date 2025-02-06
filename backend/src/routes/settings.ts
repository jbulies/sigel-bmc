import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { pool } from '../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';

const router = Router();

router.use(authMiddleware);

interface EmailSettings extends RowDataPacket {
  smtp_host: string;
  smtp_port: string;
  smtp_user: string;
  smtp_password: string;
  sender_email: string;
}

router.post('/email', async (req, res) => {
  try {
    const { smtpHost, smtpPort, smtpUser, smtpPassword, senderEmail } = req.body;
    
    // Verificar si ya existe una configuración
    const [existingConfig] = await pool.query<EmailSettings[]>('SELECT id FROM email_settings LIMIT 1');
    
    if (Array.isArray(existingConfig) && existingConfig.length > 0) {
      // Actualizar la configuración existente
      await pool.query(
        'UPDATE email_settings SET smtp_host = ?, smtp_port = ?, smtp_user = ?, smtp_password = ?, sender_email = ?',
        [smtpHost, smtpPort, smtpUser, smtpPassword, senderEmail]
      );
    } else {
      // Insertar nueva configuración
      await pool.query(
        'INSERT INTO email_settings (smtp_host, smtp_port, smtp_user, smtp_password, sender_email) VALUES (?, ?, ?, ?, ?)',
        [smtpHost, smtpPort, smtpUser, smtpPassword, senderEmail]
      );
    }
    
    res.json({ message: 'Configuración guardada exitosamente' });
  } catch (error) {
    console.error('Error al guardar la configuración:', error);
    res.status(500).json({ error: 'Error al guardar la configuración' });
  }
});

router.get('/email', async (req, res) => {
  try {
    const [config] = await pool.query<EmailSettings[]>(
      'SELECT smtp_host, smtp_port, smtp_user, sender_email FROM email_settings LIMIT 1'
    );
    
    if (Array.isArray(config) && config.length > 0) {
      res.json(config[0]);
    } else {
      res.json({
        smtpHost: '',
        smtpPort: '',
        smtpUser: '',
        senderEmail: ''
      });
    }
  } catch (error) {
    console.error('Error al obtener la configuración:', error);
    res.status(500).json({ error: 'Error al obtener la configuración' });
  }
});

export default router;