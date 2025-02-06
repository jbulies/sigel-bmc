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

-- Tabla de notificaciones
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_reports_created_by ON reports(created_by);
CREATE INDEX idx_reports_assigned_to ON reports(assigned_to);
CREATE INDEX idx_reports_department ON reports(department);
CREATE INDEX idx_reports_status ON reports(status);

-- Trigger para actualizar updated_at
DELIMITER //
CREATE TRIGGER update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;//
DELIMITER ;

-- Insertar usuario administrador por defecto
-- Contraseña: admin123 (hasheada con bcrypt)
INSERT INTO users (name, email, password, role) VALUES 
('Administrador', 'admin@example.com', '$2a$10$YourNewHashHere', 'Administrador');