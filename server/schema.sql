-- Schema MySQL / MariaDB Portabel untuk FinanceCraft
CREATE DATABASE IF NOT EXISTS `financecraft_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `financecraft_db`;

-- Tabel Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `google_id` VARCHAR(255) UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `avatar_url` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel Accounts (Saldo & Sub-Saldo)
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_email` VARCHAR(255) NOT NULL,
  `type` ENUM('PRIMARY', 'HOUSEHOLD_SUB', 'PERSONAL_SUB') NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `balance` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_email`) REFERENCES `users`(`email`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel Categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_email` VARCHAR(255),
  `scope` ENUM('INCOME', 'HOUSEHOLD_EXPENSE', 'PERSONAL_EXPENSE') NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(50) DEFAULT 'tag',
  `color` VARCHAR(20) DEFAULT '#3B82F6'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel Transactions
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_email` VARCHAR(255) NOT NULL,
  `account_id` VARCHAR(64),
  `from_account_id` VARCHAR(64),
  `to_account_id` VARCHAR(64),
  `category_id` VARCHAR(64),
  `category_name` VARCHAR(100),
  `type` ENUM('INCOME', 'EXPENSE', 'ALLOCATION') NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `date` DATE NOT NULL,
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
