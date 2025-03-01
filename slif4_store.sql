-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 03, 2025 at 03:29 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `slif4_store`
--

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `game_name` varchar(255) NOT NULL,
  `nominal` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `username_game` varchar(255) NOT NULL,
  `status` enum('pending','completed') DEFAULT 'pending',
  `bukti_pembayaran` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `game_name`, `nominal`, `created_at`, `username_game`, `status`, `bukti_pembayaran`) VALUES
(19, 6, 'Free Fire', 400000, '2025-02-03 01:34:16', 'NabilGeming', 'completed', '1738554108332-467275085.jpg'),
(20, 6, 'Free Fire', 400000, '2025-02-03 01:48:30', 'NabilGeming', 'pending', NULL),
(22, 6, 'Mobile Legends', 30000, '2025-02-03 01:52:51', 'NabilGeming', 'pending', NULL),
(24, 6, 'Pubg Mobile', 200000, '2025-02-03 02:27:59', 'NabilGeming', 'completed', '1738553678620-741569639.png'),
(27, 6, 'Free Fire', 1000000, '2025-02-03 05:13:48', 'NabilGeming', 'completed', '1738559679725-229566873.png'),
(29, 6, 'Pubg Mobile', 300000, '2025-02-03 05:34:07', 'NabilGeming', 'pending', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `username_game` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `created_at`, `username_game`) VALUES
(4, 'mnabilrafasya', 'mnabilrafasya03@gmail.com', '$2b$10$arU1lzvLLgMISO9orqYD0OhykCrzeG5UHQk5nIAfEh4WYpxl8aMG2', '2025-02-02 10:43:37', 'awewo'),
(5, 'nabilanto', 'Supernabil3@gmail.com', '$2b$10$DQf74c7I.l5J/FwntkUoMeezz95bgLJB8RxlF34B8N2ML6M4ZYs.i', '2025-02-03 01:24:03', 'anjayani'),
(6, 'fufufafa', 'ytta@gmail.com', '$2b$10$/cCpVhTwrg8W6.c7dINrJuAOBoO6PQ08bSINiMcL7Z1vbkwfB6wby', '2025-02-03 01:26:01', 'NabilGeming');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_username_game` (`username_game`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username_game` (`username_game`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_username_game` FOREIGN KEY (`username_game`) REFERENCES `users` (`username_game`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
