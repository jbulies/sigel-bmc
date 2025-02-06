import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

console.log('Configuración de base de datos:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME || process.env.DB_DATABASE,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Verificar conexión
pool.getConnection()
  .then(connection => {
    console.log('Database connection established successfully');
    console.log('Connected as id:', connection.threadId);
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

export default pool;