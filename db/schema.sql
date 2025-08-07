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
    PRIMARY KEY(`idPaymentMethod`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`(
	`idCategory` int unsigned NOT NULL auto_increment,
    `name` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`idCategory`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `size`;
CREATE TABLE `size`(
	`idSize` int unsigned NOT NULL auto_increment,
    `sizeDesc` VARCHAR(255) NOT NULL,
    `gender` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`idSize`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `discount`;
CREATE TABLE `discount`(
	`idDiscount` int unsigned NOT NULL auto_increment,
    `description` VARCHAR(255) NOT NULL,
    `value` int NOT NULL,
    PRIMARY KEY(`idDiscount`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `product`;
CREATE TABLE `product`(
	  `idProduct` int unsigned NOT NULL auto_increment,
    `description` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `stock` int unsigned,
    `idCategory` int unsigned not null,
    PRIMARY KEY(`idProduct`),
    FOREIGN KEY(`idCategory`) REFERENCES `category` (`idCategory`) ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `price`;
CREATE TABLE `price`(
	`idProduct` int unsigned NOT NULL auto_increment,
    `updateDate` datetime NOT NULL,
    `value` int unsigned NOT NULL,
    PRIMARY KEY(`idProduct`, `updateDate`),
    CONSTRAINT `fk_price_product` FOREIGN KEY(`idProduct`) REFERENCES `product` (`product`) ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*int(value) is now deprecated. Before was only for visualization, but nowadays it might generate errors*/