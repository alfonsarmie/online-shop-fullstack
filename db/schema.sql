CREATE DATABASE online_shop_fullstack_rowing;
USE online_shop_fullstack_rowing;

DROP TABLE IF EXISTS `client`;
CREATE TABLE `client` (
  `idClient` int unsigned NOT NULL auto_increment,
  `userName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `imgProfile` varchar(255),
  `role` varchar(50),
  `isMember` BOOLEAN NOT NULL,
  `registrationDate` datetime NOT NULL,
  PRIMARY KEY(`idClient`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*El collate ai_ci nos indica que es indiferente las mayusculas de minusculas*/

DROP TABLE IF EXISTS `recepcionist`;
CREATE TABLE `recepcionist` (
  `idRecepcionist` int unsigned NOT NULL auto_increment,
  `userName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `imgProfile` varchar(255),
  `role` varchar(50),
  `registrationDate` datetime NOT NULL,
  PRIMARY KEY(`idRecepcionist`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `idAdmin` int unsigned NOT NULL auto_increment,
  `userName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `imgProfile` varchar(255),
  `role` varchar(50),
  `registrationDate` datetime NOT NULL,
  PRIMARY KEY(`idAdmin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `payment_method`;
CREATE TABLE `payment_method` (
	`idPaymentMethod` int unsigned NOT NULL auto_increment,
    `name` varchar(255) NOT NULL,
    `fees` int NOT NULL,
    primary key (`idPaymentMethod`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`(
	`idCategory` int unsigned NOT NULL auto_increment,
    `name` VARCHAR(255) NOT NULL,
    primary key(`idCategory`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `size`;
CREATE TABLE `size`(
	`idSize` int unsigned NOT NULL auto_increment,
    `sizeDesc` VARCHAR(255) NOT NULL,
    `gender` VARCHAR(255) NOT NULL,
    primary key(`idSize`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `discount`;
CREATE TABLE `discount`(
	`idDiscount` int unsigned NOT NULL auto_increment,
    `description` VARCHAR(255) NOT NULL,
    `value` int NOT NULL,
    primary key(`idDiscount`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
