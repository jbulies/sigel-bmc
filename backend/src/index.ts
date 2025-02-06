import express from 'express';
import path from 'path';
import cors from 'cors';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import reportRoutes from './routes/reports';
import { authenticateToken } from './middleware/auth';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

// Middleware básico
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/reports', authenticateToken, reportRoutes);

// Configuración para servir archivos estáticos
const distPath = path.join(__dirname, '../../../sigel-bmc/dist');
console.log('Ruta del dist:', distPath);

// Servir archivos estáticos desde el directorio dist
app.use(express.static(distPath));

// Todas las rutas no manejadas serán redirigidas al index.html
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log('Intentando servir:', indexPath);
  res.sendFile(indexPath);
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Sirviendo archivos estáticos desde: ${distPath}`);
});