-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 10, 2024 at 12:07 PM
-- Server version: 8.1.0
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `b2bgalat_galata`
--

-- --------------------------------------------------------

--
-- Table structure for table `order_status`
--

CREATE TABLE `order_status` (
  `id` int NOT NULL,
  `title` text COLLATE utf8mb3_persian_ci NOT NULL,
  `description` text COLLATE utf8mb3_persian_ci NOT NULL,
  `color` text COLLATE utf8mb3_persian_ci NOT NULL,
  `backColor` text COLLATE utf8mb3_persian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_persian_ci;

--
-- Dumping data for table `order_status`
--

INSERT INTO `order_status` (`id`, `title`, `description`, `color`, `backColor`) VALUES
(1, 'سبد خرید', 'سبد خرید', '#FFF', '#000'),
(2, 'در انتظار تایید سفارش', 'در انتظار تایید سفارش', '#FFAE00', '#FFF7E6'),
(3, 'در انتظار پرداخت', 'در انتظار پرداخت', '#FFAE00', '#FFF7E6'),
(4, 'در انتظار تایید پرداخت', 'در انتظار تایید پرداخت', '#FFAE00', '#FFF7E6'),
(5, 'درحال آماده سازی', 'درحال آماده سازی', '#003171', '#F2F4F8'),
(6, 'در انتظار تسویه وجه', 'در انتظار تسویه وجه', '#FFAE00', '#FFF7E6'),
(7, 'در انتظار تایید  تسویه وجه', 'در انتظار تایید  تسویه وجه', '#FFAE00', '#FFF7E6'),
(8, 'درحال پردازش سفارش', 'درحال پردازش سفارش', '#003171', '#F2F4F8'),
(9, 'ارسال شده', 'ارسال شده', '#EBF9F4', '#EBF9F4'),
(10, 'لغو شده', 'لغو شده', '#DE486C', '#FDF4F6'),
(11, 'مرجوع شد', 'مرجوع شد', '#DE486C', '#FDF4F6');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `order_status`
--
ALTER TABLE `order_status`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `order_status`
--
ALTER TABLE `order_status`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
