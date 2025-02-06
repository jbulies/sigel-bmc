-- Crear base de datos
CREATE DATABASE IF NOT EXISTS bmcgw_sigel;
USE bmcgw_sigel;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Usuario', 'Logístico', 'Informático', 'Administrador') NOT NULL,
  status ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  reset_token VARCHAR(255),
  reset_token_expires DATETIME
);

-- Crear tabla de invitaciones
CREATE TABLE IF NOT EXISTS invitations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(255) NOT NULL UNIQUE,
  role ENUM('Usuario', 'Logístico', 'Informático', 'Administrador') NOT NULL,
  status ENUM('Pendiente', 'Completada') DEFAULT 'Pendiente',
  expires_at DATETIME NOT NULL
);

-- Insertar usuario administrador por defecto con contraseña: Admin123*
-- El hash fue generado usando el salt fijo
INSERT INTO users (name, email, password, role) VALUES (
  'Admin',
  'admin@example.com',
  '$2a$10$DaZ.h.5hZNlMQNKRGHCYWuqPJ/X6qyGqT04mkF4t7ISzHxQXiqHK2',
  'Administrador'
);
