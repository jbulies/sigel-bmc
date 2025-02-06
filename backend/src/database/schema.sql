-- Crear base de datos
CREATE DATABASE IF NOT EXISTS bmcgw_sigel;
USE bmcgw_sigel;

-- Tabla de usuarios
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Administrador', 'Logístico', 'Informático', 'Usuario') NOT NULL,
  status ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  reset_token VARCHAR(255),
  reset_token_expires DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de invitaciones
CREATE TABLE invitations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  role ENUM('Administrador', 'Logístico', 'Informático', 'Usuario') NOT NULL,
  status ENUM('Pendiente', 'Completada', 'Expirada') DEFAULT 'Pendiente',
  expires_at DATETIME NOT NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tabla de reportes
CREATE TABLE reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('Pendiente', 'En Progreso', 'Resuelto') DEFAULT 'Pendiente',
  priority ENUM('Baja', 'Media', 'Alta') NOT NULL,
  department ENUM('Logística', 'Informática') NOT NULL,
  created_by INT NOT NULL,
  assigned_to INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Tabla de notificaciones
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insertar usuario administrador por defecto
INSERT INTO users (name, email, password, role) VALUES (
  'Admin',
  'admin@example.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YW3qy5MW', -- password: Admin123*
  'Administrador'
);