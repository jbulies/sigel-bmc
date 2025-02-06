-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS bmcgw_sigel;
USE bmcgw_sigel;

-- Tabla de usuarios
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('Usuario', 'Logístico', 'Informático', 'Administrador') NOT NULL,
  status ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de invitaciones
CREATE TABLE invitations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('Usuario', 'Logístico', 'Informático', 'Administrador') NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  status ENUM('Pendiente', 'Aceptada', 'Expirada') DEFAULT 'Pendiente',
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_invitations_token ON invitations(token);

-- Insertar usuario administrador por defecto
-- Password: admin123
INSERT INTO users (name, email, password, role) VALUES 
('Administrador', 'admin@example.com', '$2b$10$ng6.rWNxqzOVWjPR.xhgDuH8nPx7KyGkAT0yJUBVGQGXM.7Nfn3Hy', 'Administrador');