-- DATABASE SETUP SCRIPT
-- Project: Sam's Fitness Gym Management System

-- 1. Create and Select Database
CREATE DATABASE IF NOT EXISTS gym_db;
USE gym_db;

-- 2. Clean up old tables (to ensure a fresh start)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Notifications;
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Subscriptions;
DROP TABLE IF EXISTS Plan_Services;
DROP TABLE IF EXISTS Services;
DROP TABLE IF EXISTS Plans;
DROP TABLE IF EXISTS Users;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- Table Structure: Users
-- --------------------------------------------------------
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role ENUM('client', 'admin') DEFAULT 'client',
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- Table Structure: Plans
-- --------------------------------------------------------
CREATE TABLE Plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_days INT NOT NULL,
    description TEXT
);

-- --------------------------------------------------------
-- Table Structure: Services
-- --------------------------------------------------------
CREATE TABLE Services (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL
);

-- --------------------------------------------------------
-- Table Structure: Plan_Services (Junction Table)
-- --------------------------------------------------------
CREATE TABLE Plan_Services (
    plan_id INT,
    service_id INT,
    FOREIGN KEY (plan_id) REFERENCES Plans(plan_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Services(service_id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id, service_id)
);

-- --------------------------------------------------------
-- Table Structure: Subscriptions
-- --------------------------------------------------------
CREATE TABLE Subscriptions (
    subscription_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES Plans(plan_id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Table Structure: Reviews
-- --------------------------------------------------------
CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- Table Structure: Notifications
-- --------------------------------------------------------
CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- ========================================================
-- DUMMY DATA INSERTION
-- ========================================================

-- Insert Plans
INSERT INTO Plans (plan_name, price, duration_days, description) VALUES
('Free Trial', 0.00, 7, '7 Day access to basic equipment.'),
('Monthly Basic', 29.99, 30, 'Standard gym access.'),
('Yearly Pro', 299.99, 365, 'All access pass including spa and trainer.');

-- Insert Services
INSERT INTO Services (service_name) VALUES
('Cardio Zone'), ('Weight Lifting'), ('Personal Trainer'), 
('Locker Access'), ('Sauna & Spa'), ('Yoga Classes'), ('Diet Plan');

-- Link Services to Plans
INSERT INTO Plan_Services (plan_id, service_id) VALUES 
(1, 1), (1, 2),          -- Free Trial: Cardio, Weights
(2, 1), (2, 2), (2, 4),  -- Basic: Cardio, Weights, Locker
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7); -- Pro: Everything

-- Insert Admin User
-- Login: admin@gmail.com / admin123
INSERT INTO Users (first_name, last_name, email, password, phone_number, role) VALUES
('System', 'Admin', 'admin@gmail.com', '$2a$10$X7V.jOq.k.W.v.k.X.x.u.e.r.t.y.u.i.o.p.1.2.3.HASH_HERE', '9876543210', 'admin');

-- NOTE: If the login above does not work, register a new user manually 
-- and change their role to 'admin' in the database.

-- Insert Sample Review
INSERT INTO Reviews (name, email, message) VALUES
('John Doe', 'john@test.com', 'Amazing facility! The trainers are very helpful.');