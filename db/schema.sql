CREATE DATABASE online_shop_fullstack_rowing;
USE online_shop_fullstack_rowing;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `idUser` int unsigned NOT NULL auto_increment,
  `dni` int unsigned NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `imgProfile` varchar(255) NULL,
  `role` varchar(50),
  `isMember` BOOLEAN NOT NULL,
  `registrationDate` datetime NOT NULL,
  `status` varchar(150) NOT NULL,
  `activationToken` varchar(255) NULL,
  `activationTokenExpires` datetime NULL,
  `passwordResetTokenHash` varchar(255) NULL,
  `passwordResetTokenExpiresAt` datetime NULL,
  `passwordResetTokenUsedAt` datetime NULL,
  PRIMARY KEY(`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*El collate ai_ci nos indica que es indiferente las mayusculas de minusculas*/

/*
In case you missed a status column to the user table, you can uncomment the following lines:

ALTER TABLE `user`
ADD COLUMN `status` VARCHAR(50) NOT NULL;
*/



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
  `idProduct` int unsigned NOT NULL,
  `updateDate` datetime NOT NULL,
  `value` int unsigned NOT NULL,
  PRIMARY KEY(`idProduct`, `updateDate`),
  FOREIGN KEY(`idProduct`) REFERENCES `product` (`idProduct`) ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*int(value) is now deprecated. Before was only for visualization, but nowadays it might generate errors*/


DROP TABLE IF EXISTS `images`;
CREATE TABLE `images`(
  `idProduct` int unsigned NOT NULL,
  `url` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY(`idProduct`, `url`),
  FOREIGN KEY(`idProduct`) REFERENCES `product` (`idProduct`) ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `product_size`;
CREATE TABLE `product_size`(
  `idProduct` int unsigned NOT NULL,
  `idSize` int unsigned NOT NULL,
  PRIMARY KEY(`idProduct`, `idSize`),
  FOREIGN KEY(`idProduct`) REFERENCES `product` (`idProduct`) ON UPDATE CASCADE,
  FOREIGN KEY(`idSize`) REFERENCES `size` (`idSize`) ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `client_discount`;
CREATE TABLE `client_discount`(
  `idDiscount` int unsigned NOT NULL,
  `idUser` int unsigned NOT NULL,
  PRIMARY KEY(`idDiscount`, `idUser`),
  FOREIGN KEY(`idDiscount`) REFERENCES `discount` (`idDiscount`) ON UPDATE CASCADE,
  FOREIGN KEY(`idUser`) REFERENCES `user` (`idUser`) ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `order`;
CREATE TABLE `order`(
  `idOrder` int unsigned NOT NULL auto_increment,
  `orderDate` datetime NOT NULL,
  `expectedPickupDate` datetime NULL,
  `actualPickupDate` datetime NULL,
  `idUser` int unsigned NOT NULL,
  `idPaymentMethod` int unsigned NOT NULL,
  `external_reference` varchar(255) NULL,
  `payment_id` varchar(255) NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(50) NULL,
  `customer_notes` text NULL,
  `sports` JSON NULL,
  `statusMp` varchar(50) NULL COMMENT 'Estado del pago en Mercado Pago: approved, pending, rejected, etc.',
  `currencyId` varchar(10) NULL DEFAULT 'ARS' COMMENT 'Código de moneda: ARS, USD, etc.',
  PRIMARY KEY(`idOrder`),
  FOREIGN KEY(`idUser`) REFERENCES `user` (`idUser`) ON UPDATE CASCADE,
  FOREIGN KEY(`idPaymentMethod`) REFERENCES `payment_method` (`idPaymentMethod`) ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `status`;
CREATE TABLE `status`(
  `idOrder` int unsigned NOT NULL,
  `statusDate` datetime NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY(`idOrder`, `statusDate`),
  FOREIGN KEY(`idOrder`) REFERENCES `order` (`idOrder`) ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `order_line`;
CREATE TABLE `order_line`(
  `idOrder` int unsigned NOT NULL,
  `idProduct` int unsigned NOT NULL,
  `quantity` int unsigned NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `size` varchar(50) NULL,
  `product_name` varchar(255) NOT NULL,
  PRIMARY KEY(`idOrder`, `idProduct`),
  FOREIGN KEY(`idOrder`) REFERENCES `order` (`idOrder`) ON UPDATE CASCADE,
  FOREIGN KEY(`idProduct`) REFERENCES `product` (`idProduct`) ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;