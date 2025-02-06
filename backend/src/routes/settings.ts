import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

router.use(authMiddleware);

router.post('/email', async (req, res) => {
  try {
    const { smtpHost, smtpPort, smtpUser, smtpPassword, senderEmail } = req.body;
    
    // Leer el archivo .env actual
    const envPath = path.resolve(__dirname, '../../.env');
    const currentEnv = dotenv.parse(fs.readFileSync(envPath));
    
    // Actualizar las variables
    const newEnv = {
      ...currentEnv,
      SMTP_HOST: smtpHost,
      SMTP_PORT: smtpPort,
      SMTP_USER: smtpUser,
      SMTP_PASS: smtpPassword,
      SENDER_EMAIL: senderEmail
    };
    
    // Convertir el objeto a formato .env
    const envContent = Object.entries(newEnv)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    // Escribir el archivo .env
    fs.writeFileSync(envPath, envContent);
    
    // Recargar las variables de entorno
    dotenv.config();
    
    res.json({ message: 'Configuración guardada exitosamente' });
  } catch (error) {
    console.error('Error al guardar la configuración:', error);
    res.status(500).json({ error: 'Error al guardar la configuración' });
  }
});

router.get('/email', async (req, res) => {
  try {
    const config = {
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT,
      smtpUser: process.env.SMTP_USER,
      senderEmail: process.env.SENDER_EMAIL
    };
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la configuración' });
  }
});

export default router;