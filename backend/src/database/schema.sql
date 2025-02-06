-- Crear base de datos
CREATE DATABASE IF NOT EXISTS bmcgw_sigel;
USE bmcgw_sigel;

-- Tabla de usuarios
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Supervisor', 'Operador') NOT NULL,
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
  role ENUM('Admin', 'Supervisor', 'Operador') NOT NULL,
  status ENUM('Pendiente', 'Completada', 'Expirada') DEFAULT 'Pendiente',
  expires_at DATETIME NOT NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Insertar usuario administrador por defecto
INSERT INTO users (name, email, password, role) VALUES (
  'Admin',
  'admin@example.com',
  '$2a$10$EYZpOdF0hBMtHNuX7WsBZeGwBz7qHKzGJGz2.RHiLRKR9Pf9SyTZy', -- password: Admin123*
  'Admin'
);