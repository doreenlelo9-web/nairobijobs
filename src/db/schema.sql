-- ==========================================================
-- MZUNGU CHAT EARN - PRODUCTION MYSQL DATABASE SCHEMA
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `mzungu_chat_earn` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mzungu_chat_earn`;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `full_name` VARCHAR(128) NOT NULL,
  `username` VARCHAR(64) NOT NULL UNIQUE,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(32) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `avatar_url` VARCHAR(512) DEFAULT NULL,
  `country` VARCHAR(64) DEFAULT 'Kenya',
  `native_language` VARCHAR(64) DEFAULT 'Kiswahili',
  `bio` TEXT DEFAULT NULL,
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `is_verified` BOOLEAN DEFAULT TRUE,
  `status` ENUM('active', 'suspended') DEFAULT 'active',
  `daily_streak` INT UNSIGNED DEFAULT 1,
  `last_login_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_username` (`username`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. WALLET TABLE
CREATE TABLE IF NOT EXISTS `wallets` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL UNIQUE,
  `coin_balance` BIGINT NOT NULL DEFAULT 1500,
  `today_earnings` BIGINT NOT NULL DEFAULT 500,
  `weekly_earnings` BIGINT NOT NULL DEFAULT 1500,
  `total_earnings` BIGINT NOT NULL DEFAULT 1500,
  `hours_chatted` DECIMAL(10, 2) NOT NULL DEFAULT 2.00,
  `referral_earnings` BIGINT NOT NULL DEFAULT 250,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_wallet_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `type` ENUM('chat_reward', 'referral_bonus', 'daily_checkin', 'spin_wheel', 'achievement_reward', 'withdrawal') NOT NULL,
  `title` VARCHAR(128) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `amount` BIGINT NOT NULL,
  `status` ENUM('completed', 'pending', 'rejected') DEFAULT 'completed',
  `reference_id` VARCHAR(64) DEFAULT NULL,
  `payout_method` ENUM('mpesa', 'paypal', 'bank', 'crypto') DEFAULT NULL,
  `payout_details` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_transaction_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_tx_user_created` (`user_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. CHAT SESSIONS TABLE
CREATE TABLE IF NOT EXISTS `chat_sessions` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `partner_id` VARCHAR(64) NOT NULL,
  `started_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_active_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_active_seconds` INT UNSIGNED NOT NULL DEFAULT 0,
  `coins_earned` INT UNSIGNED NOT NULL DEFAULT 0,
  `messages_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_paused` BOOLEAN DEFAULT FALSE,
  `ended_at` TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT `fk_session_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_session_user_partner` (`user_id`, `partner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS `messages` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `session_id` VARCHAR(64) NOT NULL,
  `sender_id` VARCHAR(64) NOT NULL,
  `sender_name` VARCHAR(128) NOT NULL,
  `receiver_id` VARCHAR(64) NOT NULL,
  `content` TEXT NOT NULL,
  `is_ai` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_voice_note` BOOLEAN DEFAULT FALSE,
  `audio_duration` INT DEFAULT NULL,
  `status` ENUM('sent', 'delivered', 'read') DEFAULT 'read',
  `correction_original` TEXT DEFAULT NULL,
  `correction_suggested` TEXT DEFAULT NULL,
  `correction_explanation` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_message_session` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`id`) ON DELETE CASCADE,
  INDEX `idx_messages_session_time` (`session_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. REWARDS & DAILY STREAKS
CREATE TABLE IF NOT EXISTS `daily_rewards` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `day_number` TINYINT UNSIGNED NOT NULL,
  `coins_awarded` INT UNSIGNED NOT NULL,
  `claimed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_daily_reward_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. ACHIEVEMENTS & PROGRESS
CREATE TABLE IF NOT EXISTS `achievements` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `key_name` VARCHAR(64) NOT NULL UNIQUE,
  `title` VARCHAR(128) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `icon_name` VARCHAR(64) NOT NULL,
  `reward_coins` INT UNSIGNED NOT NULL,
  `max_progress` INT UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_achievements` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `achievement_id` VARCHAR(64) NOT NULL,
  `current_progress` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_unlocked` BOOLEAN DEFAULT FALSE,
  `is_claimed` BOOLEAN DEFAULT FALSE,
  `claimed_at` TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT `fk_user_achv_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_achv_achv` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_user_achievement` (`user_id`, `achievement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. REFERRALS TABLE
CREATE TABLE IF NOT EXISTS `referrals` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `referrer_id` VARCHAR(64) NOT NULL,
  `referred_user_id` VARCHAR(64) NOT NULL UNIQUE,
  `referral_code` VARCHAR(32) NOT NULL,
  `bonus_earned` INT UNSIGNED NOT NULL DEFAULT 250,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ref_referrer` FOREIGN KEY (`referrer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ref_referred` FOREIGN KEY (`referred_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_referral_code` (`referral_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(128) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('reward', 'streak', 'withdrawal', 'chat', 'system') DEFAULT 'system',
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_notif_user_read` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS `settings` (
  `key_name` VARCHAR(64) NOT NULL PRIMARY KEY,
  `value_data` TEXT NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SEED SYSTEM CONFIGURATION
INSERT INTO `settings` (`key_name`, `value_data`, `description`) VALUES
('coins_per_first_hour', '500', 'Coins awarded for the 1st completed active hour'),
('coins_per_second_hour', '500', 'Coins awarded for the 2nd completed active hour (1000 total)'),
('coins_per_additional_hour', '500', 'Coins awarded for each additional completed hour'),
('idle_timeout_seconds', '300', 'Inactivity duration (seconds) before active timer automatically pauses (5 minutes)'),
('min_withdrawal_coins', '1000', 'Minimum coins threshold to request a withdrawal'),
('coin_to_usd_rate', '0.001', 'Rate per 1 coin in USD (1000 coins = $1.00 USD)'),
('referral_bonus_coins', '250', 'Coins awarded when referred user completes 1 active hour')
ON DUPLICATE KEY UPDATE `value_data` = VALUES(`value_data`);
