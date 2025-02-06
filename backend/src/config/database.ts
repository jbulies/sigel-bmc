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
  multipleStatements: true // Permitir múltiples statements para las transacciones
});

// Verificar conexión y crear tablas si no existen
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    console.log('Connected as id:', connection.threadId);

    // Leer y ejecutar el archivo schema.sql
    const fs = require('fs');
    const path = require('path');
    const schema = fs.readFileSync(
      path.join(__dirname, '../database/schema.sql'),
      'utf8'
    );

    await connection.query(schema);
    console.log('Database schema initialized successfully');
    
    connection.release();
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1); // Terminar la aplicación si no se puede conectar a la base de datos
  }
};

// Inicializar la base de datos al arrancar la aplicación
initializeDatabase();

export default pool;