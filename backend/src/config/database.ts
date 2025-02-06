import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: true
});

// Solo verificar la conexión sin crear tablas
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    console.log('Connected as id:', connection.threadId);
    connection.release();
  } catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
};

// Inicializar la conexión a la base de datos
initializeDatabase();

export default pool;