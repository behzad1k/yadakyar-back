-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 07, 2023 at 03:16 PM
-- Server version: 8.0.33
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nilman`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb3_persian_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb3_persian_ci NOT NULL,
  `phoneNumber` varchar(255) COLLATE utf8mb3_persian_ci DEFAULT NULL,
  `longitude` varchar(255) COLLATE utf8mb3_persian_ci NOT NULL,
  `latitude` varchar(255) COLLATE utf8mb3_persian_ci NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `userId` int NOT NULL,
  `district` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_persian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `like`
--

CREATE TABLE `like` (
  `id` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_persian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int NOT NULL,
  `price` int NOT NULL,
  `discount` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb3_persian_ci NOT NULL,
  `workerId` int DEFAULT NULL,
  `productId` int NOT NULL,
  `attributeId` int DEFAULT NULL,
  `transportation` int NOT NULL DEFAULT '0',
  `addressId` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `inCart` tinyint NOT NULL DEFAULT '1',
  `fromTime` int NOT NULL,
  `toTime` int NOT NULL,
  `date` varchar(255) COLLATE utf8mb3_persian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_persian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_attribute`
--

CREATE TABLE `order_attribute` (
  `orderId` int NOT NULL,
  `productId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_persian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb3_persian_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb3_persian_ci NOT NULL,
  `price` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `slug` varchar(255) COLLATE utf8mb3_persian_ci NOT NULL,
  `parentId` int DEFAULT NULL,
  `section` int NOT NULL,
  `nsleft` int NOT NULL DEFAULT '1',
  `nsright` int NOT NULL DEFAULT '2'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_persian_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `title`, `description`, `price`, `createdAt`, `updatedAt`, `slug`, `parentId`, `section`, `nsleft`, `nsright`) VALUES
(1, 'ناخن', 'ناخن', 0, '2023-10-07 18:14:58.000367', '2023-10-07 18:14:58.000367', 'ناخن', NULL, 0, 1, 2),
(2, 'مانیکور', 'مانیکور', 0, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'مانیکور', 1, 0, 1, 2),
(3, 'مانیکور', 'مانیکور', 120000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'مانیکور', 2, 1, 1, 2),
(4, 'ژلیش', 'ژلیش', 0, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'ژلیش', 1, 0, 1, 2),
(5, 'ژلیش ساده', 'ژلیش ساده', 130000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'ژلیش-ساده', 4, 1, 1, 2),
(6, 'ژلیش با طراحی (۲ ناخن)', 'ژلیش با طراحی (۲ ناخن)', 165000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'ژلیش-طراحی-دو-ناخن', 4, 1, 1, 2),
(7, 'ژلیش با طراحی کلی', 'ژلیش با طراحی کلی', 210000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'ژلیش-با-طراحی-کلی', 4, 1, 1, 2),
(8, 'ژلیش با طراحی فرنچ', 'ژلیش با طراحی فرنچ', 155000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'ژلیش-با-طراحی-فرنچ', 4, 1, 1, 2),
(9, 'ژلیش با طراحی کروم', 'ژلیش با طراحی کروم', 155000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'ژلیش-با-طراحی-کروم', 4, 1, 1, 2),
(10, 'ژلیش با طراحی بیبی بومر', 'ژلیش با طراحی بیبی بومر', 210000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'ژلیش-با-طراحی-بیبی-بومر', 4, 1, 1, 2),
(11, 'سوهان کشی', 'سوهان کشی', 0, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'سوهان-کشی', 1, 0, 1, 2),
(12, 'سوهان کشی', 'سوهان کشی', 35000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'سوهان-کشی', 11, 1, 1, 2),
(13, 'لمینت', 'لمینت', 0, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'لمینت', 1, 0, 1, 2),
(14, 'کاور لمینت', 'کاور لمینت', 230000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'کاور-لمینت', 13, 1, 1, 2),
(15, 'ترمیم لمینت', 'ترمیم لمینت', 150000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'ترمیم-لمینت', 13, 1, 1, 2),
(16, 'کاشت و ترمیم پودر', 'کاشت و ترمیم پودر', 0, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'کاشت-ترمیم-پودر', 1, 0, 1, 2),
(17, 'کاشت پودر', 'کاشت پودر', 420000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'کاشت-پودر', 16, 1, 1, 2),
(18, 'کاور پودر', 'کاور پودر', 260000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'کاور-پودر', 16, 1, 1, 2),
(19, 'ترمیم پودر', 'ترمیم پودر', 165000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'ترمیم-پودر', 16, 1, 1, 2),
(20, 'کاشت بیبی بومر', 'کاشت بیبی بومر', 500000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'کاشت-بیبی-بومر', 16, 1, 1, 2),
(21, 'ترمیم بیبی بومر', 'ترمیم بیبی بومر', 280000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'ترمیم-بیبی-بومر', 16, 1, 1, 2),
(22, 'کاشت و ترمیم ژل', 'کاشت و ترمیم ژل', 0, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'کاشت-ترمیم-ژل', 1, 0, 1, 2),
(23, 'کاشت ژل', 'کاشت ژل', 450000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'کاشت-ژل', 22, 1, 1, 2),
(24, 'ترمیم ژل', 'ترمیم ژل', 185000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'ترمیم-ژل', 22, 1, 1, 2),
(25, 'کاور ژل', 'کاور ژل', 280000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'کاور-ژل', 22, 1, 1, 2),
(26, 'کاشت پلی ژل', 'کاشت پلی ژل', 480000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'کاشت-پلی-ژل', 22, 1, 1, 2),
(27, 'ترمیم پلی ژل', 'ترمیم پلی ژل', 195000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'ترمیم-پلی-ژل', 22, 1, 1, 2),
(28, 'کاور پلی ژل', 'کاور پلی ژل', 300000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'کاور-پلی-ژل', 22, 1, 1, 2),
(29, 'ریمو کاشت', 'ریمو کاشت', 0, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'ریمو-کاشت', 1, 0, 1, 2),
(30, 'ریمو کاشت', 'ریمو کاشت', 40000, '2023-10-07 18:17:28.577794', '2023-10-07 18:17:28.577794', 'ریمو-کاشت2', 29, 1, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `phoneNumber` varchar(255) COLLATE utf8mb3_persian_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb3_persian_ci DEFAULT NULL,
  `lastName` varchar(255) COLLATE utf8mb3_persian_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb3_persian_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb3_persian_ci NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `tmpCode` varchar(255) COLLATE utf8mb3_persian_ci DEFAULT NULL,
  `nationalCode` varchar(255) COLLATE utf8mb3_persian_ci DEFAULT NULL,
  `productId` int DEFAULT NULL,
  `district` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_persian_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `phoneNumber`, `name`, `lastName`, `password`, `role`, `createdAt`, `updatedAt`, `tmpCode`, `nationalCode`, `productId`, `district`) VALUES
(1, '09939160502', 'behzad', 'koohyani', '$2a$10$gYJnyZwwWXIa1zixCAnpv.QA7Cwp9hwYS0Zvz4bwZtgo91CkRbcfK', 'SUPER_ADMIN', '2023-10-07 18:10:08.652666', '2023-10-07 18:13:23.000000', '', '1272921972', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `worker_offs`
--

CREATE TABLE `worker_offs` (
  `id` int NOT NULL,
  `orderId` int DEFAULT NULL,
  `workerId` int NOT NULL,
  `fromTime` int NOT NULL,
  `toTime` int NOT NULL,
  `date` varchar(255) COLLATE utf8mb3_persian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_persian_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_d25f1ea79e282cc8a42bd616aa3` (`userId`);

--
-- Indexes for table `like`
--
ALTER TABLE `like`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_caabe91507b3379c7ba73637b84` (`userId`),
  ADD KEY `FK_c721e93645fdc15f040096d1eaa` (`productId`),
  ADD KEY `FK_a5879a088b6617e700244721980` (`workerId`),
  ADD KEY `FK_73f9a47e41912876446d047d015` (`addressId`);

--
-- Indexes for table `order_attribute`
--
ALTER TABLE `order_attribute`
  ADD PRIMARY KEY (`orderId`,`productId`),
  ADD KEY `IDX_63538956ba5588e56d31ccf9f3` (`orderId`),
  ADD KEY `IDX_20689d88c44d263e459c252c71` (`productId`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_c5906ffd2cd6fa558710901e4d0` (`parentId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_4c9b9b7a77b01d39fbe8238b774` (`productId`);

--
-- Indexes for table `worker_offs`
--
ALTER TABLE `worker_offs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_fc9494461bc686af9f2c4b5d523` (`orderId`),
  ADD KEY `FK_a0331f14c4472b0bdf44e95fe7f` (`workerId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `like`
--
ALTER TABLE `like`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `worker_offs`
--
ALTER TABLE `worker_offs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `FK_d25f1ea79e282cc8a42bd616aa3` FOREIGN KEY (`userId`) REFERENCES `user` (`id`);

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `FK_73f9a47e41912876446d047d015` FOREIGN KEY (`addressId`) REFERENCES `address` (`id`),
  ADD CONSTRAINT `FK_a5879a088b6617e700244721980` FOREIGN KEY (`workerId`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_c721e93645fdc15f040096d1eaa` FOREIGN KEY (`productId`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `FK_caabe91507b3379c7ba73637b84` FOREIGN KEY (`userId`) REFERENCES `user` (`id`);

--
-- Constraints for table `order_attribute`
--
ALTER TABLE `order_attribute`
  ADD CONSTRAINT `FK_20689d88c44d263e459c252c71d` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_63538956ba5588e56d31ccf9f3c` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `FK_c5906ffd2cd6fa558710901e4d0` FOREIGN KEY (`parentId`) REFERENCES `product` (`id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_4c9b9b7a77b01d39fbe8238b774` FOREIGN KEY (`productId`) REFERENCES `product` (`id`);

--
-- Constraints for table `worker_offs`
--
ALTER TABLE `worker_offs`
  ADD CONSTRAINT `FK_a0331f14c4472b0bdf44e95fe7f` FOREIGN KEY (`workerId`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_fc9494461bc686af9f2c4b5d523` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
