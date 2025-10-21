-- you can use this line to drop the database if you want to start from scratch
-- DROP DATABASE IF EXISTS online_shop_fullstack_rowing;

CREATE DATABASE online_shop_fullstack_rowing;
USE online_shop_fullstack_rowing;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: online_shop_fullstack_rowing
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `idCategory` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`idCategory`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `client_discount`
--

DROP TABLE IF EXISTS `client_discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_discount` (
  `idDiscount` int unsigned NOT NULL,
  `idUser` int unsigned NOT NULL,
  PRIMARY KEY (`idDiscount`,`idUser`),
  KEY `idUser` (`idUser`),
  CONSTRAINT `client_discount_ibfk_1` FOREIGN KEY (`idDiscount`) REFERENCES `discount` (`idDiscount`) ON UPDATE CASCADE,
  CONSTRAINT `client_discount_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `user` (`idUser`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `discount`
--

DROP TABLE IF EXISTS `discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount` (
  `idDiscount` int unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `value` int NOT NULL,
  PRIMARY KEY (`idDiscount`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `idProduct` int unsigned NOT NULL,
  `url` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`idProduct`,`url`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`idProduct`) REFERENCES `product` (`idProduct`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `idOrder` int unsigned NOT NULL AUTO_INCREMENT,
  `orderDate` datetime NOT NULL,
  `expectedPickupDate` datetime DEFAULT NULL,
  `actualPickupDate` datetime DEFAULT NULL,
  `idUser` int unsigned NOT NULL,
  `idPaymentMethod` int unsigned NOT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(50) DEFAULT NULL,
  `customer_notes` text,
  `sports` json DEFAULT NULL,
  `statusMp` varchar(50) DEFAULT NULL COMMENT 'Estado del pago en Mercado Pago: approved, pending, rejected, etc.',
  `currencyId` varchar(10) DEFAULT 'ARS' COMMENT 'Código de moneda: ARS, USD, etc.',
  `external_reference` varchar(255) DEFAULT NULL,
  `payment_id` varchar(255) DEFAULT NULL COMMENT 'Payment intent ID from Stripe',
  PRIMARY KEY (`idOrder`),
  KEY `idUser` (`idUser`),
  KEY `idPaymentMethod` (`idPaymentMethod`),
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `user` (`idUser`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_2` FOREIGN KEY (`idPaymentMethod`) REFERENCES `payment_method` (`idPaymentMethod`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_line`
--

DROP TABLE IF EXISTS `order_line`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_line` (
  `idOrderLine` int unsigned NOT NULL AUTO_INCREMENT,
  `idOrder` int unsigned NOT NULL,
  `idProduct` int unsigned NOT NULL,
  `idSize` int unsigned DEFAULT NULL,
  `quantity` int unsigned NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`idOrderLine`),
  UNIQUE KEY `uk_order_product` (`idOrder`,`idProduct`),
  KEY `fk_order_line_product` (`idProduct`),
  KEY `idSize` (`idSize`),
  CONSTRAINT `fk_order_line_order` FOREIGN KEY (`idOrder`) REFERENCES `order` (`idOrder`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_line_product` FOREIGN KEY (`idProduct`) REFERENCES `product` (`idProduct`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `order_line_ibfk_1` FOREIGN KEY (`idSize`) REFERENCES `size` (`idSize`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment_method`
--

DROP TABLE IF EXISTS `payment_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_method` (
  `idPaymentMethod` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `fees` int NOT NULL,
  PRIMARY KEY (`idPaymentMethod`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table data for table `payment_method`
--

INSERT INTO `payment_method` (`idPaymentMethod`, `name`, `fees`) 
VALUES (1, 'Stripe', 0);

--
-- Table structure for table `price`
--

DROP TABLE IF EXISTS `price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `price` (
  `idProduct` int unsigned NOT NULL,
  `updateDate` datetime NOT NULL,
  `value` int unsigned NOT NULL,
  PRIMARY KEY (`idProduct`,`updateDate`),
  CONSTRAINT `price_ibfk_1` FOREIGN KEY (`idProduct`) REFERENCES `product` (`idProduct`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `idProduct` int unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(400) NOT NULL,
  `name` varchar(255) NOT NULL,
  `stock` int unsigned DEFAULT NULL,
  `idCategory` int unsigned NOT NULL,
  PRIMARY KEY (`idProduct`),
  KEY `idCategory` (`idCategory`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`idCategory`) REFERENCES `category` (`idCategory`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_size`
--

DROP TABLE IF EXISTS `product_size`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_size` (
  `idProduct` int unsigned NOT NULL,
  `idSize` int unsigned NOT NULL,
  PRIMARY KEY (`idProduct`,`idSize`),
  KEY `idSize` (`idSize`),
  CONSTRAINT `product_size_ibfk_1` FOREIGN KEY (`idProduct`) REFERENCES `product` (`idProduct`) ON UPDATE CASCADE,
  CONSTRAINT `product_size_ibfk_2` FOREIGN KEY (`idSize`) REFERENCES `size` (`idSize`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `size`
--

DROP TABLE IF EXISTS `size`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `size` (
  `idSize` int unsigned NOT NULL AUTO_INCREMENT,
  `sizeDesc` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  PRIMARY KEY (`idSize`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table data for table `size`
--

INSERT INTO size (sizeDesc)
VALUES ('XS'), ('S'), ('M'), ('L'), ('XL'), ('XXL'), ('Único');

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status` (
  `idOrder` int unsigned NOT NULL,
  `statusDate` datetime NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`idOrder`,`statusDate`),
  CONSTRAINT `status_ibfk_1` FOREIGN KEY (`idOrder`) REFERENCES `order` (`idOrder`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `idUser` int unsigned NOT NULL AUTO_INCREMENT,
  `dni` int unsigned DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `imgProfile` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `isMember` tinyint(1) NOT NULL,
  `registrationDate` datetime NOT NULL,
  `status` varchar(150) NOT NULL,
  `activationToken` varchar(255) DEFAULT NULL,
  `activationTokenExpires` datetime DEFAULT NULL,
  `passwordResetTokenHash` varchar(255) DEFAULT NULL,
  `passwordResetTokenExpiresAt` datetime DEFAULT NULL,
  `passwordResetTokenUsedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

